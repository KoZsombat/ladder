package backoff

import "time"

// Retrying immediately turns a struggling service into a dead one. Three
// rules, and the third is the one people leave out.
//
//   EXPONENTIAL: double the delay each attempt, so a persistent failure
//     backs off quickly instead of hammering.
//   CAPPED: or attempt 20 waits twelve days.
//   JITTERED: add randomness. Without it, every client that failed at the
//     same moment retries at the same moment, and you have invented a
//     thundering herd that keeps the service down.

// Delay returns how long to wait before the given attempt (1-based).
//
// TODO: implement this.
//
//	base = unit * 2^(attempt-1), capped at max.
//	Then return a random duration in [base/2, base) — "full jitter" halved,
//	which keeps the growth while spreading the clients out.
//
//	Guard the shift: 1 << 40 overflows and gives you a negative duration,
//	which sleeps forever or panics depending on where it lands. Cap the
//	exponent BEFORE shifting, not after.
func Delay(attempt int, unit, max time.Duration) time.Duration {
	panic("TODO: Delay")
}

// ShouldRetry decides whether another attempt is worth making.
//
// TODO: implement this.
//
//	Retry while attempt < maxAttempts AND the error is retryable.
//	A permanent error — a 400, a malformed payload, a missing record —
//	must NOT be retried: you will fail five more times, delay the dead
//	letter, and hide the real problem.
func ShouldRetry(attempt, maxAttempts int, retryable bool) bool {
	panic("TODO: ShouldRetry")
}

// Schedule returns the delays for a whole run of attempts, for inspection.
//
// TODO: implement this. Used by the test to check growth and spread.
func Schedule(maxAttempts int, unit, max time.Duration) []time.Duration {
	panic("TODO: Schedule")
}
