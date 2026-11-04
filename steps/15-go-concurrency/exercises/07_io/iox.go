package iox

import (
	"io"
)

// io.Reader and io.Writer are the two most important interfaces in Go, and
// both have exactly one method. Everything streams through them: files,
// network connections, HTTP bodies, gzip, in-memory buffers, stdin.
//
//	type Reader interface { Read(p []byte) (n int, err error) }
//
// The contract has a sharp edge that catches everyone: Read may return
// FEWER bytes than you asked for, and n > 0 can come together with
// err == io.EOF. So you never assume one Read gives you everything.
//
// That is the same lesson as framing on a socket, one layer down — which is
// why this exercise sits right before the socket bridge on the ladder.

// CountLines returns how many lines r contains.
// A final line without a trailing newline still counts.
//
// TODO: implement this.
//
//	Use bufio.Scanner: it handles the partial-read problem for you.
//
//	    sc := bufio.NewScanner(r)
//	    for sc.Scan() { ... }
//	    return n, sc.Err()
//
//	Scanner has a default maximum token size of 64KB. On a longer line it
//	stops and sc.Err() reports bufio.ErrTooLong. Silently returning a short
//	count because you ignored sc.Err() is a real bug people ship.
func CountLines(r io.Reader) (int, error) {
	return 0, nil
}

// Grep returns the lines of r that contain substr.
//
// TODO: implement this, also with bufio.Scanner.
//
//	Note sc.Text() returns a string that is safe to keep, while sc.Bytes()
//	returns a slice into the scanner's own buffer that the NEXT Scan call
//	overwrites. Appending sc.Bytes() to a slice is the aliasing bug from
//	exercise 02, wearing a different hat.
func Grep(r io.Reader, substr string) ([]string, error) {
	return nil, nil
}

// TeeCount copies r to w and reports how many bytes went through.
//
// TODO: implement this.
//
//	io.Copy already returns the count, so this is nearly a one-liner.
//	io.Copy also uses a 32KB buffer and handles short reads, which is why
//	you should essentially never write a read/write loop by hand.
func TeeCount(w io.Writer, r io.Reader) (int64, error) {
	return 0, nil
}

// CountingWriter wraps a Writer and counts the bytes written through it.
type CountingWriter struct {
	W io.Writer
	N int64
}

// TODO: give *CountingWriter a Write method so it satisfies io.Writer.
//
//	    func (c *CountingWriter) Write(p []byte) (int, error) {
//	        n, err := c.W.Write(p)
//	        c.N += int64(n)        // add what was ACTUALLY written, not len(p)
//	        return n, err
//	    }
//
//	Adding len(p) instead of n is wrong on a short write, and short writes
//	are exactly what the interface warns you about. This decorator pattern —
//	a type that wraps an interface and implements the same interface — is
//	how gzip, bufio, TLS and every middleware in Go are built.

var _ io.Writer = (*CountingWriter)(nil)
