package store

import (
	"context"
	"testing"
	"time"

	"ladder/pinger/internal/checker"
)

func TestMemoryImplementsStore(t *testing.T) {
	var _ Store = NewMemory()
}

func TestCreateAndGet(t *testing.T) {
	s := NewMemory()
	ctx := context.Background()
	id, err := s.CreateTarget(ctx, checker.Target{URL: "https://example.com", Interval: time.Second, Timeout: time.Second, Enabled: true})
	if err != nil {
		t.Fatal(err)
	}
	got, ok, err := s.GetTarget(ctx, id)
	if err != nil || !ok {
		t.Fatalf("GetTarget = %v, %v, %v", got, ok, err)
	}
	if got.URL != "https://example.com" {
		t.Errorf("URL = %q", got.URL)
	}
	if _, ok, _ := s.GetTarget(ctx, 99999); ok {
		t.Error("a missing id must report ok=false")
	}
}

func TestDueTargetsDoesNotRepeatWithinAnInterval(t *testing.T) {
	s := NewMemory()
	ctx := context.Background()
	s.CreateTarget(ctx, checker.Target{URL: "http://a", Interval: 10 * time.Second, Timeout: time.Second, Enabled: true})

	now := time.Now()
	first, _ := s.DueTargets(ctx, now)
	if len(first) != 1 {
		t.Fatalf("first tick returned %d targets, want 1", len(first))
	}
	again, _ := s.DueTargets(ctx, now.Add(time.Second))
	if len(again) != 0 {
		t.Errorf("returned the same target again after 1s of a 10s interval — record the run time")
	}
	later, _ := s.DueTargets(ctx, now.Add(11*time.Second))
	if len(later) != 1 {
		t.Errorf("target not due again after its interval")
	}
}

func TestDisabledTargetsAreNotDue(t *testing.T) {
	s := NewMemory()
	ctx := context.Background()
	s.CreateTarget(ctx, checker.Target{URL: "http://a", Interval: time.Second, Timeout: time.Second, Enabled: false})
	due, _ := s.DueTargets(ctx, time.Now().Add(time.Hour))
	if len(due) != 0 {
		t.Errorf("a disabled target was scheduled")
	}
}

func TestSaveResultsTakesABatch(t *testing.T) {
	s := NewMemory()
	ctx := context.Background()
	id, _ := s.CreateTarget(ctx, checker.Target{URL: "http://a", Interval: time.Second, Timeout: time.Second, Enabled: true})

	batch := make([]checker.Result, 300)
	for i := range batch {
		batch[i] = checker.Result{TargetID: id, CheckedAt: time.Now(), Outcome: checker.OK}
	}
	if err := s.SaveResults(ctx, batch); err != nil {
		t.Fatal(err)
	}
	got, err := s.ListResults(ctx, id, 10)
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 10 {
		t.Errorf("limit ignored: got %d", len(got))
	}
}

func TestRetentionIsBounded(t *testing.T) {
	s := NewMemory()
	s.MaxPerID = 50
	ctx := context.Background()
	id, _ := s.CreateTarget(ctx, checker.Target{URL: "http://a", Interval: time.Second, Timeout: time.Second, Enabled: true})

	for i := 0; i < 500; i++ {
		s.SaveResults(ctx, []checker.Result{{TargetID: id, CheckedAt: time.Now()}})
	}
	got, _ := s.ListResults(ctx, id, 10000)
	if len(got) > 50 {
		t.Errorf("kept %d results with MaxPerID=50 — unbounded history turns 200MB into 20GB", len(got))
	}
}

func TestDeleteTarget(t *testing.T) {
	s := NewMemory()
	ctx := context.Background()
	id, _ := s.CreateTarget(ctx, checker.Target{URL: "http://a", Interval: time.Second, Timeout: time.Second, Enabled: true})
	ok, err := s.DeleteTarget(ctx, id)
	if err != nil || !ok {
		t.Fatalf("DeleteTarget = %v, %v", ok, err)
	}
	if ok, _ := s.DeleteTarget(ctx, id); ok {
		t.Error("deleting twice should report false")
	}
}
