package bridge

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestReadLoopHandlesSplitAndMergedReads(t *testing.T) {
	// a reader that deliberately returns messages split across reads and
	// several messages in one read — exactly what a real socket does
	r := &chunkReader{chunks: [][]byte{
		[]byte("one\ntw"),
		[]byte("o\nthree\nfour\n"),
		[]byte("fi"), []byte("ve\n"),
	}}
	var got []string
	err := ReadLoop(r, 1<<20, func(line []byte) {
		got = append(got, string(line)) // copies, so aliasing is fine here
	})
	if err != nil {
		t.Fatal(err)
	}
	want := []string{"one", "two", "three", "four", "five"}
	if strings.Join(got, ",") != strings.Join(want, ",") {
		t.Errorf("got %v, want %v", got, want)
	}
}

func TestReadLoopRejectsAnOversizedMessage(t *testing.T) {
	r := &chunkReader{chunks: [][]byte{bytes.Repeat([]byte("x"), 5000)}}
	err := ReadLoop(r, 1024, func([]byte) {})
	if err == nil {
		t.Error("want an error when no delimiter arrives within the cap")
	}
}

type chunkReader struct {
	chunks [][]byte
	i      int
}

func (c *chunkReader) Read(p []byte) (int, error) {
	if c.i >= len(c.chunks) {
		return 0, fmt.Errorf("EOF")
	}
	n := copy(p, c.chunks[c.i])
	c.i++
	return n, nil
}

func newBridge(t *testing.T) *Bridge {
	t.Helper()
	if _, err := exec.LookPath("python3"); err != nil {
		t.Skip("python3 not on PATH")
	}
	sock := filepath.Join(t.TempDir(), "b.sock")
	b, err := Spawn(context.Background(), sock)
	if err != nil {
		t.Fatalf("Spawn: %v", err)
	}
	t.Cleanup(func() { b.Close() })
	return b
}

func TestOneCall(t *testing.T) {
	b := newBridge(t)
	v, err := b.Call(context.Background(), "add", 1, 2)
	if err != nil {
		t.Fatal(err)
	}
	if fmt.Sprint(v) != "3" {
		t.Errorf("add(1,2) = %v, want 3", v)
	}
}

// THE REAL TEST. This is where bad framing shows up — usually around
// iteration 400, not iteration 2.
func Test10000RequestsInOrder(t *testing.T) {
	b := newBridge(t)
	ctx := context.Background()
	for i := 0; i < 10000; i++ {
		v, err := b.Call(ctx, "add", i, 1)
		if err != nil {
			t.Fatalf("request %d: %v", i, err)
		}
		if fmt.Sprint(v) != fmt.Sprint(float64(i+1)) && fmt.Sprint(v) != fmt.Sprint(i+1) {
			t.Fatalf("request %d = %v, want %d", i, v, i+1)
		}
	}
}

func TestErrorIsAValueAndTheConnectionSurvives(t *testing.T) {
	b := newBridge(t)
	ctx := context.Background()
	if _, err := b.Call(ctx, "boom"); err == nil {
		t.Error("want an error from boom()")
	}
	v, err := b.Call(ctx, "add", 2, 2)
	if err != nil {
		t.Fatalf("the next call must still work: %v", err)
	}
	if fmt.Sprint(v) != "4" {
		t.Errorf("= %v, want 4", v)
	}
}

func TestCallRespectsItsContext(t *testing.T) {
	b := newBridge(t)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
	defer cancel()
	// "sleepy" is not a function the child knows; this mainly checks we do
	// not hang forever when something goes wrong
	done := make(chan struct{})
	go func() { b.Call(ctx, "no_such_function"); close(done) }()
	select {
	case <-done:
	case <-time.After(3 * time.Second):
		t.Fatal("Call hung — set a deadline")
	}
}

func TestCloseLeavesNoChild(t *testing.T) {
	b := newBridge(t)
	b.Call(context.Background(), "add", 1, 1)
	if err := b.Close(); err != nil {
		t.Fatal(err)
	}
	if err := b.Close(); err != nil {
		t.Errorf("Close must be safe to call twice: %v", err)
	}
	time.Sleep(200 * time.Millisecond)
	out, _ := exec.Command("pgrep", "-f", "child/server.py").Output()
	if len(bytes.TrimSpace(out)) != 0 {
		t.Errorf("orphaned child process(es): %s", out)
	}
}
