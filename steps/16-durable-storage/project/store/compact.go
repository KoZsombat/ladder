package store

// Compact rewrites the log keeping only live records.
//
// TODO: implement this.
//
//  1. Create a temp file in the SAME directory (os.CreateTemp(s.dir, ...)).
//     Same directory matters: rename is only atomic within one filesystem.
//
//  2. Write every live record to it, building a new index as you go.
//
//  3. tmp.Sync()      — the contents must be durable BEFORE the swap
//
//  4. os.Rename(tmp, s.path)  — atomic within a filesystem; this is the
//     single most useful fact in this project
//
//  5. fsync the DIRECTORY too, or the rename itself can be lost in a crash.
//     Open the dir with os.Open and call Sync() on it.
//
//  6. Swap in the new file handle, index and offset.
//
//     Compacting in place instead of into a new file is the classic mistake:
//     a crash halfway through leaves a file that is neither the old one nor
//     the new one.
func (s *Store) Compact() error {
	panic("TODO: Compact")
}

// Size returns the current log size in bytes, for the compaction test.
func (s *Store) Size() (int64, error) {
	fi, err := s.f.Stat()
	if err != nil {
		return 0, err
	}
	return fi.Size(), nil
}
