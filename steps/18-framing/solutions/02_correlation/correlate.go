package correlate

import (
	"context"
	"errors"
	"sync"
)

var ErrClosed = errors.New("bridge closed")

type Response struct {
	ID    int
	OK    bool
	Value string
	Error string
}

type Pending struct {
	mu     sync.Mutex
	waits  map[int]chan Response
	nextID int
	closed bool
}

func NewPending() *Pending {
	return &Pending{waits: map[int]chan Response{}}
}

func (p *Pending) Register() (int, chan Response, error) {
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.closed {
		return 0, nil, ErrClosed
	}
	p.nextID++
	ch := make(chan Response, 1)
	p.waits[p.nextID] = ch
	return p.nextID, ch, nil
}

func (p *Pending) Deliver(res Response) {
	p.mu.Lock()
	ch, ok := p.waits[res.ID]
	delete(p.waits, res.ID)
	p.mu.Unlock()
	if !ok {
		return
	}
	ch <- res
}

func (p *Pending) Wait(ctx context.Context, id int, ch chan Response) (Response, error) {
	defer p.Unregister(id)
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

func (p *Pending) Close() {
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.closed {
		return
	}
	p.closed = true
	for id, ch := range p.waits {
		close(ch)
		delete(p.waits, id)
	}
}

func (p *Pending) Unregister(id int) {
	p.mu.Lock()
	defer p.mu.Unlock()
	delete(p.waits, id)
}

func (p *Pending) Len() int {
	p.mu.Lock()
	defer p.mu.Unlock()
	return len(p.waits)
}
