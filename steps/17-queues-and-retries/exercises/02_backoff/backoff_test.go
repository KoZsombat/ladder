package backoff

import (
	"testing"
	"time"
)

func TestDelayGrows(t *testing.T) {
	unit, max := time.Second, 10*time.Minute
	var prevMax time.Duration
	for n := 1; n <= 6; n++ {
		var hi time.Duration
		for i := 0; i < 200; i++ {
			if d := Delay(n, unit, max); d > hi {
				hi = d
			}
		}
		if n > 1 && hi <= prevMax {
			t.Errorf("attempt %d max %v did not grow past %v", n, hi, prevMax)
		}
		prevMax = hi
	}
}

func TestDelayIsJittered(t *testing.T) {
	seen := map[time.Duration]bool{}
	for i := 0; i < 200; i++ {
		seen[Delay(5, time.Second, time.Hour)] = true
	}
	if len(seen) < 20 {
		t.Errorf("only %d distinct delays out of 200 — where is the jitter?", len(seen))
	}
}

func TestDelayIsCapped(t *testing.T) {
	max := 30 * time.Second
	for _, n := range []int{20, 40, 64, 1000} {
		d := Delay(n, time.Second, max)
		if d > max {
			t.Errorf("attempt %d gave %v, above the cap %v", n, d, max)
		}
		if d <= 0 {
			t.Errorf("attempt %d gave %v — the shift overflowed", n, d)
		}
	}
}

func TestDelayStaysInTheHalfOpenBand(t *testing.T) {
	for i := 0; i < 500; i++ {
		d := Delay(3, time.Second, time.Hour) // base = 4s, band = [2s, 4s)
		if d < 2*time.Second || d >= 4*time.Second {
			t.Fatalf("delay %v outside [2s, 4s)", d)
		}
	}
}

func TestShouldRetry(t *testing.T) {
	if !ShouldRetry(1, 3, true) {
		t.Error("first attempt of three should retry")
	}
	if ShouldRetry(3, 3, true) {
		t.Error("the last attempt must not retry")
	}
	if ShouldRetry(1, 5, false) {
		t.Error("a permanent error must never be retried")
	}
}

func TestSchedule(t *testing.T) {
	s := Schedule(5, time.Second, time.Hour)
	if len(s) != 5 {
		t.Fatalf("got %d delays, want 5", len(s))
	}
	total := time.Duration(0)
	for _, d := range s {
		total += d
	}
	if total < 7*time.Second {
		t.Errorf("five attempts total only %v — the growth looks wrong", total)
	}
}
