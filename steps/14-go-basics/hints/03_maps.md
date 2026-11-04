# 03_maps

## Hint 1
`WordCount` is three lines. `MostCommon` needs an explicit tie-break because
map iteration order is random.

## Hint 2
- `WordCount`: `m := make(map[string]int)`, then `m[w]++` in a range loop.
- `MostCommon`: track `bestWord` and `bestN`; replace when `n > bestN`, OR
  when `n == bestN && w < bestWord`.
- `Lookup`: `v, ok := m[key]; return v, ok`.

## Hint 3
The tie-break condition in full:
```go
if n > bestN || (n == bestN && w < bestWord) {
    bestWord, bestN = w, n
}
```

## Solution
See `solutions/03_maps/maps.go`.
