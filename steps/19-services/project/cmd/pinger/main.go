package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// TODO: wire it together, and get the SHUTDOWN ORDER right. That order is
// what separates a service from a script:
//
//  1. signal.NotifyContext for SIGINT/SIGTERM
//  2. start the scheduler, the workers and the result writer
//  3. http.Server with the API routes; ListenAndServe in a goroutine
//  4. <-ctx.Done()
//  5. srv.Shutdown(timeoutCtx)   — stop accepting, drain in-flight requests
//  6. cancel the scheduler context
//  7. wg.Wait()                  — let the workers finish
//  8. close(results); wait for the writer to flush the LAST batch
//  9. store.Close()
//
// Do them out of order and you lose the final batch, or you cut off
// requests that were nearly done, or you close the database under a worker
// still writing to it.
func main() {
	log := slog.New(slog.NewTextHandler(os.Stdout, nil))
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	_ = ctx
	_ = log
	_ = http.Server{}
	_ = time.Second

	panic("TODO: wire up main")
}
