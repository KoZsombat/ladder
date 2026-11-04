# Project — concurrent link checker

**Done when:** it checks 200 URLs with at most N in flight, respects a
timeout, survives a cancelled context, and leaks no goroutines.

This is the step-19 service with everything non-essential removed: a worker
pool, a shared HTTP client, per-request deadlines, graceful cancellation and
a result aggregator. Build it here at 150 lines and step 19 stops being
intimidating.

    go test -race ./...
    go run ./cmd/linkcheck -n 8 -timeout 5s https://example.com https://go.dev
