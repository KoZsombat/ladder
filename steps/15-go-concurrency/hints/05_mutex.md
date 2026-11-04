# 11_mutex

## Hint 1
Run the tests with `-race` from the start:
`go test -race ./exercises/05_mutex/`

## Hint 2
```go
type SafeCounter struct {
    mu sync.Mutex
    n  int
}
func (c *SafeCounter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.n++
}
```

## Hint 3
`Value` is the same with `return c.n` inside the lock.
`Add` uses `r.mu.Lock()`, `Has` uses `r.mu.RLock()` — and both still need
`defer` for the matching unlock.

Experiment worth doing: delete the locks from `Inc`, run with `-race`, read
the report. It names both conflicting accesses and both goroutines.

## Solution
See `solutions/11_mutex/mutex.go`.
