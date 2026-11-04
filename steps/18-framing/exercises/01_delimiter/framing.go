package framing

import "io"

// The six lines that sit under HTTP keep-alive, WebSocket frames and every
// database driver you have used.
//
// Keep a buffer. On every Read, append what arrived. Then, WHILE the buffer
// contains a complete message, slice it off and hand it over. Keep the
// remainder for next time.

// ReadLines calls fn for each '\n'-terminated message in r.
//
// TODO: implement this.
//
//	  var buf []byte
//	  tmp := make([]byte, 4096)
//	  for {
//	      n, err := r.Read(tmp)
//	      if n > 0 {
//	          buf = append(buf, tmp[:n]...)
//	          for {
//	              i := bytes.IndexByte(buf, '\n')
//	              if i < 0 { break }     // incomplete: wait for more
//	              fn(buf[:i])
//	              buf = buf[i+1:]        // KEEP the remainder
//	          }
//	          if len(buf) > maxMessage { return ErrTooLong }
//	      }
//	      if err != nil { ... }
//	  }
//
//	Two things that are not optional:
//
//	ALIASING: the slice you hand to fn points INTO buf, which you are about
//	to append to and reslice. If fn keeps it, it will change underneath.
//	The test below checks for exactly this, so pass a copy.
//
//	THE CAP: a peer that never sends a delimiter would otherwise grow the
//	buffer until you run out of memory. That is a denial of service with no
//	attacker required — just a bug on the other end.
//
//	io.EOF is a clean end, not a failure. Return nil for it.
func ReadLines(r io.Reader, maxMessage int, fn func(line []byte)) error {
	panic("TODO: ReadLines")
}
