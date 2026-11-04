package selectx

import (
	"testing"
	"time"
)

func TestFirstOf(t *testing.T) {
	a := make(chan int, 1)
	b := make(chan int, 1)
	b <- 42
	if got := FirstOf(a, b); got != 42 {
		t.Errorf("FirstOf = %d, want 42", got)
	}
}

func TestRecvTimeout(t *testing.T) {
	ch := make(chan int, 1)
	ch <- 7
	if v, ok := RecvTimeout(ch, time.Second); v != 7 || !ok {
		t.Errorf("ready = (%d,%v), want (7,true)", v, ok)
	}
	start := time.Now()
	if v, ok := RecvTimeout(make(chan int), 50*time.Millisecond); v != 0 || ok {
		t.Errorf("timeout = (%d,%v), want (0,false)", v, ok)
	}
	if elapsed := time.Since(start); elapsed > time.Second {
		t.Errorf("took %v — did you block instead of using time.After?", elapsed)
	}
}

func TestTrySend(t *testing.T) {
	ch := make(chan int, 1)
	if !TrySend(ch, 1) {
		t.Error("TrySend into empty buffer = false, want true")
	}
	if TrySend(ch, 2) {
		t.Error("TrySend into full buffer = true, want false")
	}
	done := make(chan bool)
	go func() { TrySend(make(chan int), 1); done <- true }()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("TrySend blocked — you need a default case")
	}
}

func TestDrain(t *testing.T) {
	ch := make(chan int, 3)
	ch <- 1
	ch <- 2
	got := Drain(ch)
	if len(got) != 2 || got[0] != 1 || got[1] != 2 {
		t.Errorf("Drain = %v, want [1 2]", got)
	}
	if got := Drain(make(chan int)); len(got) != 0 {
		t.Errorf("Drain(empty) = %v, want empty", got)
	}
}
