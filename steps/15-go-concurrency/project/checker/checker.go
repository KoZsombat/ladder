package checker

import (
	"context"
	"net/http"
	"time"
)

type Outcome string

const (
	OK      Outcome = "ok"
	Non2xx  Outcome = "non2xx"
	Timeout Outcome = "timeout"
	Failed  Outcome = "failed"
)

type Result struct {
	URL        string
	StatusCode int
	Latency    time.Duration
	Outcome    Outcome
	Err        string
}

// NewClient builds the ONE client every check shares.
//
// TODO: implement this. Three settings, three real incidents in miniature:
//
//  1. http.Get has NO default timeout and can hang until the OS gives up.
//     Set Timeout on the client.
//
//  2. Transport.MaxIdleConnsPerHost defaults to 2. Check one host often and
//     you open a fresh TCP+TLS connection nearly every time, which becomes
//     most of your latency and looks like "the network is slow".
//
//  3. Return one client and reuse it. A client per request throws away the
//     connection pool, which is the only reason the pool exists.
func NewClient(timeout time.Duration) *http.Client {
	panic("TODO: NewClient")
}

// Check performs one request.
//
// TODO: implement this.
//
//	Derive a per-request context with the timeout and build the request
//	with http.NewRequestWithContext — a check that ignores its context
//	keeps a worker busy for the full TCP timeout after you have asked the
//	program to stop.
//
//	Measure from just before Do, not from when the job was queued. Measure
//	from the queue and your latency numbers include your own backlog.
//
//	THEN THE LINE EVERYONE FORGETS:
//
//	    io.Copy(io.Discard, resp.Body)
//	    resp.Body.Close()
//
//	Without draining, the connection cannot be reused and you leak both
//	connections and memory. You will see it as steadily rising RSS.
func Check(ctx context.Context, c *http.Client, url string, timeout time.Duration) Result {
	panic("TODO: Check")
}
