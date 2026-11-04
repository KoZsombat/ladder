package framing

import (
	"bytes"
	"errors"
	"io"
	"strings"
	"testing"
)

// chunkReader returns exactly the chunks it was given, one per Read —
// which is what a real socket does and what a strings.Reader does not.
type chunkReader struct {
	chunks [][]byte
	i      int
}

func (c *chunkReader) Read(p []byte) (int, error) {
	if c.i >= len(c.chunks) {
		return 0, io.EOF
	}
	n := copy(p, c.chunks[c.i])
	c.i++
	return n, nil
}

func collect(t *testing.T, r io.Reader, max int) []string {
	t.Helper()
	var got []string
	if err := ReadLines(r, max, func(line []byte) { got = append(got, string(line)) }); err != nil {
		t.Fatalf("ReadLines: %v", err)
	}
	return got
}

func TestWholeMessagesInOneRead(t *testing.T) {
	got := collect(t, strings.NewReader("a\nb\nc\n"), 1024)
	if strings.Join(got, ",") != "a,b,c" {
		t.Errorf("got %v", got)
	}
}

func TestONEMessageSplitACROSSReads(t *testing.T) {
	r := &chunkReader{chunks: [][]byte{[]byte("hel"), []byte("lo wor"), []byte("ld\n")}}
	got := collect(t, r, 1024)
	if len(got) != 1 || got[0] != "hello world" {
		t.Errorf("got %v, want [hello world]", got)
	}
}

func TestSEVERALMessagesInOneRead(t *testing.T) {
	r := &chunkReader{chunks: [][]byte{[]byte("a\nb\nc\nd\n")}}
	got := collect(t, r, 1024)
	if strings.Join(got, ",") != "a,b,c,d" {
		t.Errorf("got %v", got)
	}
}

func TestAMessageAndAHalf(t *testing.T) {
	r := &chunkReader{chunks: [][]byte{[]byte("one\ntw"), []byte("o\nthree\n")}}
	got := collect(t, r, 1024)
	if strings.Join(got, ",") != "one,two,three" {
		t.Errorf("got %v", got)
	}
}

func TestTrailingPartialIsDropped(t *testing.T) {
	got := collect(t, strings.NewReader("a\nb\nincomplete"), 1024)
	if strings.Join(got, ",") != "a,b" {
		t.Errorf("got %v — an unterminated tail is not a message", got)
	}
}

func TestEmptyMessagesAreStillMessages(t *testing.T) {
	got := collect(t, strings.NewReader("\n\na\n"), 1024)
	if len(got) != 3 || got[0] != "" || got[2] != "a" {
		t.Errorf("got %q", got)
	}
}

func TestTHEALIASINGTRAP(t *testing.T) {
	// the handler keeps the slices it is given; they must not change later
	var kept [][]byte
	r := &chunkReader{chunks: [][]byte{[]byte("first\n"), []byte("second-and-longer\n")}}
	if err := ReadLines(r, 1024, func(line []byte) { kept = append(kept, line) }); err != nil {
		t.Fatal(err)
	}
	if len(kept) != 2 {
		t.Fatalf("got %d messages", len(kept))
	}
	if !bytes.Equal(kept[0], []byte("first")) {
		t.Errorf("the first message became %q — you handed out a slice into the buffer", kept[0])
	}
}

func TestSizeCap(t *testing.T) {
	r := &chunkReader{chunks: [][]byte{bytes.Repeat([]byte("x"), 5000)}}
	err := ReadLines(r, 1024, func([]byte) {})
	if !errors.Is(err, ErrTooLong) {
		t.Errorf("err = %v, want ErrTooLong", err)
	}
}

func TestEOFIsCleanNotAnError(t *testing.T) {
	if err := ReadLines(strings.NewReader("a\n"), 1024, func([]byte) {}); err != nil {
		t.Errorf("EOF should not be an error, got %v", err)
	}
}
