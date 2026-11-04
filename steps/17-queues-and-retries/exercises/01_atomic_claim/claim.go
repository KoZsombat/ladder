package claim

import (
	"sync"
	"time"
)

// Two workers must never get the same job. The whole guarantee lives in one
// property: the read and the write that claim a job have to be ONE
// indivisible operation.
//
// In SQL that is a single
//
//	UPDATE jobs SET state='running' WHERE id = (SELECT ... LIMIT 1) RETURNING *
//
// and not a SELECT followed by an UPDATE. Here it is one critical section.
//
// The second mechanism is the VISIBILITY TIMEOUT: a claim carries a
// deadline, and a job whose deadline has passed becomes claimable again.
// That is how the queue survives a worker that died holding a job — and it
// is also why a SLOW worker's job can run twice, which is exactly why you
// need idempotency. The two are one decision.

type State string

const (
	Pending State = "pending"
	Running State = "running"
	Done    State = "done"
)

type Job struct {
	ID           int
	State        State
	Attempts     int
	RunAfter     time.Time
	ClaimedUntil time.Time
}

type Queue struct {
	mu         sync.Mutex
	jobs       map[int]*Job
	nextID     int
	visibility time.Duration
	now        func() time.Time
}

func New(visibility time.Duration) *Queue {
	return &Queue{jobs: map[int]*Job{}, nextID: 1, visibility: visibility, now: time.Now}
}

// SetClock lets tests control time instead of sleeping.
func (q *Queue) SetClock(f func() time.Time) { q.mu.Lock(); q.now = f; q.mu.Unlock() }

// TODO: implement. Add a pending job due immediately, return its id.
func (q *Queue) Add() int {
	panic("TODO: Add")
}

// Claim atomically takes one claimable job.
//
// TODO: implement this. Returns (job, true) or (zero, false).
//
//	A job is claimable when EITHER
//	  state == Pending and RunAfter <= now
//	  state == Running and ClaimedUntil < now      (its worker died)
//
//	Among the claimable ones take the EARLIEST RunAfter, then set
//	State = Running, Attempts++, ClaimedUntil = now + visibility.
//
//	ONE lock around the whole read-and-write. And return a COPY of the Job,
//	not the pointer: hand out the pointer and callers mutate your state
//	outside the lock, which -race will find immediately.
func (q *Queue) Claim() (Job, bool) {
	panic("TODO: Claim")
}

// TODO: implement. Mark it done. Unknown ids are a no-op.
func (q *Queue) Complete(id int) {
	panic("TODO: Complete")
}

// TODO: implement. Count the jobs in each state.
func (q *Queue) Stats() map[State]int {
	panic("TODO: Stats")
}
