package shutdown

import (
	"context"
	"sync"
	"time"
)

// The shutdown ORDER is what separates a service from a script. Do it wrong
// and you lose the last batch of data, or you cut off requests that were
// nearly done, or you close the store under a worker still writing to it.
//
// The order:
//
//	1. stop accepting new work
//	2. let the in-flight work finish, within a deadline
//	3. flush whatever is buffered
//	4. close the store
//
// Step 3 has a trap of its own: the context you are shutting down with is
// already cancelled, so a flush that honours it refuses the very write you
// are trying to save. context.WithoutCancel is the fix.

// Batcher buffers items and flushes them in groups.
type Batcher struct {
	mu      sync.Mutex
	batch   []string
	flushed [][]string
	size    int
	flushes int
}

func NewBatcher(size int) *Batcher {
	return &Batcher{size: size}
}

// Add buffers one item, flushing when the batch is full.
//
// TODO: implement this.
func (b *Batcher) Add(item string) {
	panic("TODO: Add")
}

// Flush writes whatever is buffered. A no-op when empty.
//
// TODO: implement this.
//
//	Record the batch in `flushed` and clear the buffer. Use
//	b.batch = b.batch[:0] to reuse the array rather than reallocating —
//	and make sure you APPEND A COPY to `flushed`, or every recorded batch
//	ends up aliasing the same reused array. That is the step-02 slice trap,
//	in the place it actually bites people.
func (b *Batcher) Flush() {
	panic("TODO: Flush")
}

func (b *Batcher) Flushed() [][]string {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.flushed
}

// Run consumes from `in` until the context is cancelled or the channel
// closes, batching as it goes, and flushing on a ticker.
//
// TODO: implement this.
//
//	select over three cases:
//	  <-ctx.Done()  -> FLUSH, then return. Not "return" — flush first, or
//	                   every shutdown silently loses up to a full batch,
//	                   which looks like random missing data in production.
//	  item, ok := <-in -> if !ok, flush and return; otherwise Add
//	  <-tick.C      -> Flush
//
//	Remember defer tick.Stop().
func (b *Batcher) Run(ctx context.Context, in <-chan string, every time.Duration) {
	panic("TODO: Run")
}

// Shutdown waits for a WaitGroup, but no longer than `grace`.
// Reports whether everything finished in time.
//
// TODO: implement this.
//
//	wg.Wait() blocks forever, which is not acceptable in a shutdown path —
//	one stuck worker would hang the process and the orchestrator would kill
//	it, losing exactly the data you were trying to flush.
//
//	Wait in a goroutine that closes a channel, then select on that channel
//	against time.After.
func Shutdown(wg *sync.WaitGroup, grace time.Duration) bool {
	panic("TODO: Shutdown")
}
