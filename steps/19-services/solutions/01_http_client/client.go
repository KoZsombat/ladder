package client

import (
	"context"
	"io"
	"net/http"
	"time"
)

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

	io.Copy(io.Discard, resp.Body)
	resp.Body.Close()
	return resp.StatusCode, took, nil
}
