package selectx

import "time"

// `select` waits on several channel operations at once and runs whichever is
// ready first. If more than one is ready it picks UNIFORMLY AT RANDOM, which
// stops a busy channel from starving a quiet one.
//
// Two forms worth knowing cold:
//   - with `case <-time.After(d)`: a timeout
//   - with `default`: a non-blocking try, which is how you implement
//     "drop it and count it" backpressure

// FirstOf returns the first value to arrive on either channel.
//
// TODO: implement this with a select over two receive cases.
func FirstOf(a, b <-chan int) int {
	return 0
}

// RecvTimeout waits up to d for a value on ch.
// Returns (value, true) on success, (0, false) on timeout.
//
// TODO: implement this.
//
//	    select {
//	    case v := <-ch:              return v, true
//	    case <-time.After(d):        return 0, false
//	    }
//
//	time.After allocates a timer that fires once. In a hot loop prefer
//	time.NewTimer plus defer timer.Stop(), or you leak timers until they
//	fire. Make a note of that for the pinger later.
func RecvTimeout(ch <-chan int, d time.Duration) (int, bool) {
	return 0, false
}

// TrySend sends v on ch if a receiver or buffer slot is ready right now,
// and reports whether it did. It must never block.
//
// TODO: implement this using select with a `default` case.
//
//	This is exactly the decision the scheduler in the ping service has to
//	make when its job queue is full: skip this round and count it, rather
//	than stalling the whole scheduler behind one slow host.
func TrySend(ch chan<- int, v int) bool {
	return false
}

// Drain reads everything currently buffered in ch without blocking, and
// returns it.
//
// TODO: implement this.
//
//	Loop with a non-blocking receive, and stop at the first `default`.
func Drain(ch <-chan int) []int {
	return nil
}
