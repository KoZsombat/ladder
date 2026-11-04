# Project — ship the service

Copy your step-19 service in here first.

## Checklist

- [ ] **Multi-stage Dockerfile.** Build stage with the toolchain, final
      stage `distroless/static` or `scratch`. Non-root user. Database on a
      volume. **Copy in the CA certificates** — you make outbound HTTPS
      calls, and without them every single check fails with an x509 error
      that you will not understand for an hour.
- [ ] **CI, ordered by how fast each gate fails.** `gofmt -l`, `go vet`,
      `staticcheck`, then **`go test -race`** — the highest-value line in
      the file. Expect it to find something in your scheduler or batcher,
      and fix that before going further; the rest of this step is
      meaningless on a racy binary.
- [ ] **Metrics.** Rate, errors, duration histograms with buckets that suit
      an HTTP checker (the defaults do not), plus queue depth. **Never**
      label a metric with the target URL: that is one time series per
      target, and an outage at fifty thousand of them.
- [ ] **A baseline measurement, saved to a file.** Without it the "after"
      number means nothing.
- [ ] **Load with a CONSTANT ARRIVAL RATE** — k6's `constant-arrival-rate`
      or `vegeta attack -rate`. Not N looping virtual users: a closed model
      slows down when your service does, so the queue never builds and you
      never see the problem.
- [ ] **All four profiles at the knee.** CPU, heap, and then **block and
      mutex** — the two people forget, and usually the two with the answer
      for a service like this.
- [ ] **Change ONE thing.** Re-run the identical load. Compare.
- [ ] **Write it up.** Symptom, measurement, hypothesis, change, before and
      after.

## Where the bottleneck usually is, in rough order

1. **Database write contention.** Visible as a mutex/block profile dominated
   by the store, rising queue depth, lock errors. Fixes: WAL mode, batch
   inserts in one transaction, a single writer goroutine, one writer
   connection, reused prepared statements.
2. **Connection churn.** High CPU in TLS handshake and crypto functions.
   Raise `MaxIdleConnsPerHost`, drain bodies, reuse one client.
3. **Allocation pressure.** GC taking a double-digit share of CPU.
   Pre-size slices, pool the drain buffer, keep `fmt.Sprintf` out of the
   hot path.
4. **A lock that did not need to exist.** The mutex profile points straight
   at it.
5. **The load generator itself.** Check it is not saturating its own CPU or
   file descriptors before you believe its numbers.
6. **File descriptor and ephemeral port limits.** `ulimit -n`, sockets in
   `TIME_WAIT`. This looks like a mysterious error wall at one specific rate.
