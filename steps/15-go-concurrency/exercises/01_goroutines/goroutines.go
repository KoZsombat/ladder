package goroutines

import "sync"

// A goroutine is a function call with `go` in front of it. It is cheap —
// a few kilobytes — but it is NOT free, and crucially it is not awaited.
// If main returns while goroutines are running, they die mid-sentence.
//
// sync.WaitGroup is the counter that fixes that: Add before you start,
// Done when each finishes, Wait until the count hits zero.

// SumParallel splits xs into n roughly equal chunks, sums each chunk in its
// own goroutine, and returns the total.
//
// TODO: implement this.
//
//	Shape:
//	  var wg sync.WaitGroup
//	  partial := make([]int, n)          // one slot per worker: no sharing
//	  for i, chunk := range chunks {
//	      wg.Add(1)                      // BEFORE the go statement, always
//	      go func() {
//	          defer wg.Done()
//	          partial[i] = sumOf(chunk)  // each goroutine owns ONE slot
//	      }()
//	  }
//	  wg.Wait()
//	  then sum partial
//
//	Why a slice of partials instead of `total += ...` inside the goroutine:
//	`+=` is read-modify-write, two goroutines can interleave, and you lose
//	updates. Run the test with -race to see the detector catch it. Each
//	goroutine writing to its OWN index needs no lock at all.
//
//	If n <= 0 or xs is empty, just return the plain sum.
func SumParallel(xs []int, n int) int {
	var wg sync.WaitGroup
	_ = wg
	return 0
}

// FirstError runs every function concurrently and returns the first non-nil
// error, or nil if they all succeed.
//
// TODO: implement this.
//
//	Same WaitGroup shape, but now the goroutines DO share one variable, so
//	you need a sync.Mutex around the write — or a results slice again.
//	Pick one and say in a comment why.
func FirstError(fns []func() error) error {
	return nil
}
