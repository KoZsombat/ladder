package workerpool

import (
	"context"
	"errors"
	"sync/atomic"
	"testing"
	"time"
)

func jobs(n int) []Job {
	out := make([]Job, n)
	for i := range out {
		out[i] = Job{ID: i, Input: i}
	}
	return out
}

func TestRunAll(t *testing.T) {
	in := jobs(100)
	got := Run(context.Background(), 8, in, func(j Job) (int, error) {
		return j.Input * 2, nil
	})
	if len(got) != 100 {
		t.Fatalf("got %d results, want 100", len(got))
	}
	seen := map[int]bool{}
	for _, r := range got {
		if r.Value != r.JobID*2 {
			t.Errorf("job %d: value %d", r.JobID, r.Value)
		}
		if seen[r.JobID] {
			t.Errorf("job %d ran twice", r.JobID)
		}
		seen[r.JobID] = true
	}
}

func TestConcurrencyIsBounded(t *testing.T) {
	var inFlight, high int64
	Run(context.Background(), 4, jobs(200), func(j Job) (int, error) {
		cur := atomic.AddInt64(&inFlight, 1)
		for {
			h := atomic.LoadInt64(&high)
			if cur <= h || atomic.CompareAndSwapInt64(&high, h, cur) {
				break
			}
		}
		time.Sleep(time.Millisecond)
		atomic.AddInt64(&inFlight, -1)
		return 0, nil
	})
	if high > 4 {
		t.Errorf("peak concurrency %d, want at most 4", high)
	}
	if high < 2 {
		t.Errorf("peak concurrency %d — are the workers actually running in parallel?", high)
	}
}

func TestErrorsAreReported(t *testing.T) {
	boom := errors.New("boom")
	got := Run(context.Background(), 2, jobs(10), func(j Job) (int, error) {
		if j.ID == 5 {
			return 0, boom
		}
		return j.Input, nil
	})
	n := 0
	for _, r := range got {
		if r.Err != nil {
			n++
		}
	}
	if n != 1 {
		t.Errorf("%d errors, want 1", n)
	}
}

func TestPanicDoesNotKillThePool(t *testing.T) {
	got := Run(context.Background(), 2, jobs(10), func(j Job) (int, error) {
		if j.ID == 3 {
			panic("oops")
		}
		return j.Input, nil
	})
	if len(got) != 10 {
		t.Fatalf("got %d results, want 10 — recover per job", len(got))
	}
}

func TestCancelStopsEarly(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Millisecond)
	defer cancel()
	done := make(chan []Result)
	go func() {
		done <- Run(ctx, 2, jobs(1000), func(j Job) (int, error) {
			time.Sleep(5 * time.Millisecond)
			return j.Input, nil
		})
	}()
	select {
	case got := <-done:
		if len(got) >= 1000 {
			t.Error("ran everything despite cancellation")
		}
	case <-time.After(3 * time.Second):
		t.Fatal("Run did not return after cancellation — is the feeder blocked on a send?")
	}
}
