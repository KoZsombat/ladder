package contextx

import (
	"context"
	"errors"
	"runtime"
	"testing"
	"time"
)

func TestSlowDouble(t *testing.T) {
	if v, err := SlowDouble(context.Background(), 21, time.Millisecond); v != 42 || err != nil {
		t.Errorf("= (%d,%v), want (42,nil)", v, err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
	defer cancel()
	_, err := SlowDouble(ctx, 21, time.Second)
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Errorf("err = %v, want DeadlineExceeded", err)
	}
}

func TestSumWithTimeout(t *testing.T) {
	quick := func(context.Context) int { return 1 }
	slow := func(ctx context.Context) int { time.Sleep(40 * time.Millisecond); return 1 }

	total, err := SumWithTimeout(context.Background(), time.Second, []func(context.Context) int{quick, quick, quick})
	if total != 3 || err != nil {
		t.Errorf("= (%d,%v), want (3,nil)", total, err)
	}
	total, err = SumWithTimeout(context.Background(), 50*time.Millisecond,
		[]func(context.Context) int{slow, slow, slow, slow, slow})
	if err == nil {
		t.Error("want a context error when the budget runs out")
	}
	if total == 5 {
		t.Error("ran everything — you are not checking ctx between calls")
	}
}

func TestRace(t *testing.T) {
	before := runtime.NumGoroutine()
	fast := func(context.Context) int { return 1 }
	slow := func(ctx context.Context) int {
		select {
		case <-time.After(5 * time.Second):
			return 2
		case <-ctx.Done():
			return 0
		}
	}
	if got := Race(context.Background(), fast, slow); got != 1 {
		t.Errorf("Race = %d, want 1", got)
	}
	time.Sleep(100 * time.Millisecond)
	if after := runtime.NumGoroutine(); after > before+2 {
		t.Errorf("goroutines %d -> %d: the loser leaked (unbuffered result channel?)", before, after)
	}
}
