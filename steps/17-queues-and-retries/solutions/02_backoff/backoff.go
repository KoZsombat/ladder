package backoff

import (
	"math/rand"
	"time"
)

func Delay(attempt int, unit, max time.Duration) time.Duration {
	if attempt < 1 {
		attempt = 1
	}
	shift := attempt - 1
	if shift > 32 {
		shift = 32
	}
	base := unit << shift
	if base > max || base <= 0 {
		base = max
	}
	half := base / 2
	if half <= 0 {
		return base
	}
	return half + time.Duration(rand.Int63n(int64(half)))
}

func ShouldRetry(attempt, maxAttempts int, retryable bool) bool {
	return retryable && attempt < maxAttempts
}

func Schedule(maxAttempts int, unit, max time.Duration) []time.Duration {
	out := make([]time.Duration, 0, maxAttempts)
	for n := 1; n <= maxAttempts; n++ {
		out = append(out, Delay(n, unit, max))
	}
	return out
}
