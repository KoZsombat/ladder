package records

// Binary framing on disk. The same problem as a socket, met here first,
// where you can hexdump the result and look at it.
//
// Layout:
//
//	[crc32:4][keyLen:4][valLen:4][key][value]
//
// The LENGTHS tell you where the next record begins. The CRC tells you
// whether the last write was torn — which is the only reason the whole
// design survives a kill -9.

const HeaderSize = 12

// Encode builds one record.
//
// TODO: implement this.
//
//	Allocate HeaderSize+len(key)+len(val) bytes, then use
//	binary.LittleEndian.PutUint32 for the three header fields, copy the key
//	and value in, and finally compute
//
//	    crc32.ChecksumIEEE(buf[4:])
//
//	and write it into buf[0:4].
//
//	THE BOUNDARY: the CRC covers everything AFTER itself. Include the CRC
//	field in its own checksum and it can never match; exclude too much and
//	corruption slips through. Getting this wrong gives you a checksum that
//	always passes, which is worse than having none because you will trust it.
func Encode(key, val []byte) []byte {
	panic("TODO: Encode")
}

// Decode reads one record from the front of buf.
//
// TODO: implement this.
//
//	Return the key, the value, how many bytes the record occupied, and an
//	error.
//
//	THREE failure modes, and they are DIFFERENT:
//	  - buf shorter than HeaderSize  -> ErrShort (an incomplete header)
//	  - buf shorter than the record  -> ErrShort (an incomplete body)
//	  - CRC mismatch                 -> ErrCorrupt
//
//	Distinguishing "incomplete" from "corrupt" matters at replay time: the
//	first is the normal end of a log that was being written when the
//	process died, the second means something actually damaged the file.
//	Both stop the scan, but only one deserves a loud warning.
func Decode(buf []byte) (key, val []byte, n int, err error) {
	panic("TODO: Decode")
}

// Scan walks every complete record in buf and calls fn for each.
// It returns the offset of the first incomplete or corrupt record.
//
// TODO: implement this.
//
//	This is the replay loop. Return the offset where scanning STOPPED —
//	the store truncates the file there so the next write starts from clean
//	ground rather than appending after garbage.
func Scan(buf []byte, fn func(key, val []byte)) (end int, err error) {
	panic("TODO: Scan")
}
