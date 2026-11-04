package scheduler

import (
	"context"
	"sync"
	"time"

	"ladder/pinger/internal/checker"
	"ladder/pinger/internal/store"
)

type Scheduler struct {
	store   store.Store
	check   *checker.Checker
	jobs    chan checker.Target
	results chan checker.Result

	mu      sync.Mutex
	skipped int
	wg      sync.WaitGroup
}

func New(s store.Store, c *checker.Checker, queueSize int) *Scheduler {
	return &Scheduler{
		store: s, check: c,
		jobs:    make(chan checker.Target, queueSize),
		results: make(chan checker.Result, 1024),
	}
}

func (s *Scheduler) Skipped() int    { s.mu.Lock(); defer s.mu.Unlock(); return s.skipped }
func (s *Scheduler) QueueDepth() int { return len(s.jobs) }

// StartWorkers launches the fixed worker pool.
//
// TODO: implement this. It is the project-15 pattern again.
//
//	N goroutines, each selecting on ctx.Done() and on the jobs channel.
//	One goroutine per target per tick is the WRONG shape: when a target goes
//	slow the ticks overlap and you end up with thousands of goroutines all
//	hammering one dead host.
//
//	Recover per check, so one panic does not take the pool down.
func (s *Scheduler) StartWorkers(ctx context.Context, n int) {
	panic("TODO: StartWorkers")
}

// Run ticks once a second, finds due targets and enqueues them.
//
// TODO: implement this.
//
//	    select {
//	    case s.jobs <- t:
//	    default:
//	        // THE CHANNEL IS FULL. This is a decision you cannot dodge:
//	        // skip this round and COUNT it. For a monitor that is right —
//	        // blocking would stall the whole scheduler behind one slow host.
//	        s.skipped++
//	    }
//
//	Having a backpressure mechanism you have never seen fire is the same as
//	not having one. Write a test that fills the queue on purpose.
func (s *Scheduler) Run(ctx context.Context) {
	panic("TODO: Run")
}

// RunWriter batches results into the store.
//
// TODO: implement this.
//
//	ONE goroutine writes. Workers only push onto s.results.
//	Flush when you have 200 results OR once a second, whichever comes first,
//	in a single store call.
//
//	On ctx.Done(), flush what you have before returning — otherwise the last
//	batch is lost on every shutdown, which looks like random missing data.
func (s *Scheduler) RunWriter(ctx context.Context) {
	panic("TODO: RunWriter")
}

// Wait blocks until the workers have stopped.
func (s *Scheduler) Wait() { s.wg.Wait() }

// Results exposes the channel for the workers.
func (s *Scheduler) Results() chan checker.Result { return s.results }

var _ = time.Second
