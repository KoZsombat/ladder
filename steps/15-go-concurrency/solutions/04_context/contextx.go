package contextx

import (
	"context"
	"time"
)

func SlowDouble(ctx context.Context, v int, d time.Duration) (int, error) {
	select {
	case <-time.After(d):
		return v * 2, nil
	case <-ctx.Done():
		return 0, ctx.Err()
	}
}

func SumWithTimeout(ctx context.Context, budget time.Duration, fns []func(context.Context) int) (int, error) {
	ctx, cancel := context.WithTimeout(ctx, budget)
	defer cancel()

	total := 0
	for _, fn := range fns {
		if err := ctx.Err(); err != nil {
			return total, err
		}
		total += fn(ctx)
	}
	return total, nil
}

func Race(ctx context.Context, a, b func(context.Context) int) int {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	res := make(chan int, 2)
	go func() { res <- a(ctx) }()
	go func() { res <- b(ctx) }()
	return <-res
}
