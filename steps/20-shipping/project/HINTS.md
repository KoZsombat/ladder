## Hint 1 — the mistake almost everyone makes here

They optimise first and measure after. Then the "after" number has nothing
to compare against, and the write-up becomes a list of things you changed
with no evidence any of them mattered.

Save a baseline to a file before you touch a line of code. Even a plain text
file with throughput, p50/p95/p99 and queue depth is enough — it just has to
exist before the change.

## Hint 2 — find the knee, don't guess a rate

Run the load generator at a rate you know is comfortable. Then step it up:
50, 100, 200, 400 requests per second. Watch two numbers together.

While the service has headroom, throughput rises and latency barely moves.
At some rate throughput flattens but latency keeps climbing — that is the
knee, and it is the only interesting operating point. Profile there. Below
it you are profiling an idle program; far above it everything is slow and
nothing stands out.

Use a **constant arrival rate**, not N looping users. With looping users the
generator slows down exactly when your service does, so the queue never
builds and the knee never appears.

## Hint 3 — the four profiles, and what each one is for

```
go tool pprof http://localhost:8080/debug/pprof/profile?seconds=30   # CPU
go tool pprof http://localhost:8080/debug/pprof/heap                # live memory
go tool pprof http://localhost:8080/debug/pprof/block               # waiting on sync
go tool pprof http://localhost:8080/debug/pprof/mutex               # lock contention
```

Block and mutex need enabling first, in `main`:

```go
runtime.SetBlockProfileRate(1)   // every blocking event; fine while profiling
runtime.SetMutexProfileFraction(1)
```

Read them with `top -cum` first, then `list <FuncName>` on whatever is at
the top. `top` alone shows self time and hides a slow function that merely
calls other slow functions.

For a health-check service, the honest expectation is that **CPU looks
boring** — the program is waiting, not computing. Block and mutex are where
the answer lives, which is precisely why people who only take a CPU profile
conclude "nothing to fix" and stop.

## Hint 4 — stretch: prove the fix, then try to break it again

Once you have a before and an after at the same arrival rate, push past the
new knee. You will find a second bottleneck, somewhere else entirely — a
file-descriptor ceiling, ephemeral port exhaustion, the load generator's own
CPU.

That is the real lesson of the step: performance work is a sequence of
distinct bottlenecks, not one "slow" property. Write the second one up too,
even if you decide not to fix it. "I know what the next limit is and why I
stopped there" is a stronger thing to be able to say than a faster number.
