package durability

import "os"

// "Written" and "on disk" are different things.
//
// A successful Write means the bytes are in the operating system's PAGE
// CACHE. A power cut loses them. Sync() is what forces them to the device,
// and it is slow: single-digit milliseconds on a spinning disk, hundreds of
// microseconds on SSD.
//
// How often you call it is the durability/throughput trade-off every
// database exposes as a config flag, and this exercise makes you MEASURE it
// rather than take anyone's word.

type Policy int

const (
	SyncAlways Policy = iota // durable, slow
	SyncEveryN               // the usual compromise
	SyncNever                // fast, loses data on a power cut
)

// Writer appends to a file under a sync policy.
type Writer struct {
	f      *os.File
	policy Policy
	n      int
	writes int
	syncs  int
}

// TODO: implement this.
func NewWriter(f *os.File, policy Policy, n int) *Writer {
	panic("TODO: NewWriter")
}

// Append writes a record and syncs according to the policy.
//
// TODO: implement this.
//
//	Always Write. Then:
//	  SyncAlways -> Sync every time
//	  SyncEveryN -> Sync when the write count is a multiple of n
//	  SyncNever  -> never
//
//	Count the syncs so the test can check you actually did what you said.
//	A policy flag that does nothing is worse than no flag, because it makes
//	people believe something about their data that is not true.
func (w *Writer) Append(rec []byte) error {
	panic("TODO: Append")
}

// Syncs is how many times Sync was called.
func (w *Writer) Syncs() int { return w.syncs }

// Close flushes whatever is outstanding.
//
// TODO: implement this.
//
//	Sync once more before closing, whatever the policy — otherwise an
//	orderly shutdown under SyncNever loses everything since the last sync,
//	which is a surprise nobody wants from a clean exit.
func (w *Writer) Close() error {
	panic("TODO: Close")
}

// SyncDir fsyncs a DIRECTORY.
//
// TODO: implement this: open the directory and call Sync on it.
//
//	This is the step everyone omits. Creating or renaming a file changes
//	the DIRECTORY, and that change lives in the page cache too. Without
//	this, a crash can lose the rename even though the file's own contents
//	were synced — and your atomic swap was not atomic after all.
func SyncDir(dir string) error {
	panic("TODO: SyncDir")
}

// AtomicReplace writes content to a temp file and renames it over path.
//
// TODO: implement this. The sequence matters and every step earns its place:
//
//	1. create a temp file IN THE SAME DIRECTORY (rename is only atomic
//	   within one filesystem)
//	2. write the content
//	3. Sync the temp file          — contents durable BEFORE the swap
//	4. Close it
//	5. os.Rename over the target   — atomic within a filesystem
//	6. SyncDir                     — so the rename itself survives
//
//	Clean up the temp file if anything fails, or a crashed compaction
//	leaves litter that accumulates forever.
func AtomicReplace(path string, content []byte) error {
	panic("TODO: AtomicReplace")
}
