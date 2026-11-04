package correlate

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"
)

func TestRegisterGivesDistinctIDs(t *testing.T) {
	p := NewPending()
	seen := map[int]bool{}
	for i := 0; i < 100; i++ {
		id, _, err := p.Register()
		if err != nil {
			t.Fatal(err)
		}
		if seen[id] {
			t.Fatalf("id %d handed out twice", id)
		}
		seen[id] = true
	}
}

func TestRoundTrip(t *testing.T) {
	p := NewPending()
	id, ch, _ := p.Register()
	go p.Deliver(Response{ID: id, OK: true, Value: "hello"})

	res, err := p.Wait(context.Background(), id, ch)
	if err != nil || res.Value != "hello" {
		t.Errorf("= %+v, %v", res, err)
	}
	if p.Len() != 0 {
		t.Error("the entry was not removed")
	}
}

func TestConcurrentCallsDoNotCrossWires(t *testing.T) {
	p := NewPending()
	const n = 200
	var wg sync.WaitGroup
	errs := make(chan error, n)

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			id, ch, err := p.Register()
			if err != nil {
				errs <- err
				return
			}
			go p.Deliver(Response{ID: id, OK: true, Value: string(rune('A' + id%26))})
			res, err := p.Wait(context.Background(), id, ch)
			if err != nil {
				errs <- err
				return
			}
			if res.ID != id {
				errs <- errors.New("reply delivered to the wrong caller")
			}
		}(i)
	}
	wg.Wait()
	close(errs)
	for err := range errs {
		t.Error(err)
	}
	if p.Len() != 0 {
		t.Errorf("%d entries leaked", p.Len())
	}
}

func TestTHEBUFFEREDCHANNEL(t *testing.T) {
	// the caller gives up, then the reply arrives: Deliver must not block
	p := NewPending()
	id, ch, _ := p.Register()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
	defer cancel()
	if _, err := p.Wait(ctx, id, ch); err == nil {
		t.Fatal("want a context error")
	}

	done := make(chan struct{})
	go func() { p.Deliver(Response{ID: id, OK: true}); close(done) }()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("Deliver blocked on an abandoned call — is the channel buffered?")
	}
}

func TestAbandonedCallDoesNotLeak(t *testing.T) {
	p := NewPending()
	for i := 0; i < 50; i++ {
		id, ch, _ := p.Register()
		ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond)
		p.Wait(ctx, id, ch)
		cancel()
	}
	if p.Len() != 0 {
		t.Errorf("%d entries leaked after timeouts", p.Len())
	}
}

func TestDeliverToNobodyIsHarmless(t *testing.T) {
	p := NewPending()
	done := make(chan struct{})
	go func() { p.Deliver(Response{ID: 9999, OK: true}); close(done) }()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("Deliver blocked on an unknown id")
	}
}

func TestCloseFailsEveryWaiter(t *testing.T) {
	p := NewPending()
	id, ch, _ := p.Register()

	go func() { time.Sleep(20 * time.Millisecond); p.Close() }()
	_, err := p.Wait(context.Background(), id, ch)
	if !errors.Is(err, ErrClosed) {
		t.Errorf("err = %v, want ErrClosed", err)
	}

	p.Close() // twice must be safe
	if _, _, err := p.Register(); !errors.Is(err, ErrClosed) {
		t.Errorf("Register after Close = %v, want ErrClosed", err)
	}
}
