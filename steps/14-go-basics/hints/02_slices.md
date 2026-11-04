# 02_slices

## Hint 1
`Evens` and `Sum` are plain range loops. `Reverse` is where the lesson is:
assigning a slice to a new variable does not copy the elements.

## Hint 2
- `Evens`: `out := make([]int, 0, len(xs))`, then append when `v%2 == 0`.
- `Reverse`: allocate `out := make([]int, len(xs))` and fill it backwards,
  or `copy(out, xs)` first and then swap in place.
- `Chunk`: `for i := 0; i < len(xs); i += size`.

## Hint 3
Reverse, filling backwards:
```go
out := make([]int, len(xs))
for i, v := range xs {
    out[len(xs)-1-i] = v
}
return out
```
Chunk's end index: `end := min(i+size, len(xs))`.

## Solution
See `solutions/02_slices/slices.go`.
