# 10_context

## Hint 1
`SlowDouble` is one select. `SumWithTimeout` is WithTimeout + defer cancel +
a loop that checks `ctx.Err()`. `Race` is WithCancel + a buffered channel.

## Hint 2
```go
ctx, cancel := context.WithTimeout(ctx, budget)
defer cancel()
for _, fn := range fns {
    if err := ctx.Err(); err != nil { return total, err }
    total += fn(ctx)
}
return total, nil
```

## Hint 3
`Race`:
```go
ctx, cancel := context.WithCancel(ctx)
defer cancel()
res := make(chan int, 2)          // capacity 2: the loser must not block
go func() { res <- a(ctx) }()
go func() { res <- b(ctx) }()
return <-res
```

## Solution
See `solutions/10_context/contextx.go`.
