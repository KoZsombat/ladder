package mutex

import "sync"

// "Do not communicate by sharing memory; share memory by communicating" is
// the Go slogan, but shared state with a lock is still the right tool often
// enough that you need to be fluent in it.
//
// Run these tests with -race. The detector finds data races at RUNTIME, by
// instrumenting memory access, so it only catches races that actually happen
// during the run — but it is still the single highest-value tool in the Go
// toolchain, and your CI should always use it.

// SafeCounter is a counter several goroutines can increment.
type SafeCounter struct {
	// TODO: add the fields you need.
	//
	//	A sync.Mutex and an int. Embed the mutex as a plain field named mu,
	//	placed directly above the data it guards — that adjacency is the
	//	convention that tells a reader what the lock covers.
	//
	//	Do NOT embed it anonymously (`sync.Mutex` with no name): that would
	//	promote Lock and Unlock into SafeCounter's public API and let callers
	//	outside the type take your lock.
}

// Inc increments the counter.
//
// TODO: implement this.
//
//	    c.mu.Lock()
//	    defer c.mu.Unlock()
//	    c.n++
//
//	`defer` for the unlock means an early return or a panic still releases
//	the lock. Once you have more than one return path, defer is not a style
//	preference, it is the only correct form.
func (c *SafeCounter) Inc() {
}

// Value returns the current count.
//
// TODO: implement this. It must lock too — an unsynchronised READ next to a
// synchronised write is still a data race, and the detector will say so.
func (c *SafeCounter) Value() int {
	return 0
}

// Registry is a concurrent string set.
type Registry struct {
	mu sync.RWMutex
	m  map[string]bool
}

func NewRegistry() *Registry { return &Registry{m: make(map[string]bool)} }

// Add inserts a name.
//
// TODO: implement this with the WRITE lock: mu.Lock / mu.Unlock.
func (r *Registry) Add(name string) {
}

// Has reports whether a name is present.
//
// TODO: implement this with the READ lock: mu.RLock / mu.RUnlock.
//
//	An RWMutex lets any number of readers in at once, but a writer excludes
//	everyone. It is worth it when reads heavily outnumber writes; under a
//	balanced load a plain Mutex is usually faster because RWMutex has more
//	bookkeeping. Measure before choosing — that is the exercise's real point.
func (r *Registry) Has(name string) bool {
	return false
}
