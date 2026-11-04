# Project — Hints

## Tier 1
`NewClient` and `Check` first; their tests do not need the pool. Get those
five tests green before touching concurrency.

## Tier 2
```go
func NewClient(timeout time.Duration) *http.Client {
	return &http.Client{
		Timeout: timeout,
		Transport: &http.Transport{
			MaxIdleConns:        256,
			MaxIdleConnsPerHost: 64,
			IdleConnTimeout:     90 * time.Second,
		},
	}
}
```

## Tier 3
```go
func Check(ctx context.Context, c *http.Client, url string, timeout time.Duration) Result {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return Result{URL: url, Outcome: Failed, Err: err.Error()}
	}

	start := time.Now()
	resp, err := c.Do(req)
	latency := time.Since(start)

	if err != nil {
		out := Failed
		if errors.Is(err, context.DeadlineExceeded) || os.IsTimeout(err) {
			out = Timeout
		}
		return Result{URL: url, Latency: latency, Outcome: out, Err: err.Error()}
	}
	io.Copy(io.Discard, resp.Body)
	resp.Body.Close()

	out := Non2xx
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		out = OK
	}
	return Result{URL: url, StatusCode: resp.StatusCode, Latency: latency, Outcome: out}
}
```

## Tier 4 — the pool
The skeleton in the TODO comment is the whole thing; work through it line by
line. The finish:
```go
	wg.Wait()
	close(results)
	out := make([]Result, 0, len(urls))
	for r := range results {
		out = append(out, r)
	}
	return out
```
Close `results` only after `wg.Wait()`. The other order panics with "send on
closed channel", intermittently, which is the worst kind of bug to chase.

## Tier 5 — the per-check recover
```go
func safely(ctx context.Context, c *http.Client, url string, timeout time.Duration) (r Result) {
	defer func() {
		if p := recover(); p != nil {
			r = Result{URL: url, Outcome: Failed, Err: fmt.Sprintf("panic: %v", p)}
		}
	}()
	return Check(ctx, c, url, timeout)
}
```
The NAMED return value is what lets the deferred function change what gets
returned. This is the one place where naming your returns is not just style.

## Tier 6 — stretch
Add a `-depth` flag that follows links found in the HTML and checks those
too. Now you need a visited set shared across workers — which means a mutex,
and a queue that grows while it is being drained. That is a genuinely harder
problem and a good one.
