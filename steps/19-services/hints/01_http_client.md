# 01_http_client

## Hint 1
```go
func Build(timeout time.Duration, perHost int) *http.Client {
	return &http.Client{
		Timeout: timeout,
		Transport: &http.Transport{
			MaxIdleConns:        perHost * 8,
			MaxIdleConnsPerHost: perHost,
			IdleConnTimeout:     90 * time.Second,
		},
		CheckRedirect: func(*http.Request, []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
}
```

## Hint 2
```go
func Fetch(ctx context.Context, c *http.Client, url string, timeout time.Duration) (int, time.Duration, error) {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return 0, 0, err
	}
	start := time.Now()
	resp, err := c.Do(req)
	took := time.Since(start)
	if err != nil {
		return 0, took, err
	}
	// ...
}
```

## Hint 3
```go
	io.Copy(io.Discard, resp.Body)
	resp.Body.Close()
	return resp.StatusCode, took, nil
```
Try commenting those two lines out and running the last test. It counts new
connections on the server side, and without the drain it will be thirty
instead of one.

## Hint 4 — why both timeouts
`Client.Timeout` covers the whole request including reading the body. The
context deadline is what the caller can cancel, and what propagates into a
shutdown. You want both: the client timeout is a backstop, the context is
control.
