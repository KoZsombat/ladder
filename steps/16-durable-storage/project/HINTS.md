# 13 — Hints

## Tier 1 — order of work
1. `Encode` / `DecodeHeader` with a round-trip unit test of your own.
2. `Open` + `Put` + `Get` with NO replay (index built only in this process).
3. `replay`, then the restart test.
4. CRC checking and the truncation test.
5. `Delete` and tombstones.
6. `Compact`.

Do not start on compaction before the crash test passes.

## Tier 2 — the record
```go
func Encode(key, val []byte, tombstone bool) []byte {
    vl := uint32(len(val))
    if tombstone { vl = TombstoneMarker }
    buf := make([]byte, HeaderSize+len(key)+len(val))
    binary.LittleEndian.PutUint64(buf[4:], uint64(time.Now().UnixMilli()))
    binary.LittleEndian.PutUint32(buf[12:], uint32(len(key)))
    binary.LittleEndian.PutUint32(buf[16:], vl)
    copy(buf[HeaderSize:], key)
    copy(buf[HeaderSize+len(key):], val)
    binary.LittleEndian.PutUint32(buf[0:], crc32.ChecksumIEEE(buf[4:]))
    return buf
}
```

## Tier 3 — replay
```go
func (s *Store) replay() error {
    s.index = make(map[string]location)
    var off int64
    hdr := make([]byte, HeaderSize)
    for {
        if _, err := s.f.ReadAt(hdr, off); err != nil {
            break // EOF or a torn header: the log ends here
        }
        crc, kl, vl, tomb, err := DecodeHeader(hdr)
        if err != nil { break }

        vlen := vl
        if tomb { vlen = 0 }
        total := int64(HeaderSize) + int64(kl) + int64(vlen)
        rec := make([]byte, total)
        if _, err := s.f.ReadAt(rec, off); err != nil {
            break // torn body
        }
        if crc32.ChecksumIEEE(rec[4:]) != crc {
            break // corrupt: stop, do not panic
        }

        key := string(rec[HeaderSize : HeaderSize+kl])
        if tomb {
            delete(s.index, key)
        } else {
            s.index[key] = location{offset: off, length: uint32(total)}
        }
        off += total
    }
    if err := s.f.Truncate(off); err != nil { return err }
    s.offset = off
    return nil
}
```

## Tier 4 — compaction's atomic swap
```go
tmp, err := os.CreateTemp(s.dir, "compact-*")
// ... write live records, build newIndex ...
if err := tmp.Sync(); err != nil { return err }
if err := tmp.Close(); err != nil { return err }
if err := os.Rename(tmp.Name(), s.path); err != nil { return err }

// fsync the DIRECTORY, or the rename can be lost
d, err := os.Open(s.dir)
if err != nil { return err }
defer d.Close()
return d.Sync()
```

## Tier 5 — stretch
Size-tiered design: several immutable segment files plus one active writer.
That is the step from Bitcask toward an LSM tree, and the point where
RocksDB's compaction settings stop being mysterious.
