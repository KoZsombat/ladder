# 01_records

## Hint 1
`encoding/binary` and `hash/crc32`. Encode is six lines; Decode is the same
in reverse with three guards.

## Hint 2
```go
func Encode(key, val []byte) []byte {
	buf := make([]byte, HeaderSize+len(key)+len(val))
	binary.LittleEndian.PutUint32(buf[4:], uint32(len(key)))
	binary.LittleEndian.PutUint32(buf[8:], uint32(len(val)))
	copy(buf[HeaderSize:], key)
	copy(buf[HeaderSize+len(key):], val)
	binary.LittleEndian.PutUint32(buf[0:], crc32.ChecksumIEEE(buf[4:]))
	return buf
}
```

## Hint 3
```go
func Decode(buf []byte) (key, val []byte, n int, err error) {
	if len(buf) < HeaderSize {
		return nil, nil, 0, ErrShort
	}
	want := binary.LittleEndian.Uint32(buf[0:])
	kl := int(binary.LittleEndian.Uint32(buf[4:]))
	vl := int(binary.LittleEndian.Uint32(buf[8:]))
	total := HeaderSize + kl + vl
	if len(buf) < total {
		return nil, nil, 0, ErrShort
	}
	if crc32.ChecksumIEEE(buf[4:total]) != want {
		return nil, nil, 0, ErrCorrupt
	}
	return buf[HeaderSize : HeaderSize+kl], buf[HeaderSize+kl : total], total, nil
}
```
Guard the lengths before trusting them: a corrupt header can claim a
four-gigabyte value, and `make` on that number takes the process down before
the CRC ever gets a chance to notice.

## Hint 4
```go
func Scan(buf []byte, fn func(key, val []byte)) (int, error) {
	off := 0
	for off < len(buf) {
		k, v, n, err := Decode(buf[off:])
		if err != nil {
			return off, err
		}
		fn(k, v)
		off += n
	}
	return off, nil
}
```
Note it returns the offset AND the error. The caller wants both: the offset
to truncate to, and the error to decide whether to log a warning.
