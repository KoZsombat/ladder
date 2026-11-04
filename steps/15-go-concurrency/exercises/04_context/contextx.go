package contextx

import (
	"context"
	"time"
)

// context.Context carries a cancellation signal and a deadline down a call
// tree. The rules are short and they are conventions the whole ecosystem
// follows:
//
//   - it is always the FIRST parameter, always named ctx
//   - you never store it in a struct
//   - every function that can block should take one and honour it
//
// A function that ignores its context is a function that keeps a worker busy
// for the full TCP timeout after you asked the process to shut down.

// SlowDouble returns v*2 after d, unless ctx is cancelled first.
//
// TODO: implement this.
//
//	    select {
//	    case <-time.After(d):  return v * 2, nil
//	    case <-ctx.Done():     return 0, ctx.Err()
//	    }
//
//	ctx.Err() tells you WHICH it was: context.Canceled or
//	context.DeadlineExceeded. Returning it unchanged lets the caller use
//	errors.Is to find out, which is the exercise-06 lesson again.
func SlowDouble(ctx context.Context, v int, d time.Duration) (int, error) {
	return 0, nil
}

// SumWithTimeout calls each function in turn, stopping early if the budget
// runs out. It returns the running total and, if it stopped early, the
// context error.
//
// TODO: implement this.
//
//	Derive a child context with context.WithTimeout(ctx, budget) and
//	remember `defer cancel()` — ALWAYS. Not calling cancel leaks the timer
//	and the goroutine watching it until the deadline passes. `go vet` will
//	complain if you forget, which is a good reason to run it.
//
//	Before each call, check whether you have already been cancelled:
//	    if err := ctx.Err(); err != nil { return total, err }
func SumWithTimeout(ctx context.Context, budget time.Duration, fns []func(context.Context) int) (int, error) {
	return 0, nil
}

// Race runs both functions concurrently and returns whichever finishes first,
// cancelling the loser.
//
// TODO: implement this.
//
//	Make a cancellable child context, start both with it, take the first
//	result off a BUFFERED channel of capacity 2, then cancel.
//
//	The buffer matters: with an unbuffered channel the loser blocks forever
//	trying to send its result that nobody reads, and you have leaked a
//	goroutine. This is the most common goroutine leak in Go, and the reason
//	the pinger test asserts NumGoroutine returns to baseline.
func Race(ctx context.Context, a, b func(context.Context) int) int {
	return 0
}
