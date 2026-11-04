package durability

import (
	"bytes"
	"os"
	"path/filepath"
	"testing"
)

func tmpFile(t *testing.T) (*os.File, string) {
	t.Helper()
	dir := t.TempDir()
	p := filepath.Join(dir, "data.log")
	f, err := os.OpenFile(p, os.O_RDWR|os.O_CREATE, 0o644)
	if err != nil {
		t.Fatal(err)
	}
	return f, p
}

func TestSyncAlways(t *testing.T) {
	f, _ := tmpFile(t)
	w := NewWriter(f, SyncAlways, 0)
	for i := 0; i < 10; i++ {
		if err := w.Append([]byte("x")); err != nil {
			t.Fatal(err)
		}
	}
	if w.Syncs() != 10 {
		t.Errorf("syncs = %d, want 10", w.Syncs())
	}
}

func TestSyncEveryN(t *testing.T) {
	f, _ := tmpFile(t)
	w := NewWriter(f, SyncEveryN, 5)
	for i := 0; i < 20; i++ {
		w.Append([]byte("x"))
	}
	if w.Syncs() != 4 {
		t.Errorf("syncs = %d, want 4 (every 5th of 20)", w.Syncs())
	}
}

func TestSyncNever(t *testing.T) {
	f, _ := tmpFile(t)
	w := NewWriter(f, SyncNever, 0)
	for i := 0; i < 20; i++ {
		w.Append([]byte("x"))
	}
	if w.Syncs() != 0 {
		t.Errorf("syncs = %d, want 0", w.Syncs())
	}
}

func TestDataIsActuallyWritten(t *testing.T) {
	f, path := tmpFile(t)
	w := NewWriter(f, SyncNever, 0)
	w.Append([]byte("hello "))
	w.Append([]byte("world"))
	if err := w.Close(); err != nil {
		t.Fatal(err)
	}
	got, _ := os.ReadFile(path)
	if string(got) != "hello world" {
		t.Errorf("file = %q", got)
	}
}

func TestCloseSyncsEvenUnderSyncNever(t *testing.T) {
	f, _ := tmpFile(t)
	w := NewWriter(f, SyncNever, 0)
	w.Append([]byte("x"))
	before := w.Syncs()
	w.Close()
	if w.Syncs() != before+1 {
		t.Error("Close must flush, or a clean shutdown loses data")
	}
}

func TestSyncDir(t *testing.T) {
	dir := t.TempDir()
	if err := SyncDir(dir); err != nil {
		t.Errorf("SyncDir: %v", err)
	}
	if err := SyncDir(filepath.Join(dir, "nope")); err == nil {
		t.Error("want an error for a missing directory")
	}
}

func TestAtomicReplace(t *testing.T) {
	dir := t.TempDir()
	p := filepath.Join(dir, "target")
	if err := os.WriteFile(p, []byte("old"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := AtomicReplace(p, []byte("new content")); err != nil {
		t.Fatal(err)
	}
	got, _ := os.ReadFile(p)
	if !bytes.Equal(got, []byte("new content")) {
		t.Errorf("= %q", got)
	}
}

func TestAtomicReplaceCreatesAndLeavesNoLitter(t *testing.T) {
	dir := t.TempDir()
	p := filepath.Join(dir, "fresh")
	if err := AtomicReplace(p, []byte("x")); err != nil {
		t.Fatal(err)
	}
	entries, _ := os.ReadDir(dir)
	if len(entries) != 1 {
		names := []string{}
		for _, e := range entries {
			names = append(names, e.Name())
		}
		t.Errorf("directory holds %v — the temp file was left behind", names)
	}
}
