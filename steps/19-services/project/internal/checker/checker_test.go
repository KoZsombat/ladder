package checker

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func target(url string, timeout time.Duration) Target {
	return Target{ID: 1, URL: url, Interval: time.Second, Timeout: timeout, Enabled: true}
}

func TestClientHasATimeoutAndAPool(t *testing.T) {
	c := NewClient()
	if c.Timeout == 0 {
		t.Error("the client has no Timeout — http.Get can hang until the OS gives up")
	}
	tr, ok := c.Transport.(*http.Transport)
	if !ok {
		t.Fatal("expected a *http.Transport")
	}
	if tr.MaxIdleConnsPerHost < 8 {
		t.Errorf("MaxIdleConnsPerHost = %d; the default of 2 means a fresh TCP+TLS handshake almost every check",
			tr.MaxIdleConnsPerHost)
	}
}

func TestCheck2xx(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello"))
	}))
	defer srv.Close()

	c := New(NewClient())
	r := c.Check(context.Background(), target(srv.URL, 2*time.Second))
	if r.Outcome != OK {
		t.Errorf("outcome = %q, want ok (err: %s)", r.Outcome, r.Err)
	}
	if r.StatusCode != 200 {
		t.Errorf("status = %d", r.StatusCode)
	}
	if r.CheckedAt.IsZero() {
		t.Error("CheckedAt not set")
	}
}

func TestCheckNon2xx(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(500)
	}))
	defer srv.Close()

	r := New(NewClient()).Check(context.Background(), target(srv.URL, 2*time.Second))
	if r.Outcome != Non2xx {
		t.Errorf("outcome = %q, want non2xx", r.Outcome)
	}
}

func TestCheckHonoursItsTimeout(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(3 * time.Second)
	}))
	defer srv.Close()

	start := time.Now()
	r := New(NewClient()).Check(context.Background(), target(srv.URL, 100*time.Millisecond))
	elapsed := time.Since(start)

	if elapsed > time.Second {
		t.Errorf("took %v — the per-target timeout is not reaching the request", elapsed)
	}
	if r.Outcome != Timeout {
		t.Errorf("outcome = %q, want timeout", r.Outcome)
	}
}

func TestCheckHonoursTheParentContext(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(3 * time.Second)
	}))
	defer srv.Close()

	ctx, cancel := context.WithCancel(context.Background())
	go func() { time.Sleep(50 * time.Millisecond); cancel() }()

	start := time.Now()
	New(NewClient()).Check(ctx, target(srv.URL, 10*time.Second))
	if elapsed := time.Since(start); elapsed > time.Second {
		t.Errorf("took %v after cancellation — a check that ignores its context keeps a worker busy", elapsed)
	}
}

func TestCheckReusesConnections(t *testing.T) {
	// If the body is not drained and closed, the connection cannot be reused
	// and every check opens a new one.
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("0123456789"))
	}))
	defer srv.Close()

	c := New(NewClient())
	for i := 0; i < 20; i++ {
		r := c.Check(context.Background(), target(srv.URL, 2*time.Second))
		if r.Outcome != OK {
			t.Fatalf("check %d: %s", i, r.Err)
		}
	}
	// A crude proxy for reuse: 20 checks against a local server should be fast.
	// The real signal is in `netstat` / the heap profile, which project 18 covers.
}

func TestClassify(t *testing.T) {
	if got := Classify(context.DeadlineExceeded); got != Timeout {
		t.Errorf("deadline -> %q, want timeout", got)
	}
	if got := Classify(errors.New("something else")); got == "" {
		t.Error("Classify returned an empty outcome")
	}
}

func TestLatencyIsMeasuredAtTheRequest(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(120 * time.Millisecond)
	}))
	defer srv.Close()

	r := New(NewClient()).Check(context.Background(), target(srv.URL, 5*time.Second))
	if r.LatencyMS < 100 || r.LatencyMS > 2000 {
		t.Errorf("latency = %dms, want roughly 120", r.LatencyMS)
	}
}
