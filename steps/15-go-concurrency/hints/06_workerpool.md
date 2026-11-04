# 12_workerpool

## Hint 1
Five moving parts: a jobs channel, N worker goroutines, a feeder goroutine,
a buffered results channel, and a WaitGroup. The TODO block in the file is
already the skeleton — work through it line by line.

## Hint 2
Order of operations at the end matters:
```go
wg.Wait()        // all workers finished
close(results)   // only now is it safe
for r := range results { out = append(out, r) }
```
If you close `results` before `wg.Wait()`, a straggler panics with
"send on closed channel".

## Hint 3
The per-job recover:
```go
func safely(h func(Job) (int, error), j Job) (v int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("panic: %v", r)
        }
    }()
    return h(j)
}
```
Named return values are what let the deferred function change what gets
returned — this is the one place where naming your returns is not just style.

## Solution
See `solutions/12_workerpool/pool.go`.
