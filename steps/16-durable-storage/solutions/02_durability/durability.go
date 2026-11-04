package durability

import (
	"os"
	"path/filepath"
)

type Policy int

const (
	SyncAlways Policy = iota
	SyncEveryN
	SyncNever
)

type Writer struct {
	f      *os.File
	policy Policy
	n      int
	writes int
	syncs  int
}

func NewWriter(f *os.File, policy Policy, n int) *Writer {
	return &Writer{f: f, policy: policy, n: n}
}

func (w *Writer) sync() error {
	w.syncs++
	return w.f.Sync()
}

func (w *Writer) Append(rec []byte) error {
	if _, err := w.f.Write(rec); err != nil {
		return err
	}
	w.writes++
	switch w.policy {
	case SyncAlways:
		return w.sync()
	case SyncEveryN:
		if w.n > 0 && w.writes%w.n == 0 {
			return w.sync()
		}
	}
	return nil
}

func (w *Writer) Syncs() int { return w.syncs }

func (w *Writer) Close() error {
	if err := w.sync(); err != nil {
		w.f.Close()
		return err
	}
	return w.f.Close()
}

func SyncDir(dir string) error {
	d, err := os.Open(dir)
	if err != nil {
		return err
	}
	defer d.Close()
	return d.Sync()
}

func AtomicReplace(path string, content []byte) error {
	dir := filepath.Dir(path)
	tmp, err := os.CreateTemp(dir, ".tmp-*")
	if err != nil {
		return err
	}
	name := tmp.Name()
	defer os.Remove(name)

	if _, err := tmp.Write(content); err != nil {
		tmp.Close()
		return err
	}
	if err := tmp.Sync(); err != nil {
		tmp.Close()
		return err
	}
	if err := tmp.Close(); err != nil {
		return err
	}
	if err := os.Rename(name, path); err != nil {
		return err
	}
	return SyncDir(dir)
}
