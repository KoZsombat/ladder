# 17 — Hints

## Tier 1 — order of work
1. `NewClient` + `Check` + `Classify` alone. Unit-test them against
   `httptest.NewServer` with handlers that sleep, return 500, and close the
   connection mid-body. This is a satisfying hour on its own.
2. `Memory` store.
3. Worker pool fed by hand from a slice.
4. Scheduler with the ticker and the skip-and-count branch.
5. Batched writer.
6. API handlers.
7. Shutdown order, and the goroutine-count assertion.

## Tier 2 — the client and the check
```go
func NewClient() *http.Client {
    return &http.Client{
        Timeout: 15 * time.Second,
        Transport: &http.Transport{
            MaxIdleConns:        512,
            MaxIdleConnsPerHost: 64,      // the default is 2
            IdleConnTimeout:     90 * time.Second,
            DisableCompression:  true,
        },
        CheckRedirect: func(*http.Request, []*http.Request) error {
            return http.ErrUseLastResponse
        },
    }
}

func (c *Checker) Check(ctx context.Context, t Target) Result {
    ctx, cancel := context.WithTimeout(ctx, t.Timeout)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, http.MethodGet, t.URL, nil)
    if err != nil {
        return Result{TargetID: t.ID, Outcome: OtherFail, Err: err.Error()}
    }

    start := time.Now()
    resp, err := c.http.Do(req)
    latency := time.Since(start)

    if err != nil {
        return Result{TargetID: t.ID, CheckedAt: start,
            LatencyMS: latency.Milliseconds(), Outcome: Classify(err), Err: err.Error()}
    }
    io.Copy(io.Discard, resp.Body)   // THE line
    resp.Body.Close()

    out := Non2xx
    if resp.StatusCode >= 200 && resp.StatusCode < 300 { out = OK }
    return Result{TargetID: t.ID, CheckedAt: start, StatusCode: resp.StatusCode,
        LatencyMS: latency.Milliseconds(), Outcome: out}
}
```

## Tier 3 — the scheduler and the writer
```go
func (s *Scheduler) Run(ctx context.Context) {
    tick := time.NewTicker(time.Second)
    defer tick.Stop()
    for {
        select {
        case <-ctx.Done():
            return
        case now := <-tick.C:
            due, err := s.store.DueTargets(ctx, now)
            if err != nil { continue }
            for _, t := range due {
                select {
                case s.jobs <- t:
                default:
                    s.mu.Lock(); s.skipped++; s.mu.Unlock()
                }
            }
        }
    }
}

func (s *Scheduler) RunWriter(ctx context.Context) {
    batch := make([]checker.Result, 0, 200)
    flush := time.NewTicker(time.Second)
    defer flush.Stop()

    write := func() {
        if len(batch) == 0 { return }
        _ = s.store.SaveResults(context.WithoutCancel(ctx), batch)
        batch = batch[:0]
    }
    for {
        select {
        case <-ctx.Done():
            write()            // the LAST batch
            return
        case r := <-s.results:
            batch = append(batch, r)
            if len(batch) >= 200 { write() }
        case <-flush.C:
            write()
        }
    }
}
```
`context.WithoutCancel` on the final flush matters: the context you are
shutting down with is already cancelled, and a store that honours it would
refuse the very write you are trying to save.

## Tier 4 — moving to SQLite
When you swap the memory store, these four settings are the difference
between working and "database is locked" under load:

```go
dsn := path + "?_journal_mode=WAL&_busy_timeout=5000&_synchronous=NORMAL"

w, _ := sql.Open("sqlite", dsn)   // the WRITER
w.SetMaxOpenConns(1)              // SQLite has exactly ONE writer

r, _ := sql.Open("sqlite", dsn)   // a separate READER pool
r.SetMaxOpenConns(runtime.NumCPU())
```
Two handles, one writer connection. With Go's pool and several writer
connections you will produce lock errors no matter how good your SQL is.

Pure-Go driver (`modernc.org/sqlite`) keeps `CGO_ENABLED=0` and a static
binary available for project 18's container; `mattn/go-sqlite3` is faster
but needs cgo. Choose deliberately and write the reason in the README.

## Tier 5 — the acceptance run
500 targets, 10s interval, one hour:
- results within 1% of expected
- the gap between consecutive checks of one target never exceeds 2x interval
- zero "database is locked"
- `runtime.NumGoroutine()` printed every minute is FLAT (a rising line is a
  leak and you will see it immediately)
- SIGTERM exits within 10s with the last batch persisted
