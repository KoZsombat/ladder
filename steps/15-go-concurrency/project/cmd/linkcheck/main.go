package main

import (
	"context"
	"flag"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// TODO: wire up the CLI.
//
//	Flags: -n (concurrency, default 8) and -timeout (default 5s).
//	Arguments: the URLs.
//
//	Use signal.NotifyContext so Ctrl-C cancels the context and the whole
//	pool drains instead of being killed mid-request. Print a line per
//	result and a summary at the end, and exit non-zero if anything failed.
//
//	That graceful-shutdown shape is the same one step 19 needs, just with
//	fewer moving parts.
func main() {
	n := flag.Int("n", 8, "how many checks in flight")
	timeout := flag.Duration("timeout", 5*time.Second, "per-request timeout")
	flag.Parse()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	_, _, _ = n, timeout, ctx
	panic("TODO: main")
}
