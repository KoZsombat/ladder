package workerpool

import (
	"context"
	"sync"
)

// This is the capstone of the Go track, and it is the exact pattern the job
// queue and the ping service on the ladder are built from.
//
// The point of a worker pool is NOT "do things in parallel". It is "do at
// most N things in parallel", because the resource downstream — a database,
// a remote host, a file descriptor table — has a limit, and unbounded
// concurrency finds that limit violently.

type Job struct {
	ID    int
	Input int
}

type Result struct {
	JobID int
	Value int
	Err   error
}

// Run processes every job with at most n concurrent workers.
// Results may come back in any order. It stops early if ctx is cancelled.
//
// TODO: implement this.
//
//	The shape, which you should be able to write from memory by the end:
//
//	  jobs := make(chan Job)
//	  results := make(chan Result, len(input))   // buffered: senders never block
//	  var wg sync.WaitGroup
//
//	  for i := 0; i < n; i++ {                   // N workers, all reading ONE channel
//	      wg.Add(1)
//	      go func() {
//	          defer wg.Done()
//	          for {
//	              select {
//	              case <-ctx.Done():
//	                  return
//	              case j, ok := <-jobs:
//	                  if !ok { return }          // channel closed: no more work
//	                  results <- Result{...handler(j)...}
//	              }
//	          }
//	      }()
//	  }
//
//	  go func() {                                // feeder, so Run does not block
//	      defer close(jobs)
//	      for _, j := range input {
//	          select {
//	          case jobs <- j:
//	          case <-ctx.Done(): return
//	          }
//	      }
//	  }()
//
//	  wg.Wait()
//	  close(results)
//	  ...drain results into a slice...
//
//	Four things to get right, each of which is a real bug if you miss it:
//	  1. The feeder must also watch ctx, or cancelling leaves it blocked on
//	     a send that nobody will receive.
//	  2. close(jobs) is what ends the workers' loops.
//	  3. close(results) only AFTER wg.Wait(), or a worker sends on a closed
//	     channel and panics.
//	  4. A panic inside handler must not kill the pool: recover per job and
//	     turn it into a Result with an Err.
func Run(ctx context.Context, n int, input []Job, handler func(Job) (int, error)) []Result {
	var wg sync.WaitGroup
	_ = wg
	return nil
}
