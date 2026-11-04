package claim

import (
	"sync"
	"testing"
	"time"
)

func TestClaimIsExclusive(t *testing.T) {
	q := New(time.Minute)
	q.Add()
	if _, ok := q.Claim(); !ok {
		t.Fatal("first claim should succeed")
	}
	if _, ok := q.Claim(); ok {
		t.Error("the same job was claimed twice — the claim is not atomic")
	}
}

func TestConcurrentClaimsNeverOverlap(t *testing.T) {
	q := New(time.Minute)
	const n = 500
	for i := 0; i < n; i++ {
		q.Add()
	}

	var mu sync.Mutex
	seen := map[int]int{}
	var wg sync.WaitGroup
	for w := 0; w < 16; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				j, ok := q.Claim()
				if !ok {
					return
				}
				mu.Lock()
				seen[j.ID]++
				mu.Unlock()
				q.Complete(j.ID)
			}
		}()
	}
	wg.Wait()

	if len(seen) != n {
		t.Errorf("claimed %d distinct jobs, want %d", len(seen), n)
	}
	for id, times := range seen {
		if times != 1 {
			t.Errorf("job %d was claimed %d times", id, times)
		}
	}
}

func TestVisibilityTimeoutReissues(t *testing.T) {
	now := time.Now()
	q := New(100 * time.Millisecond)
	q.SetClock(func() time.Time { return now })
	id := q.Add()

	j, _ := q.Claim()
	if j.Attempts != 1 {
		t.Errorf("attempts = %d, want 1", j.Attempts)
	}
	if _, ok := q.Claim(); ok {
		t.Fatal("claimed again while still visible")
	}

	now = now.Add(time.Second) // the worker died; the claim lapses
	j2, ok := q.Claim()
	if !ok {
		t.Fatal("an expired claim must become claimable again")
	}
	if j2.ID != id || j2.Attempts != 2 {
		t.Errorf("got id=%d attempts=%d, want id=%d attempts=2", j2.ID, j2.Attempts, id)
	}
}

func TestCompletedJobsAreNotReissued(t *testing.T) {
	now := time.Now()
	q := New(time.Millisecond)
	q.SetClock(func() time.Time { return now })
	id := q.Add()
	q.Claim()
	q.Complete(id)

	now = now.Add(time.Hour)
	if _, ok := q.Claim(); ok {
		t.Error("a completed job came back")
	}
	if n := q.Stats()[Done]; n != 1 {
		t.Errorf("done = %d, want 1", n)
	}
}

func TestClaimReturnsACopy(t *testing.T) {
	q := New(time.Minute)
	q.Add()
	j, _ := q.Claim()
	j.Attempts = 999
	if got, _ := q.Claim(); got.Attempts == 999 {
		t.Error("mutating the returned Job changed the queue's state")
	}
}
