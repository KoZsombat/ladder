package goroutines

import "sync"

func SumParallel(xs []int, n int) int {
	if n <= 0 || len(xs) == 0 {
		s := 0
		for _, v := range xs {
			s += v
		}
		return s
	}

	size := (len(xs) + n - 1) / n
	var chunks [][]int
	for i := 0; i < len(xs); i += size {
		chunks = append(chunks, xs[i:min(i+size, len(xs))])
	}

	var wg sync.WaitGroup
	partial := make([]int, len(chunks))
	for i, c := range chunks {
		wg.Add(1)
		go func(i int, c []int) {
			defer wg.Done()
			s := 0
			for _, v := range c {
				s += v
			}
			partial[i] = s
		}(i, c)
	}
	wg.Wait()

	total := 0
	for _, p := range partial {
		total += p
	}
	return total
}

func FirstError(fns []func() error) error {
	var wg sync.WaitGroup
	var mu sync.Mutex
	var first error

	for _, fn := range fns {
		wg.Add(1)
		go func(fn func() error) {
			defer wg.Done()
			if err := fn(); err != nil {
				// shared variable, so it needs a lock
				mu.Lock()
				if first == nil {
					first = err
				}
				mu.Unlock()
			}
		}(fn)
	}
	wg.Wait()
	return first
}
