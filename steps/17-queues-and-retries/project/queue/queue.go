package queue

import (
	"context"
	"sync"
	"time"
)

type State string

const (
	Pending    State = "pending"
	Running    State = "running"
	Done       State = "done"
	DeadLetter State = "dead"
)

type Job struct {
	ID       int
	Type     string
	Payload  string
	State    State
	Attempts int
	RunAfter time.Time
	// ClaimedUntil is the VISIBILITY TIMEOUT. It is how the queue survives a
	// worker that dies holding a job: a reaper returns anything past its
	// deadline to pending. It is also why a SLOW worker's job can run twice —
	// which is exactly why you need idempotency. The two are one decision.
	ClaimedUntil time.Time
	LastError    string
}

type Handler func(ctx context.Context, j Job) error

type Queue struct {
	mu         sync.Mutex
	jobs       map[int]*Job
	nextID     int
	visibility time.Duration
	maxAttempt int
	now        func() time.Time // injectable, so tests do not have to sleep
}

func New(visibility time.Duration, maxAttempts int) *Queue {
	return &Queue{
		jobs: make(map[int]*Job), nextID: 1,
		visibility: visibility, maxAttempt: maxAttempts,
		now: time.Now,
	}
}

// SetClock lets the tests control time.
func (q *Queue) SetClock(f func() time.Time) { q.mu.Lock(); q.now = f; q.mu.Unlock() }

// Enqueue adds a pending job and returns its id.
//
// TODO: implement this.
func (q *Queue) Enqueue(typ, payload string) int {
	panic("TODO: Enqueue")
}

// Claim atomically takes the oldest job that is due, or one whose claim has
// expired, and marks it running.
//
// TODO: implement this. It returns (job, true) or (zero, false).
//
//	A job is claimable when:
//	  state == Pending AND RunAfter <= now
//	  OR state == Running AND ClaimedUntil < now   (a dead worker's job)
//
//	Pick the one with the EARLIEST RunAfter, then set:
//	  State = Running, Attempts++, ClaimedUntil = now + visibility
//
//	THE RULE: this must be one atomic operation under the lock. A read
//	followed by a separate write lets two workers claim the same job. In
//	SQL this is a single
//	  UPDATE ... WHERE id = (SELECT ... LIMIT 1) RETURNING *
//	and not a SELECT then an UPDATE.
func (q *Queue) Claim() (Job, bool) {
	panic("TODO: Claim")
}

// Complete marks a job finished.
//
// TODO: implement this.
func (q *Queue) Complete(id int) {
	panic("TODO: Complete")
}

// Fail reschedules a job with backoff, or moves it to the dead letter list.
//
// TODO: implement this.
//
//	If Attempts >= maxAttempt, set State = DeadLetter and record the error.
//	Otherwise set State = Pending and RunAfter = now + Backoff(attempts).
func (q *Queue) Fail(id int, err error) {
	panic("TODO: Fail")
}

// Backoff returns the delay before attempt n is retried.
//
// TODO: implement this.
//
//	Exponential: roughly 2^n seconds, capped at five minutes.
//	THEN ADD JITTER — a random portion of the delay. Without jitter every
//	client that failed at the same moment retries at the same moment, and
//	you have invented a thundering herd that keeps the struggling service
//	down. Returning base/2 + rand(base/2) is a fine shape.
func Backoff(attempt int) time.Duration {
	panic("TODO: Backoff")
}

// Stats is for the tests.
func (q *Queue) Stats() map[State]int {
	q.mu.Lock()
	defer q.mu.Unlock()
	out := map[State]int{}
	for _, j := range q.jobs {
		out[j.State]++
	}
	return out
}
