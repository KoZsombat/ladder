package scheduler

import (
	"context"
	"net/http"
	"net/http/httptest"
	"runtime"
	"sync/atomic"
	"testing"
	"time"

	"ladder/pinger/internal/checker"
	"ladder/pinger/internal/store"
)

func TestWorkerPoolIsBounded(t *testing.T) {
	var inFlight, high int64
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cur := atomic.AddInt64(&inFlight, 1)
		for {
			h := atomic.LoadInt64(&high)
			if cur <= h || atomic.CompareAndSwapInt64(&high, h, cur) {
				break
			}
		}
		time.Sleep(20 * time.Millisecond)
		atomic.AddInt64(&inFlight, -1)
	}))
	defer srv.Close()

	st := store.NewMemory()
	ctx := context.Background()
	for i := 0; i < 100; i++ {
		st.CreateTarget(ctx, checker.Target{URL: srv.URL, Interval: time.Second, Timeout: 2 * time.Second, Enabled: true})
	}

	s := New(st, checker.New(checker.NewClient()), 256)
	runCtx, cancel := context.WithCancel(ctx)
	s.StartWorkers(runCtx, 4)
	go s.Run(runCtx)
	go s.RunWriter(runCtx)

	time.Sleep(600 * time.Millisecond)
	cancel()
	s.Wait()

	if high > 4 {
		t.Errorf("peak concurrency %d, want at most 4 — one goroutine per target per tick?", high)
	}
	if high < 2 {
		t.Errorf("peak concurrency %d — the workers are not running in parallel", high)
	}
}

func TestFullQueueSkipsAndCounts(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(2 * time.Second) // everything jams
	}))
	defer srv.Close()

	st := store.NewMemory()
	ctx := context.Background()
	for i := 0; i < 200; i++ {
		st.CreateTarget(ctx, checker.Target{URL: srv.URL, Interval: time.Second, Timeout: 5 * time.Second, Enabled: true})
	}

	s := New(st, checker.New(checker.NewClient()), 4) // a tiny queue on purpose
	runCtx, cancel := context.WithCancel(ctx)
	s.StartWorkers(runCtx, 1)
	go s.Run(runCtx)

	time.Sleep(2500 * time.Millisecond)
	cancel()
	s.Wait()

	if s.Skipped() == 0 {
		t.Error("nothing was skipped with a jammed 4-slot queue — a backpressure mechanism you have never seen fire is one you have not tested")
	}
}

func TestNoGoroutineLeak(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	defer srv.Close()

	before := runtime.NumGoroutine()

	st := store.NewMemory()
	ctx := context.Background()
	for i := 0; i < 50; i++ {
		st.CreateTarget(ctx, checker.Target{URL: srv.URL, Interval: 100 * time.Millisecond, Timeout: time.Second, Enabled: true})
	}
	s := New(st, checker.New(checker.NewClient()), 128)
	runCtx, cancel := context.WithCancel(ctx)
	s.StartWorkers(runCtx, 8)
	go s.Run(runCtx)
	go s.RunWriter(runCtx)

	time.Sleep(500 * time.Millisecond)
	cancel()
	s.Wait()
	time.Sleep(300 * time.Millisecond)

	if after := runtime.NumGoroutine(); after > before+5 {
		t.Errorf("goroutines %d -> %d: workers leaked", before, after)
	}
}

func TestResultsReachTheStore(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	defer srv.Close()

	st := store.NewMemory()
	ctx := context.Background()
	id, _ := st.CreateTarget(ctx, checker.Target{URL: srv.URL, Interval: 50 * time.Millisecond, Timeout: time.Second, Enabled: true})

	s := New(st, checker.New(checker.NewClient()), 64)
	runCtx, cancel := context.WithCancel(ctx)
	s.StartWorkers(runCtx, 2)
	go s.Run(runCtx)
	go s.RunWriter(runCtx)

	time.Sleep(1500 * time.Millisecond)
	cancel()
	s.Wait()
	time.Sleep(200 * time.Millisecond)

	got, _ := st.ListResults(context.Background(), id, 100)
	if len(got) == 0 {
		t.Error("no results were persisted — is the writer flushing?")
	}
}
