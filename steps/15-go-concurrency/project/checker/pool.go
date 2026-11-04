package checker

import (
	"context"
	"net/http"
	"sync"
	"time"
)

// CheckAll checks every URL with at most n in flight.
//
// TODO: implement this. The pattern you will reuse at step 19:
//
//	  jobs := make(chan string)
//	  results := make(chan Result, len(urls))   // BUFFERED: senders never block
//	  var wg sync.WaitGroup
//
//	  for i := 0; i < n; i++ {
//	      wg.Add(1)                             // BEFORE the go statement
//	      go func() {
//	          defer wg.Done()
//	          for {
//	              select {
//	              case <-ctx.Done():
//	                  return
//	              case u, ok := <-jobs:
//	                  if !ok { return }         // channel closed: no more work
//	                  results <- Check(ctx, c, u, timeout)
//	              }
//	          }
//	      }()
//	  }
//
//	  go func() {                               // feeder, so CheckAll does not block
//	      defer close(jobs)
//	      for _, u := range urls {
//	          select {
//	          case jobs <- u:
//	          case <-ctx.Done(): return
//	          }
//	      }
//	  }()
//
//	  wg.Wait()
//	  close(results)
//	  ...drain into a slice...
//
//	Four things to get right, each a real bug if you miss it:
//	  1. the feeder must also watch ctx, or cancelling leaves it blocked
//	     on a send nobody will receive — a goroutine leak
//	  2. close(jobs) is what ends the workers' loops
//	  3. close(results) only AFTER wg.Wait(), or a straggler panics with
//	     "send on closed channel"
//	  4. recover per check, so one panic does not take the pool down
func CheckAll(ctx context.Context, c *http.Client, urls []string, n int, timeout time.Duration) []Result {
	var wg sync.WaitGroup
	_ = wg
	panic("TODO: CheckAll")
}

// Summary counts the outcomes.
//
// TODO: implement this. A map[Outcome]int.
func Summary(rs []Result) map[Outcome]int {
	panic("TODO: Summary")
}

var _ = time.Second
