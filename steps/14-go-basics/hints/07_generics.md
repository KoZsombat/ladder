# 13_generics

## Hint 1
Every body here is the same loop you would write for a concrete type. The
signatures are already done; only the bodies are missing.

## Hint 2
```go
func Map[T, U any](xs []T, f func(T) U) []U {
    out := make([]U, 0, len(xs))
    for _, v := range xs { out = append(out, f(v)) }
    return out
}
```

## Hint 3
`Reduce`: `acc := init`, loop `acc = f(acc, v)`, return acc.
`Sum`: `var total T`, loop `total += v`.
`Keys`: `out := make([]K, 0, len(m))`, `for k := range m`.

## Solution
See `solutions/13_generics/generics.go`.
