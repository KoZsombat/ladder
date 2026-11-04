package mutex

import (
	"fmt"
	"sync"
	"testing"
)

func TestSafeCounter(t *testing.T) {
	var c SafeCounter
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 100; j++ {
				c.Inc()
			}
		}()
	}
	wg.Wait()
	if got := c.Value(); got != 10000 {
		t.Errorf("Value = %d, want 10000 (run with -race)", got)
	}
}

func TestRegistry(t *testing.T) {
	r := NewRegistry()
	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func(i int) { defer wg.Done(); r.Add(fmt.Sprintf("n%d", i)) }(i)
	}
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func(i int) { defer wg.Done(); _ = r.Has(fmt.Sprintf("n%d", i)) }(i)
	}
	wg.Wait()
	for i := 0; i < 50; i++ {
		if !r.Has(fmt.Sprintf("n%d", i)) {
			t.Fatalf("n%d missing", i)
		}
	}
	if r.Has("nope") {
		t.Error("Has returned true for an absent name")
	}
}
