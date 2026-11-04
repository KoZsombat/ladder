# 07_goroutines

## Hint 1
`wg.Add(1)` goes before the `go` statement, never inside the goroutine —
otherwise `Wait` can return before the goroutine has even started counting.

## Hint 2
Compute chunk boundaries first, then launch:
```go
size := (len(xs) + n - 1) / n          // ceiling division
partial := make([]int, 0, n)
```
Simplest correct version: build `chunks [][]int` first, then
`partial := make([]int, len(chunks))` and index into it.

## Hint 3
```go
var wg sync.WaitGroup
partial := make([]int, len(chunks))
for i, c := range chunks {
    wg.Add(1)
    go func(i int, c []int) {
        defer wg.Done()
        s := 0
        for _, v := range c { s += v }
        partial[i] = s
    }(i, c)
}
wg.Wait()
```
Since Go 1.22 the loop variable is per-iteration, so passing `i, c` as
arguments is no longer strictly required — but do it anyway while you are
learning, because every pre-1.22 example you read online needs it.

## Solution
See `solutions/07_goroutines/goroutines.go`.
