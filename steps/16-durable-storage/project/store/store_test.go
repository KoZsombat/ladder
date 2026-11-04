package store

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func open(t *testing.T, dir string) *Store {
	t.Helper()
	s, err := Open(dir, SyncAlways, 1)
	if err != nil {
		t.Fatalf("Open: %v", err)
	}
	return s
}

func TestPutGetDelete(t *testing.T) {
	dir := t.TempDir()
	s := open(t, dir)
	defer s.Close()

	if err := s.Put([]byte("a"), []byte("apple")); err != nil {
		t.Fatal(err)
	}
	got, err := s.Get([]byte("a"))
	if err != nil || !bytes.Equal(got, []byte("apple")) {
		t.Fatalf("Get = %q, %v", got, err)
	}
	if got, _ := s.Get([]byte("missing")); got != nil {
		t.Errorf("missing key returned %q", got)
	}
	if err := s.Delete([]byte("a")); err != nil {
		t.Fatal(err)
	}
	if got, _ := s.Get([]byte("a")); got != nil {
		t.Errorf("deleted key returned %q", got)
	}
}

func TestOverwriteKeepsTheLatest(t *testing.T) {
	dir := t.TempDir()
	s := open(t, dir)
	for i := 0; i < 5; i++ {
		if err := s.Put([]byte("k"), []byte(fmt.Sprintf("v%d", i))); err != nil {
			t.Fatal(err)
		}
	}
	got, _ := s.Get([]byte("k"))
	if string(got) != "v4" {
		t.Fatalf("got %q, want v4", got)
	}
	s.Close()

	// and after a restart, replay must still pick the LAST one
	s2 := open(t, dir)
	defer s2.Close()
	got, _ = s2.Get([]byte("k"))
	if string(got) != "v4" {
		t.Fatalf("after replay got %q, want v4 — are you keeping the first occurrence?", got)
	}
}

func TestRestartReplays10kKeys(t *testing.T) {
	dir := t.TempDir()
	s := open(t, dir)
	for i := 0; i < 10_000; i++ {
		if err := s.Put([]byte(fmt.Sprintf("k%d", i)), []byte(fmt.Sprintf("v%d", i))); err != nil {
			t.Fatal(err)
		}
	}
	s.Close()

	s2 := open(t, dir)
	defer s2.Close()
	for i := 0; i < 10_000; i++ {
		got, err := s2.Get([]byte(fmt.Sprintf("k%d", i)))
		if err != nil || string(got) != fmt.Sprintf("v%d", i) {
			t.Fatalf("k%d = %q, %v", i, got, err)
		}
	}
}

func TestTruncatedLogStillOpens(t *testing.T) {
	dir := t.TempDir()
	s := open(t, dir)
	for i := 0; i < 100; i++ {
		s.Put([]byte(fmt.Sprintf("k%d", i)), []byte("value-that-is-reasonably-long"))
	}
	s.Close()

	// chop a random number of bytes off the end, simulating a torn write
	path := filepath.Join(dir, "data.log")
	fi, err := os.Stat(path)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Truncate(path, fi.Size()-13); err != nil {
		t.Fatal(err)
	}

	s2, err := Open(dir, SyncAlways, 1)
	if err != nil {
		t.Fatalf("a truncated log must still open, got: %v", err)
	}
	defer s2.Close()
	if got, _ := s2.Get([]byte("k0")); string(got) != "value-that-is-reasonably-long" {
		t.Errorf("earlier records should survive, got %q", got)
	}
}

func TestCompactionShrinksTheFile(t *testing.T) {
	dir := t.TempDir()
	s := open(t, dir)
	defer s.Close()

	for round := 0; round < 1000; round++ {
		for i := 0; i < 100; i++ {
			s.Put([]byte(fmt.Sprintf("k%d", i)), []byte(fmt.Sprintf("round%d", round)))
		}
	}
	before, _ := s.Size()
	if err := s.Compact(); err != nil {
		t.Fatal(err)
	}
	after, _ := s.Size()
	if after > before/10 {
		t.Errorf("compaction barely helped: %d -> %d", before, after)
	}
	for i := 0; i < 100; i++ {
		got, _ := s.Get([]byte(fmt.Sprintf("k%d", i)))
		if string(got) != "round999" {
			t.Fatalf("k%d = %q after compaction", i, got)
		}
	}
}

// TestCrashSurvival runs a child process that writes and then kills itself
// mid-stream. Run with: go test -run TestCrash -v ./...
func TestCrashSurvival(t *testing.T) {
	if os.Getenv("LADDER_CRASH_CHILD") == "1" {
		dir := os.Getenv("LADDER_CRASH_DIR")
		s, err := Open(dir, SyncAlways, 1)
		if err != nil {
			os.Exit(2)
		}
		for i := 0; ; i++ {
			s.Put([]byte(fmt.Sprintf("k%d", i)), bytes.Repeat([]byte("x"), 200))
			if i == 500 {
				// kill -9 ourselves, mid-stream
				p, _ := os.FindProcess(os.Getpid())
				_ = p.Kill()
				select {}
			}
		}
	}

	dir := t.TempDir()
	cmd := exec.Command(os.Args[0], "-test.run=TestCrashSurvival")
	cmd.Env = append(os.Environ(), "LADDER_CRASH_CHILD=1", "LADDER_CRASH_DIR="+dir)
	_ = cmd.Run() // it is supposed to die

	s, err := Open(dir, SyncAlways, 1)
	if err != nil {
		t.Fatalf("store must open after a kill -9: %v", err)
	}
	defer s.Close()

	n := len(s.Keys())
	if n < 100 {
		t.Fatalf("only %d keys survived; expected most of ~500", n)
	}
	for i := 0; i < n-1; i++ {
		got, err := s.Get([]byte(fmt.Sprintf("k%d", i)))
		if err != nil {
			t.Fatalf("k%d unreadable after crash: %v", i, err)
		}
		if len(got) != 200 {
			t.Fatalf("k%d is %d bytes, want 200 — a torn record leaked through", i, len(got))
		}
	}
}
