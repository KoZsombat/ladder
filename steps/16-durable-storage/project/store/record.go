package store

// On-disk record layout:
//
//	[crc32:4][timestamp:8][keyLen:4][valLen:4][key][value]
//
// The lengths tell you where the next record begins — the same framing
// problem as a socket, met here on disk first.
// The CRC tells you whether the last write was torn.

const HeaderSize = 20

// TombstoneMarker in the valLen field means "this key was deleted".
// Deletion is a RECORD, not a removal: you cannot remove from the middle of
// an append-only file. Compaction drops it later.
const TombstoneMarker = ^uint32(0) // math.MaxUint32

// Encode builds one record.
//
// TODO: implement this.
//
//	Allocate HeaderSize+len(key)+len(val) bytes, then with
//	binary.LittleEndian.PutUint64/PutUint32:
//	  [4:12]  timestamp  (time.Now().UnixMilli())
//	  [12:16] len(key)
//	  [16:20] len(val), or TombstoneMarker when tombstone is true
//	  then copy key, then val
//	  finally [0:4] = crc32.ChecksumIEEE(buf[4:])
//
//	The CRC covers everything AFTER itself. Getting that boundary wrong
//	means your checksum always passes and you have no corruption detection
//	at all, which you will not notice until it matters.
func Encode(key, val []byte, tombstone bool) []byte {
	panic("TODO: Encode")
}

// DecodeHeader reads the fixed part of a record.
//
// TODO: implement this. Return the crc, keyLen, valLen and whether it is a
// tombstone. Return an error if the slice is shorter than HeaderSize.
func DecodeHeader(b []byte) (crc uint32, keyLen, valLen uint32, tombstone bool, err error) {
	panic("TODO: DecodeHeader")
}
