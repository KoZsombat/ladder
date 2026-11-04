package iox

import (
	"bytes"
	"strings"
	"testing"
)

func TestCountLines(t *testing.T) {
	n, err := CountLines(strings.NewReader("a\nb\nc\n"))
	if n != 3 || err != nil {
		t.Errorf("= (%d,%v), want (3,nil)", n, err)
	}
	if n, _ := CountLines(strings.NewReader("a\nb")); n != 2 {
		t.Errorf("no trailing newline = %d, want 2", n)
	}
	if n, _ := CountLines(strings.NewReader("")); n != 0 {
		t.Errorf("empty = %d, want 0", n)
	}
}

func TestGrep(t *testing.T) {
	got, err := Grep(strings.NewReader("apple\nbanana\napricot\n"), "ap")
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 2 || got[0] != "apple" || got[1] != "apricot" {
		t.Errorf("Grep = %v", got)
	}
}

func TestTeeCount(t *testing.T) {
	var buf bytes.Buffer
	n, err := TeeCount(&buf, strings.NewReader("hello"))
	if n != 5 || err != nil {
		t.Errorf("= (%d,%v), want (5,nil)", n, err)
	}
	if buf.String() != "hello" {
		t.Errorf("buf = %q", buf.String())
	}
}

func TestCountingWriter(t *testing.T) {
	var buf bytes.Buffer
	cw := &CountingWriter{W: &buf}
	cw.Write([]byte("abc"))
	cw.Write([]byte("de"))
	if cw.N != 5 {
		t.Errorf("N = %d, want 5", cw.N)
	}
	if buf.String() != "abcde" {
		t.Errorf("buf = %q", buf.String())
	}
}
