package channels

import (
	"sort"
	"testing"
	"time"
)

func TestPipeline(t *testing.T) {
	done := make(chan []int)
	go func() { done <- Collect(Square(Generate(5))) }()
	select {
	case got := <-done:
		want := []int{1, 4, 9, 16, 25}
		if len(got) != len(want) {
			t.Fatalf("got %v, want %v", got, want)
		}
		for i := range want {
			if got[i] != want[i] {
				t.Fatalf("got %v, want %v", got, want)
			}
		}
	case <-time.After(2 * time.Second):
		t.Fatal("timed out — did a stage forget to close its channel?")
	}
}

func TestMerge(t *testing.T) {
	done := make(chan []int)
	go func() { done <- Collect(Merge(Generate(3), Generate(3))) }()
	select {
	case got := <-done:
		sort.Ints(got)
		want := []int{1, 1, 2, 2, 3, 3}
		if len(got) != len(want) {
			t.Fatalf("got %v, want %v", got, want)
		}
		for i := range want {
			if got[i] != want[i] {
				t.Fatalf("got %v, want %v", got, want)
			}
		}
	case <-time.After(2 * time.Second):
		t.Fatal("timed out — is close(out) waiting on wg.Wait() in the main path?")
	}
}
