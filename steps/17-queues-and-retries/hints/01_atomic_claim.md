# 01_atomic_claim

## Hint 1
One `q.mu.Lock(); defer q.mu.Unlock()` at the top of every method. The whole
exercise is that `Claim` does its scan AND its write inside that one
critical section.

## Hint 2
```go
func (q *Queue) Add() int {
	q.mu.Lock()
	defer q.mu.Unlock()
	id := q.nextID
	q.nextID++
	q.jobs[id] = &Job{ID: id, State: Pending, RunAfter: q.now()}
	return id
}
```

## Hint 3
```go
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
	return *best, true          // a COPY
}
```

## Hint 4
Try removing the lock and running `go test -race`. The detector will name
both conflicting accesses and both goroutines. Then put it back.
