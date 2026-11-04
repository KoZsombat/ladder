# 15 — Hints

## Tier 1 — order of work
`Backoff` first (it has its own test), then `Enqueue`/`Claim`/`Complete`/
`Fail` with no pool at all. Only then the pool.

Run everything with `-race` from the first line of code.

## Tier 2 — the queue
```go
func Backoff(attempt int) time.Duration {
    base := time.Second * time.Duration(1<<attempt)
    if base > 5*time.Minute { base = 5 * time.Minute }
    return base/2 + time.Duration(rand.Int63n(int64(base/2)+1))
}

func (q *Queue) Claim() (Job, bool) {
    q.mu.Lock()
    defer q.mu.Unlock()              // one lock around the whole read-and-write
    now := q.now()

    var best *Job
    for _, j := range q.jobs {
        claimable := (j.State == Pending && !j.RunAfter.After(now)) ||
            (j.State == Running && j.ClaimedUntil.Before(now))
        if !claimable { continue }
        if best == nil || j.RunAfter.Before(best.RunAfter) { best = j }
    }
    if best == nil { return Job{}, false }

    best.State = Running
    best.Attempts++
    best.ClaimedUntil = now.Add(q.visibility)
    return *best, true               // return a COPY, not the pointer
}
```
Returning a copy matters: hand out the pointer and callers mutate your state
outside the lock, which `-race` will find immediately.

## Tier 3 — the pool
```go
func (p *Pool) Start(ctx context.Context, n int) {
    for i := 0; i < n; i++ {
        p.wg.Add(1)                  // BEFORE the go statement
        go func() {
            defer p.wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                default:
                }
                j, ok := p.q.Claim()
                if !ok {
                    select {
                    case <-ctx.Done():
                        return
                    case <-time.After(2 * time.Millisecond):
                    }
                    continue
                }
                p.runOne(ctx, j)
            }
        }()
    }
}

func (p *Pool) runOne(ctx context.Context, j Job) {
    defer func() {
        if r := recover(); r != nil {
            p.q.Fail(j.ID, fmt.Errorf("panic: %v", r))
        }
    }()
    if err := p.handler(ctx, j); err != nil {
        p.q.Fail(j.ID, err)
        return
    }
    p.q.Complete(j.ID)
}

func (p *Pool) Shutdown(grace time.Duration) bool {
    done := make(chan struct{})
    go func() { p.wg.Wait(); close(done) }()
    select {
    case <-done:
        return true
    case <-time.After(grace):
        return false
    }
}
```

## Tier 4 — make it persistent
Swap the in-memory `map[int]*Job` for your project-13 store or for SQLite.
The claim then genuinely has to be one SQL statement, and the lesson about
atomicity stops being a convention you are keeping voluntarily.
