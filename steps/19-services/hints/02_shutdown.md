# 02_shutdown

## Hint 1
```go
func (b *Batcher) Add(item string) {
	b.mu.Lock()
	b.batch = append(b.batch, item)
	full := len(b.batch) >= b.size
	b.mu.Unlock()
	if full {
		b.Flush()
	}
}
```
Release the lock before calling Flush, or take the lock once and inline the
flush — just do not try to Lock twice from the same goroutine.

## Hint 2
```go
func (b *Batcher) Flush() {
	b.mu.Lock()
	defer b.mu.Unlock()
	if len(b.batch) == 0 {
		return
	}
	out := make([]string, len(b.batch))
	copy(out, b.batch)                  // the COPY — see the aliasing test
	b.flushed = append(b.flushed, out)
	b.batch = b.batch[:0]
	b.flushes++
}
```

## Hint 3
```go
func (b *Batcher) Run(ctx context.Context, in <-chan string, every time.Duration) {
	tick := time.NewTicker(every)
	defer tick.Stop()
	for {
		select {
		case <-ctx.Done():
			b.Flush()                   // FIRST, then return
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
```

## Hint 4
```go
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
```

## Hint 5 — the real-store version
When the flush writes to a database, pass `context.WithoutCancel(ctx)` to
it on the shutdown path. The context you are shutting down with is already
cancelled, and a store that honours it would refuse the very write you are
trying to save.
