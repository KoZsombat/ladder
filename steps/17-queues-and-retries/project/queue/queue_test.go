package queue

import (
	"context"
	"errors"
	"runtime"
	"sync/atomic"
	"testing"
	"time"
)

func TestBackoffGrowsAndJitters(t *testing.T) {
	var prevMax time.Duration
	for n := 1; n <= 5; n++ {
		seen := map[time.Duration]bool{}
		var max time.Duration
		for i := 0; i < 50; i++ {
			d := Backoff(n)
			seen[d] = true
			if d > max {
				max = d
			}
		}
		if len(seen) < 5 {
			t.Errorf("Backoff(%d) produced %d distinct values — where is the jitter?", n, len(seen))
		}
		if n > 1 && max <= prevMax {
			t.Errorf("Backoff(%d) max %v did not grow past %v", n, max, prevMax)
		}
		prevMax = max
	}
	if d := Backoff(30); d > 10*time.Minute {
		t.Errorf("Backoff(30) = %v, should be capped", d)
	}
}

func TestClaimIsExclusive(t *testing.T) {
	q := New(time.Minute, 3)
	q.Enqueue("t", "one")

	_, ok1 := q.Claim()
	_, ok2 := q.Claim()
	if !ok1 {
		t.Fatal("first claim should succeed")
	}
	if ok2 {
		t.Error("second claim took the same job — the claim is not atomic")
	}
}

func TestExpiredClaimIsReissued(t *testing.T) {
	now := time.Now()
	q := New(100*time.Millisecond, 3)
	q.SetClock(func() time.Time { return now })
	q.Enqueue("t", "one")

	j, _ := q.Claim()
	if _, ok := q.Claim(); ok {
		t.Fatal("claimed twice while still visible")
	}

	now = now.Add(time.Second) // the worker died; the claim lapses
	j2, ok := q.Claim()
	if !ok {
		t.Fatal("an expired claim must be reissued")
	}
	if j2.ID != j.ID {
		t.Errorf("got job %d, want %d", j2.ID, j.ID)
	}
	if j2.Attempts != 2 {
		t.Errorf("attempts = %d, want 2", j2.Attempts)
	}
}

func TestEveryJobRunsExactlyOnce(t *testing.T) {
	q := New(time.Minute, 3)
	for i := 0; i < 1000; i++ {
		q.Enqueue("t", "x")
	}
	var ran int64
	p := NewPool(q, func(ctx context.Context, j Job) error {
		atomic.AddInt64(&ran, 1)
		return nil
	})
	ctx, cancel := context.WithCancel(context.Background())
	p.Start(ctx, 8)

	deadline := time.After(10 * time.Second)
	for {
		if q.Stats()[Done] == 1000 {
			break
		}
		select {
		case <-deadline:
			t.Fatalf("only %d done", q.Stats()[Done])
		default:
			time.Sleep(5 * time.Millisecond)
		}
	}
	cancel()
	p.Wait()
	if n := atomic.LoadInt64(&ran); n != 1000 {
		t.Errorf("handler ran %d times, want 1000", n)
	}
}

func TestConcurrencyIsBounded(t *testing.T) {
	q := New(time.Minute, 3)
	for i := 0; i < 200; i++ {
		q.Enqueue("t", "x")
	}
	var inFlight, high int64
	p := NewPool(q, func(ctx context.Context, j Job) error {
		cur := atomic.AddInt64(&inFlight, 1)
		for {
			h := atomic.LoadInt64(&high)
			if cur <= h || atomic.CompareAndSwapInt64(&high, h, cur) {
				break
			}
		}
		time.Sleep(2 * time.Millisecond)
		atomic.AddInt64(&inFlight, -1)
		return nil
	})
	ctx, cancel := context.WithCancel(context.Background())
	p.Start(ctx, 4)
	time.Sleep(500 * time.Millisecond)
	cancel()
	p.Wait()

	if high > 4 {
		t.Errorf("peak concurrency %d, want at most 4", high)
	}
	if high < 2 {
		t.Errorf("peak concurrency %d — are the workers running in parallel at all?", high)
	}
}

func TestFailureGoesToDeadLetter(t *testing.T) {
	now := time.Now()
	q := New(time.Minute, 3)
	q.SetClock(func() time.Time { return now })
	id := q.Enqueue("t", "x")
	boom := errors.New("boom")

	for i := 0; i < 3; i++ {
		if _, ok := q.Claim(); !ok {
			t.Fatalf("claim %d failed", i)
		}
		q.Fail(id, boom)
		now = now.Add(10 * time.Minute) // skip past the backoff
	}
	if n := q.Stats()[DeadLetter]; n != 1 {
		t.Errorf("dead letter count = %d, want 1 (stats: %v)", n, q.Stats())
	}
}

func TestPanicDoesNotKillThePool(t *testing.T) {
	q := New(time.Minute, 1)
	for i := 0; i < 10; i++ {
		q.Enqueue("t", "x")
	}
	var ok int64
	p := NewPool(q, func(ctx context.Context, j Job) error {
		if j.ID%3 == 0 {
			panic("oops")
		}
		atomic.AddInt64(&ok, 1)
		return nil
	})
	ctx, cancel := context.WithCancel(context.Background())
	p.Start(ctx, 2)
	time.Sleep(500 * time.Millisecond)
	cancel()
	p.Wait()

	if atomic.LoadInt64(&ok) < 6 {
		t.Errorf("only %d jobs survived; a panic took the pool down", ok)
	}
}

func TestNoGoroutineLeak(t *testing.T) {
	before := runtime.NumGoroutine()
	q := New(time.Minute, 3)
	for i := 0; i < 50; i++ {
		q.Enqueue("t", "x")
	}
	p := NewPool(q, func(ctx context.Context, j Job) error { return nil })
	ctx, cancel := context.WithCancel(context.Background())
	p.Start(ctx, 8)
	time.Sleep(300 * time.Millisecond)
	cancel()
	if !p.Shutdown(5 * time.Second) {
		t.Error("Shutdown reported that workers did not finish in time")
	}
	time.Sleep(100 * time.Millisecond)
	if after := runtime.NumGoroutine(); after > before+2 {
		t.Errorf("goroutines %d -> %d: workers leaked", before, after)
	}
}
