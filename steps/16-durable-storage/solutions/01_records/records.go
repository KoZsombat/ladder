package records

import (
	"encoding/binary"
	"hash/crc32"
)

const HeaderSize = 12

func Encode(key, val []byte) []byte {
	buf := make([]byte, HeaderSize+len(key)+len(val))
	binary.LittleEndian.PutUint32(buf[4:], uint32(len(key)))
	binary.LittleEndian.PutUint32(buf[8:], uint32(len(val)))
	copy(buf[HeaderSize:], key)
	copy(buf[HeaderSize+len(key):], val)
	binary.LittleEndian.PutUint32(buf[0:], crc32.ChecksumIEEE(buf[4:]))
	return buf
}

func Decode(buf []byte) (key, val []byte, n int, err error) {
	if len(buf) < HeaderSize {
		return nil, nil, 0, ErrShort
	}
	want := binary.LittleEndian.Uint32(buf[0:])
	kl := int(binary.LittleEndian.Uint32(buf[4:]))
	vl := int(binary.LittleEndian.Uint32(buf[8:]))
	if kl < 0 || vl < 0 {
		return nil, nil, 0, ErrCorrupt
	}
	total := HeaderSize + kl + vl
	if total < HeaderSize || len(buf) < total {
		return nil, nil, 0, ErrShort
	}
	if crc32.ChecksumIEEE(buf[4:total]) != want {
		return nil, nil, 0, ErrCorrupt
	}
	return buf[HeaderSize : HeaderSize+kl], buf[HeaderSize+kl : total], total, nil
}

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
