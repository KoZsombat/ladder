package workerpool

import (
	"context"
	"fmt"
	"sync"
)

type Job struct {
	ID    int
	Input int
}

type Result struct {
	JobID int
	Value int
	Err   error
}

func safely(h func(Job) (int, error), j Job) (v int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	return h(j)
}

func Run(ctx context.Context, n int, input []Job, handler func(Job) (int, error)) []Result {
	if n < 1 {
		n = 1
	}
	jobs := make(chan Job)
	results := make(chan Result, len(input))

	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return
				case j, ok := <-jobs:
					if !ok {
						return
					}
					v, err := safely(handler, j)
					results <- Result{JobID: j.ID, Value: v, Err: err}
				}
			}
		}()
	}

	go func() {
		defer close(jobs)
		for _, j := range input {
			select {
			case jobs <- j:
			case <-ctx.Done():
				return
			}
		}
	}()

	wg.Wait()
	close(results)

	out := make([]Result, 0, len(input))
	for r := range results {
		out = append(out, r)
	}
	return out
}
