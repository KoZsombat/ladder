# 09_select

## Hint 1
All four are a single `select`, two of them inside a loop.

## Hint 2
```go
select {
case v := <-a: return v
case v := <-b: return v
}
```
`TrySend` is the same shape with `case ch <- v: return true` and
`default: return false`.

## Hint 3
`Drain`:
```go
var out []int
for {
    select {
    case v := <-ch:
        out = append(out, v)
    default:
        return out
    }
}
```

## Solution
See `solutions/09_select/selectx.go`.
