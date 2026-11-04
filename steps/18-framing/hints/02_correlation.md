# 02_correlation

## Hint 1
```go
func (p *Pending) Register() (int, chan Response, error) {
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.closed {
		return 0, nil, ErrClosed
	}
	p.nextID++
	ch := make(chan Response, 1)      // capacity 1 — see the test
	p.waits[p.nextID] = ch
	return p.nextID, ch, nil
}
```

## Hint 2
```go
func (p *Pending) Deliver(res Response) {
	p.mu.Lock()
	ch, ok := p.waits[res.ID]
	delete(p.waits, res.ID)
	p.mu.Unlock()
	if !ok {
		return                        // nobody is waiting; that is fine
	}
	ch <- res                         // never blocks: the buffer is free
}
```
Release the lock BEFORE sending. Sending while holding it is how you turn a
slow consumer into a frozen bridge.

## Hint 3
```go
func (p *Pending) Wait(ctx context.Context, id int, ch chan Response) (Response, error) {
	defer p.Unregister(id)            // on every path
	select {
	case res, ok := <-ch:
		if !ok {
			return Response{}, ErrClosed
		}
		return res, nil
	case <-ctx.Done():
		return Response{}, ctx.Err()
	}
}
```

## Hint 4
```go
func (p *Pending) Close() {
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.closed {
		return
	}
	p.closed = true
	for id, ch := range p.waits {
		close(ch)                     // every waiter wakes with ErrClosed
		delete(p.waits, id)
	}
}
```
Closing the channel rather than sending a failure value means `Wait`'s
`ok == false` branch fires, which is why that branch exists.
