# 02_backoff

## Hint 1
Cap the EXPONENT before you shift. `1 << 40` on an int64 of nanoseconds is
already past a day; `1 << 64` is undefined.

## Hint 2
```go
func Delay(attempt int, unit, max time.Duration) time.Duration {
	if attempt < 1 {
		attempt = 1
	}
	shift := attempt - 1
	if shift > 32 {
		shift = 32              // cap BEFORE shifting
	}
	base := unit << shift
	if base > max || base <= 0 {
		base = max
	}
	// ...
}
```

## Hint 3
```go
	half := base / 2
	return half + time.Duration(rand.Int63n(int64(half)))
```
That gives `[base/2, base)` — the half-open band the test checks.
Guard `half == 0` (`rand.Int63n(0)` panics).

## Hint 4
```go
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
```
