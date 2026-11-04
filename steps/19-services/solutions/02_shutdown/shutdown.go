package shutdown

import (
	"context"
	"sync"
	"time"
)

type Batcher struct {
	mu      sync.Mutex
	batch   []string
	flushed [][]string
	size    int
	flushes int
}

func NewBatcher(size int) *Batcher { return &Batcher{size: size} }

func (b *Batcher) Add(item string) {
	b.mu.Lock()
	b.batch = append(b.batch, item)
	full := len(b.batch) >= b.size
	b.mu.Unlock()
	if full {
		b.Flush()
	}
}

func (b *Batcher) Flush() {
	b.mu.Lock()
	defer b.mu.Unlock()
	if len(b.batch) == 0 {
		return
	}
	out := make([]string, len(b.batch))
	copy(out, b.batch)
	b.flushed = append(b.flushed, out)
	b.batch = b.batch[:0]
	b.flushes++
}

func (b *Batcher) Flushed() [][]string {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.flushed
}

func (b *Batcher) Run(ctx context.Context, in <-chan string, every time.Duration) {
	tick := time.NewTicker(every)
	defer tick.Stop()
	for {
		select {
		case <-ctx.Done():
			b.Flush()
			return
		case item, ok := <-in:
			if !ok {
				b.Flush()
				return
			}
			b.Add(item)
		case <-tick.C:
			b.Flush()
		}
	}
}

func Shutdown(wg *sync.WaitGroup, grace time.Duration) bool {
	done := make(chan struct{})
	go func() { wg.Wait(); close(done) }()
	select {
	case <-done:
		return true
	case <-time.After(grace):
		return false
	}
}
