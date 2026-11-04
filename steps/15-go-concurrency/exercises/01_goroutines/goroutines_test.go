package goroutines

import (
	"errors"
	"testing"
)

func TestSumParallel(t *testing.T) {
	xs := make([]int, 1000)
	want := 0
	for i := range xs {
		xs[i] = i
		want += i
	}
	for _, n := range []int{1, 3, 8, 64} {
		if got := SumParallel(xs, n); got != want {
			t.Errorf("SumParallel(n=%d) = %d, want %d", n, got, want)
		}
	}
	if got := SumParallel(nil, 4); got != 0 {
		t.Errorf("SumParallel(nil) = %d, want 0", got)
	}
}

func TestFirstError(t *testing.T) {
	boom := errors.New("boom")
	ok := func() error { return nil }
	bad := func() error { return boom }

	if err := FirstError([]func() error{ok, ok, ok}); err != nil {
		t.Errorf("all ok = %v, want nil", err)
	}
	if err := FirstError([]func() error{ok, bad, ok}); err != boom {
		t.Errorf("one bad = %v, want boom", err)
	}
	if err := FirstError(nil); err != nil {
		t.Errorf("nil = %v, want nil", err)
	}
}
