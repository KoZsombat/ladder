# Step 17 — Queues and retries

**Exercises:** 2 (~50 min) · **Project:** job queue with workers (~3 h)
**Language:** Go

At-least-once is the only delivery guarantee you can actually have without
distributed transactions. Exactly-once *delivery* is a marketing claim;
exactly-once *effect* is achievable and is called idempotency.

The exercises isolate the two mechanisms that make a queue survive a dead
worker: an atomic claim, and backoff with jitter.

    go test -race ./exercises/...
