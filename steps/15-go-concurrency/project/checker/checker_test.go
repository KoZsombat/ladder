package checker

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"runtime"
	"sync/atomic"
	"testing"
	"time"
)

func TestClientIsConfigured(t *testing.T) {
	c := NewClient(3 * time.Second)
	if c.Timeout == 0 {
		t.Error("no Timeout — http.Get can hang until the OS gives up")
	}
	tr, ok := c.Transport.(*http.Transport)
	if !ok {
		t.Fatal("expected a *http.Transport")
	}
	if tr.MaxIdleConnsPerHost < 8 {
		t.Errorf("MaxIdleConnsPerHost = %d; the default 2 means a handshake almost every check",
			tr.MaxIdleConnsPerHost)
	}
}

func TestCheckOK(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hi"))
	}))
	defer srv.Close()

	r := Check(context.Background(), NewClient(time.Second), srv.URL, time.Second)
	if r.Outcome != OK || r.StatusCode != 200 {
		t.Errorf("= %+v, want ok/200", r)
	}
	if r.Latency <= 0 {
		t.Error("latency not measured")
	}
}

func TestCheckNon2xx(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(404)
	}))
	defer srv.Close()
	if r := Check(context.Background(), NewClient(time.Second), srv.URL, time.Second); r.Outcome != Non2xx {
		t.Errorf("outcome = %q, want non2xx", r.Outcome)
	}
}

func TestCheckTimesOut(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(3 * time.Second)
	}))
	defer srv.Close()

	start := time.Now()
	r := Check(context.Background(), NewClient(10*time.Second), srv.URL, 100*time.Millisecond)
	if elapsed := time.Since(start); elapsed > time.Second {
		t.Errorf("took %v — the per-request timeout is not reaching the request", elapsed)
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
	Check(ctx, NewClient(10*time.Second), srv.URL, 10*time.Second)
	if elapsed := time.Since(start); elapsed > time.Second {
		t.Errorf("took %v after cancellation", elapsed)
	}
}

func TestCheckAllReturnsOneResultPerURL(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	defer srv.Close()

	urls := make([]string, 200)
	for i := range urls {
		urls[i] = fmt.Sprintf("%s/%d", srv.URL, i)
	}
	rs := CheckAll(context.Background(), NewClient(2*time.Second), urls, 8, 2*time.Second)
	if len(rs) != 200 {
		t.Fatalf("got %d results, want 200", len(rs))
	}
	if n := Summary(rs)[OK]; n != 200 {
		t.Errorf("%d ok, want 200 (%v)", n, Summary(rs))
	}
}

func TestConcurrencyIsBounded(t *testing.T) {
	var inFlight, high int64
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cur := atomic.AddInt64(&inFlight, 1)
		for {
			h := atomic.LoadInt64(&high)
			if cur <= h || atomic.CompareAndSwapInt64(&high, h, cur) {
				break
			}
		}
		time.Sleep(10 * time.Millisecond)
		atomic.AddInt64(&inFlight, -1)
	}))
	defer srv.Close()

	urls := make([]string, 100)
	for i := range urls {
		urls[i] = srv.URL
	}
	CheckAll(context.Background(), NewClient(2*time.Second), urls, 4, 2*time.Second)

	if high > 4 {
		t.Errorf("peak concurrency %d, want at most 4", high)
	}
	if high < 2 {
		t.Errorf("peak concurrency %d — are the workers running in parallel?", high)
	}
}

func TestCancellationReturnsPromptly(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(50 * time.Millisecond)
	}))
	defer srv.Close()

	urls := make([]string, 5000)
	for i := range urls {
		urls[i] = srv.URL
	}
	ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()

	done := make(chan []Result)
	go func() { done <- CheckAll(ctx, NewClient(time.Second), urls, 4, time.Second) }()

	select {
	case rs := <-done:
		if len(rs) >= 5000 {
			t.Error("ran everything despite cancellation")
		}
	case <-time.After(5 * time.Second):
		t.Fatal("CheckAll did not return — is the feeder blocked on a send?")
	}
}

func TestNoGoroutineLeak(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	defer srv.Close()

	before := runtime.NumGoroutine()
	urls := make([]string, 300)
	for i := range urls {
		urls[i] = srv.URL
	}
	CheckAll(context.Background(), NewClient(time.Second), urls, 8, time.Second)
	time.Sleep(200 * time.Millisecond)

	if after := runtime.NumGoroutine(); after > before+5 {
		t.Errorf("goroutines %d -> %d: workers leaked", before, after)
	}
}

func TestPanicDoesNotKillThePool(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	defer srv.Close()

	urls := []string{srv.URL, "://not a url at all", srv.URL, srv.URL}
	rs := CheckAll(context.Background(), NewClient(time.Second), urls, 2, time.Second)
	if len(rs) != 4 {
		t.Errorf("got %d results, want 4 — a bad URL should produce a Result, not take the pool down", len(rs))
	}
}
