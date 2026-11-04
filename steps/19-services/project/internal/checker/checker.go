package checker

import (
	"context"
	"net/http"
	"time"
)

type Outcome string

const (
	OK        Outcome = "ok"
	Non2xx    Outcome = "non2xx"
	Timeout   Outcome = "timeout"
	DNSFail   Outcome = "dns"
	Refused   Outcome = "refused"
	TLSError  Outcome = "tls"
	OtherFail Outcome = "other"
)

type Target struct {
	ID       int64
	URL      string
	Interval time.Duration
	Timeout  time.Duration
	Enabled  bool
}

type Result struct {
	TargetID   int64
	CheckedAt  time.Time
	StatusCode int
	LatencyMS  int64
	Outcome    Outcome
	Err        string
}

type Checker struct {
	http *http.Client
}

// NewClient builds the one client every check shares.
//
// TODO: implement this. Three settings, three real production incidents in
// miniature:
//
//  1. Timeout. http.Get has NO default timeout and can hang until the OS
//     gives up. Set Timeout on the client AND a context deadline per check;
//     they cover different phases.
//
//  2. Transport.MaxIdleConnsPerHost defaults to 2. Check the same host often
//     and you open a fresh TCP+TLS connection nearly every time, which will
//     dominate your latency and show up in your metrics as "the network is
//     slow". Raise it to something like 64.
//
//  3. Reuse ONE client for every check. Creating one per request throws away
//     the connection pool, which is the only reason the pool exists.
//
// Also worth setting: CheckRedirect to return http.ErrUseLastResponse, so a
// redirect is information rather than something you silently follow.
func NewClient() *http.Client {
	panic("TODO: NewClient")
}

func New(c *http.Client) *Checker { return &Checker{http: c} }

// Check performs one health check.
//
// TODO: implement this.
//
//	ctx, cancel := context.WithTimeout(ctx, t.Timeout); defer cancel()
//	build the request WITH that context — http.NewRequestWithContext.
//	A check that ignores its context keeps a worker busy for the full TCP
//	timeout after you have asked the process to shut down.
//
//	Take the start time HERE, in the worker, not in the scheduler. Measure
//	from the scheduler and your p99 is measuring your own backlog, and you
//	will spend an evening chasing a phantom.
//
//	THEN THE LINE EVERYONE FORGETS:
//
//	    io.Copy(io.Discard, resp.Body)
//	    resp.Body.Close()
//
//	Without draining the body the connection cannot be reused, so you leak
//	both connections and memory. It is the single most common Go bug in code
//	like this, and you will see it as steadily rising RSS.
//
//	Finally classify the error: timeout, DNS failure, connection refused,
//	TLS error, or other. The classification is what makes the metrics in
//	project 18 worth looking at.
func (c *Checker) Check(ctx context.Context, t Target) Result {
	panic("TODO: Check")
}

// Classify turns a transport error into an Outcome.
//
// TODO: implement this. Look at errors.Is(err, context.DeadlineExceeded),
// and type-assert to *net.OpError / *net.DNSError / tls.RecordHeaderError
// with errors.As.
func Classify(err error) Outcome {
	panic("TODO: Classify")
}
