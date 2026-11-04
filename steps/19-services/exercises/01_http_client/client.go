package client

import (
	"context"
	"net/http"
	"time"
)

// Three settings on an http.Client, and three real production incidents in
// miniature. The defaults are wrong for a service that makes many outbound
// requests, and each one fails in a way that points somewhere else.

// Build returns a client configured for a checker.
//
// TODO: implement this.
//
//  1. Timeout. http.Get has NO default timeout and can hang until the OS
//     gives up — minutes. Set one.
//
//  2. Transport.MaxIdleConnsPerHost. The default is TWO. Check the same
//     host often and you open a fresh TCP+TLS connection nearly every
//     time; the handshakes become most of your latency and the graph says
//     "the network is slow". Raise it.
//
//  3. Return ONE client to reuse. A client per request throws away the
//     connection pool, which is the only reason the pool exists.
//
//	Also set CheckRedirect to return http.ErrUseLastResponse: for a health
//	checker a redirect is information, not something to follow silently.
func Build(timeout time.Duration, perHost int) *http.Client {
	panic("TODO: Build")
}

// Fetch performs one request and returns the status and how long it took.
//
// TODO: implement this.
//
//	Derive a per-request context with the timeout; build the request with
//	http.NewRequestWithContext so cancellation actually reaches it.
//
//	Measure from just before Do, not from when the caller queued the work.
//
//	THEN THE LINE EVERYONE FORGETS:
//
//	    io.Copy(io.Discard, resp.Body)
//	    resp.Body.Close()
//
//	Without draining, the connection cannot be returned to the pool and you
//	leak both connections and memory. It shows up as steadily rising RSS and
//	a connection count that only goes up — and it is the single most common
//	Go bug in code like this.
func Fetch(ctx context.Context, c *http.Client, url string, timeout time.Duration) (status int, took time.Duration, err error) {
	panic("TODO: Fetch")
}
