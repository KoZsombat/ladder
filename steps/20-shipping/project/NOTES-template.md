# Bottleneck investigation

## Baseline — keep this file
workload:    ____ targets / ____ s interval + ____ API req/s
throughput:  ____ checks/s
latency:     check  p50 ___  p95 ___  p99 ___
             API    p50 ___  p95 ___  p99 ___
queue depth: avg ___  max ___   (does it return to zero?)
goroutines:  ___   RSS ___ MB   CPU ___ %

## The knee
The arrival rate where latency climbs but throughput stops: ____

## Hypothesis — write this BEFORE looking at the code
____________________________________________

## What the profiles showed
CPU:    ____
heap:   ____
block:  ____
mutex:  ____

## The one change
____________________________________________

## After — identical load
throughput: ____ (___ %)   p99: ____ (___ %)

## What I would do next
____________________________________________
