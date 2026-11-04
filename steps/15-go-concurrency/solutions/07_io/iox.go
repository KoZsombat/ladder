package iox

import (
	"bufio"
	"io"
	"strings"
)

func CountLines(r io.Reader) (int, error) {
	sc := bufio.NewScanner(r)
	n := 0
	for sc.Scan() {
		n++
	}
	return n, sc.Err()
}

func Grep(r io.Reader, substr string) ([]string, error) {
	sc := bufio.NewScanner(r)
	var out []string
	for sc.Scan() {
		if line := sc.Text(); strings.Contains(line, substr) {
			out = append(out, line)
		}
	}
	return out, sc.Err()
}

func TeeCount(w io.Writer, r io.Reader) (int64, error) {
	return io.Copy(w, r)
}

type CountingWriter struct {
	W io.Writer
	N int64
}

func (c *CountingWriter) Write(p []byte) (int, error) {
	n, err := c.W.Write(p)
	c.N += int64(n)
	return n, err
}

var _ io.Writer = (*CountingWriter)(nil)
