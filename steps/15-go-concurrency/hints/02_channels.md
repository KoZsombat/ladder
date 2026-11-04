# 08_channels

## Hint 1
Each of the first three is five lines. The shape is always: make the channel,
`go func() { defer close(ch); ...send... }()`, return the channel.

## Hint 2
```go
func Generate(n int) <-chan int {
    ch := make(chan int)
    go func() {
        defer close(ch)
        for i := 1; i <= n; i++ { ch <- i }
    }()
    return ch
}
```
`Square` is the same with `for v := range in { ch <- v * v }`.
`Collect` needs no goroutine at all.

## Hint 3
`Merge`:
```go
out := make(chan int)
var wg sync.WaitGroup
for _, c := range chans {
    wg.Add(1)
    go func(c <-chan int) {
        defer wg.Done()
        for v := range c { out <- v }
    }(c)
}
go func() { wg.Wait(); close(out) }()   // separate goroutine, or deadlock
return out
```

## Solution
See `solutions/08_channels/channels.go`.
