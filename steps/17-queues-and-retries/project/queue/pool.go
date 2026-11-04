package queue

import (
	"context"
	"sync"
	"time"
)

type Pool struct {
	q       *Queue
	handler Handler
	wg      sync.WaitGroup
}

func NewPool(q *Queue, h Handler) *Pool { return &Pool{q: q, handler: h} }

// Start launches n workers.
//
// TODO: implement this.
//
//	The point of a worker pool is NOT "do things in parallel". It is "do at
//	most N things in parallel", because the resource downstream has a limit
//	and unbounded concurrency finds it violently.
//
//	Each worker loops:
//	  select on ctx.Done() -> return
//	  otherwise Claim(); if nothing is claimable, sleep briefly and retry
//	  run the job through runOne
//
//	wg.Add(1) goes BEFORE the `go` statement, never inside the goroutine —
//	otherwise Wait can return before the goroutine has started counting.
func (p *Pool) Start(ctx context.Context, n int) {
	panic("TODO: Start")
}

// runOne executes one job, converting a panic into a failure.
//
// TODO: implement this.
//
//	defer a recover() that calls q.Fail with the panic value. A panic in one
//	job must not take the pool down with it — recover PER JOB, not once
//	around the whole worker loop.
//
//	Then call the handler; Complete on nil, Fail otherwise.
func (p *Pool) runOne(ctx context.Context, j Job) {
	panic("TODO: runOne")
}

// Wait blocks until every worker has returned.
func (p *Pool) Wait() { p.wg.Wait() }

// Shutdown is the part everyone skips.
//
// TODO: implement this.
//
//	On SIGTERM the caller cancels the context. This function then waits for
//	the in-flight jobs to finish, but no longer than `grace`. Return whether
//	everything finished cleanly.
//
//	The order that matters in the real thing: stop accepting new work, let
//	the in-flight work finish within a deadline, THEN close the store. A job
//	killed at an arbitrary instruction is what the visibility timeout cleans
//	up after, so the better your shutdown, the less you rely on it.
func (p *Pool) Shutdown(grace time.Duration) bool {
	panic("TODO: Shutdown")
}
