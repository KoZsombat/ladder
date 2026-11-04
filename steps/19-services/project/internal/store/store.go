package store

import (
	"context"
	"sync"
	"time"

	"ladder/pinger/internal/checker"
)

// Store is the interface the rest of the service consumes. Defining it HERE,
// where it is used rather than where it is implemented, is the Go habit worth
// taking from this project.
type Store interface {
	CreateTarget(ctx context.Context, t checker.Target) (int64, error)
	GetTarget(ctx context.Context, id int64) (checker.Target, bool, error)
	ListTargets(ctx context.Context) ([]checker.Target, error)
	DeleteTarget(ctx context.Context, id int64) (bool, error)
	DueTargets(ctx context.Context, now time.Time) ([]checker.Target, error)
	SaveResults(ctx context.Context, rs []checker.Result) error
	ListResults(ctx context.Context, targetID int64, limit int) ([]checker.Result, error)
	Close() error
}

// Memory is a starter implementation so the service runs on day one.
// Swap it for SQLite when the tests pass — see HINTS.md tier 4.
type Memory struct {
	mu       sync.Mutex
	targets  map[int64]checker.Target
	results  map[int64][]checker.Result
	lastRun  map[int64]time.Time
	nextID   int64
	MaxPerID int
}

func NewMemory() *Memory {
	return &Memory{
		targets: map[int64]checker.Target{},
		results: map[int64][]checker.Result{},
		lastRun: map[int64]time.Time{},
		nextID:  1, MaxPerID: 1000,
	}
}

// TODO: implement the Store methods on *Memory.
//
//	They are mostly mechanical, with two that are not:
//
//	DueTargets — a target is due when now >= lastRun + Interval. Record the
//	run time when you hand it out, or the scheduler will enqueue the same
//	target on every tick.
//
//	Add per-target JITTER to the first run, e.g. an offset derived from the
//	target ID modulo the interval. Without it all 500 targets fire on the
//	same second, you get a thundering herd every interval, and your latency
//	graph grows spikes that are entirely your own fault.
//
//	SaveResults — take the whole BATCH in one call and one lock. Writing one
//	result at a time is two orders of magnitude slower at 500 targets, and
//	when you move to SQLite it is the difference between one transaction and
//	ten thousand.
//
//	Also enforce MaxPerID: unbounded result history turns a 200 MB database
//	into a 20 GB one. Add the retention sweep now, however crude.
