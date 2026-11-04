# Step 19 — Services

**Exercises:** 2 (~50 min) · **Project:** the HTTP health-check service (6-8 h)
**Language:** Go

The first thing you build here that is a *system* rather than a program,
and the first whose failures are all about interaction rather than logic.

Half of it you can already write — it is a REST service with a database,
which is what your nutrition app is. The new half is the worker pool feeding
it and the shutdown that does not lose data. The exercises are that new half.

    go test -race ./exercises/...
