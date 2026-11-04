# 15 — Job queue with workers

**Builds on:** 13. **Language:** Go. **Time:** ~3 hours.
**Done when:** killing a worker mid-job re-runs that job, and nothing is lost
or silently run twice without you knowing.

The shape of Sidekiq, Celery and every SQS consumer — and the scheduler core
that project 17 needs.

At-least-once is the only delivery guarantee you can actually have without
distributed transactions. Exactly-once *delivery* is a marketing claim;
exactly-once *effect* is achievable and is called idempotency.

Run: `go test -race ./...`
