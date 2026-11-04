package bridge

import "io"

// ReadLoop is the six lines that sit under HTTP keep-alive, WebSocket frames
// and every database driver you have used.
//
// TODO: implement this.
//
//	Keep a buffer. On every Read, append what you got. Then, WHILE the
//	buffer contains a complete message (here: a '\n'), slice it off and hand
//	it to `handle`. Keep the remainder for next time.
//
//	  buf = append(buf, tmp[:n]...)
//	  for {
//	      i := bytes.IndexByte(buf, '\n')
//	      if i < 0 { break }            // incomplete: wait for more
//	      line := buf[:i]
//	      buf = buf[i+1:]               // KEEP the remainder
//	      handle(line)
//	  }
//
//	Two things that are not optional:
//	  - `line` points into `buf`, which you are about to reuse. If `handle`
//	    keeps it, copy it first. This is the slice-aliasing trap again.
//	  - cap the buffer. A peer that never sends a delimiter would otherwise
//	    grow it until you run out of memory.
func ReadLoop(r io.Reader, maxMessage int, handle func(line []byte)) error {
	panic("TODO: ReadLoop")
}
