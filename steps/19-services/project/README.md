# 17 — Go pinger: HTTP health-check service

**Builds on:** 15, 16. **Language:** Go. **Time:** 6-8 hours.
**Done when:** it monitors 500 targets on schedule for an hour without
leaking goroutines, losing checks, or locking its database.

The first project that is a *system* rather than a program, and the first
whose failures are all about interaction rather than logic.

This scaffold has no third-party dependencies: `net/http` for the API
(Go 1.22+ patterns in `ServeMux`), and a tiny in-memory store you replace
with SQLite when you want to. Start it, make the tests pass, then swap the
store for a real database — that swap is itself the lesson about interfaces.

Run: `go test -race ./...`
