package framing

import (
	"bytes"
	"errors"
	"io"
)

func ReadLines(r io.Reader, maxMessage int, fn func(line []byte)) error {
	var buf []byte
	tmp := make([]byte, 4096)
	for {
		n, err := r.Read(tmp)
		if n > 0 {
			buf = append(buf, tmp[:n]...)
			for {
				i := bytes.IndexByte(buf, '\n')
				if i < 0 {
					break
				}
				line := make([]byte, i)
				copy(line, buf[:i])
				fn(line)
				buf = buf[i+1:]
			}
			if len(buf) > maxMessage {
				return ErrTooLong
			}
		}
		if err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			}
			return err
		}
	}
}
