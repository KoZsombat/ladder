package shutdown

import (
	"context"
	"sync"
	"testing"
	"time"
)

func TestBatchesAtSize(t *testing.T) {
	b := NewBatcher(3)
	for _, s := range []string{"a", "b", "c", "d"} {
		b.Add(s)
	}
	f := b.Flushed()
	if len(f) != 1 || len(f[0]) != 3 {
		t.Fatalf("flushed = %v, want one batch of 3", f)
	}
	b.Flush()
	if f = b.Flushed(); len(f) != 2 || len(f[1]) != 1 {
		t.Errorf("flushed = %v, want a second batch of 1", f)
	}
}

func TestFlushedBatchesDoNotAlias(t *testing.T) {
	b := NewBatcher(2)
	for _, s := range []string{"a", "b", "c", "d"} {
		b.Add(s)
	}
	f := b.Flushed()
	if len(f) != 2 {
		t.Fatalf("want 2 batches, got %d", len(f))
	}
	if f[0][0] != "a" {
		t.Errorf("the first batch became %v — you appended the reused slice", f[0])
	}
}

func TestEmptyFlushIsANoOp(t *testing.T) {
	b := NewBatcher(5)
	b.Flush()
	b.Flush()
	if len(b.Flushed()) != 0 {
		t.Error("empty flushes should record nothing")
	}
}

func TestRunFlushesOnTheTicker(t *testing.T) {
	b := NewBatcher(1000)
	in := make(chan string)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go b.Run(ctx, in, 40*time.Millisecond)

	in <- "x"
	in <- "y"
	time.Sleep(150 * time.Millisecond)
	if len(b.Flushed()) == 0 {
		t.Error("nothing flushed after several ticks")
	}
}

func TestTHELASTBATCH_CancellationFlushesFirst(t *testing.T) {
	b := NewBatcher(1000) // never fills
	in := make(chan string)
	ctx, cancel := context.WithCancel(context.Background())

	done := make(chan struct{})
	go func() { b.Run(ctx, in, time.Hour); close(done) }() // never ticks

	in <- "important"
	cancel()
	<-done

	f := b.Flushed()
	if len(f) != 1 || len(f[0]) != 1 || f[0][0] != "important" {
		t.Errorf("flushed = %v — the last batch was lost on shutdown", f)
	}
}

func TestRunStopsWhenTheChannelCloses(t *testing.T) {
	b := NewBatcher(1000)
	in := make(chan string, 2)
	in <- "a"
	in <- "b"
	close(in)

	done := make(chan struct{})
	go func() { b.Run(context.Background(), in, time.Hour); close(done) }()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("Run did not return when the input channel closed")
	}
	if f := b.Flushed(); len(f) != 1 || len(f[0]) != 2 {
		t.Errorf("flushed = %v, want one batch of 2", f)
	}
}

func TestShutdownReturnsTrueWhenWorkersFinish(t *testing.T) {
	var wg sync.WaitGroup
	wg.Add(2)
	for i := 0; i < 2; i++ {
		go func() { time.Sleep(30 * time.Millisecond); wg.Done() }()
	}
	if !Shutdown(&wg, time.Second) {
		t.Error("want true")
	}
}

func TestShutdownGivesUpAtTheDeadline(t *testing.T) {
	var wg sync.WaitGroup
	wg.Add(1) // never Done

	start := time.Now()
	if Shutdown(&wg, 80*time.Millisecond) {
		t.Error("want false for a stuck worker")
	}
	if elapsed := time.Since(start); elapsed > time.Second {
		t.Errorf("waited %v — Shutdown must not block forever", elapsed)
	}
}
