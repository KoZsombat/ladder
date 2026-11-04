# Step 15 — Go concurrency

**Exercises:** 7 (~6 h) · **Project:** concurrent link checker (~2 h)
**Language:** Go

The part with no TypeScript analogue at all — Node is one event loop, and
every pattern here is genuinely new.

The seven exercises run goroutines and WaitGroups, channel direction and
closing, select with timeouts and non-blocking sends, context, mutexes, the
bounded worker pool, and io interfaces. The project then builds a tiny
version of the service you reach at step 19, so that one arrives familiar.

Run everything with `-race` from the first line of code:

    go test -race ./exercises/...
