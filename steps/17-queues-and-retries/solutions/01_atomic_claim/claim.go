package claim

import (
	"sync"
	"time"
)

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

func (q *Queue) SetClock(f func() time.Time) { q.mu.Lock(); q.now = f; q.mu.Unlock() }

func (q *Queue) Add() int {
	q.mu.Lock()
	defer q.mu.Unlock()
	id := q.nextID
	q.nextID++
	q.jobs[id] = &Job{ID: id, State: Pending, RunAfter: q.now()}
	return id
}

func (q *Queue) Claim() (Job, bool) {
	q.mu.Lock()
	defer q.mu.Unlock()
	now := q.now()

	var best *Job
	for _, j := range q.jobs {
		claimable := (j.State == Pending && !j.RunAfter.After(now)) ||
			(j.State == Running && j.ClaimedUntil.Before(now))
		if !claimable {
			continue
		}
		if best == nil || j.RunAfter.Before(best.RunAfter) {
			best = j
		}
	}
	if best == nil {
		return Job{}, false
	}
	best.State = Running
	best.Attempts++
	best.ClaimedUntil = now.Add(q.visibility)
	return *best, true
}

func (q *Queue) Complete(id int) {
	q.mu.Lock()
	defer q.mu.Unlock()
	if j, ok := q.jobs[id]; ok {
		j.State = Done
	}
}

func (q *Queue) Stats() map[State]int {
	q.mu.Lock()
	defer q.mu.Unlock()
	out := map[State]int{}
	for _, j := range q.jobs {
		out[j.State]++
	}
	return out
}
