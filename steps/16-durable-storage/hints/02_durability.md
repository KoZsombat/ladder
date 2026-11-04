# 02_durability

## Hint 1
`Append` is a Write plus a switch. `AtomicReplace` is six steps in the order
given in the TODO; do them literally.

## Hint 2
```go
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

func (w *Writer) sync() error { w.syncs++; return w.f.Sync() }
```

## Hint 3
```go
func SyncDir(dir string) error {
	d, err := os.Open(dir)
	if err != nil {
		return err
	}
	defer d.Close()
	return d.Sync()
}
```

## Hint 4
```go
func AtomicReplace(path string, content []byte) error {
	dir := filepath.Dir(path)
	tmp, err := os.CreateTemp(dir, ".tmp-*")
	if err != nil {
		return err
	}
	name := tmp.Name()
	defer os.Remove(name)          // a no-op once the rename succeeded

	if _, err := tmp.Write(content); err != nil { tmp.Close(); return err }
	if err := tmp.Sync(); err != nil { tmp.Close(); return err }
	if err := tmp.Close(); err != nil { return err }
	if err := os.Rename(name, path); err != nil { return err }
	return SyncDir(dir)
}
```
The `defer os.Remove` is harmless after a successful rename — the temp name
no longer exists — and it is what keeps a failed call from leaving litter.

## Tier 5 — the measurement
Before moving on, benchmark all three policies with ten thousand small
appends and write the numbers in NOTES.md. The gap will be larger than you
expect, and that gap is the trade-off every database config flag is about.
