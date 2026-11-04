# Step 16 — Durable storage

**Exercises:** 2 (~1 h) · **Project:** append-only key-value store (~4 h)
**Language:** Go

You know Postgres as a user. This is the engine underneath: a log you only
ever append to, an index in memory, and a replay on startup that has to
survive the process being killed mid-write.

The exercises isolate the two things that make it hard — binary record
framing and the difference between "written" and "on disk".

    go test ./exercises/...
