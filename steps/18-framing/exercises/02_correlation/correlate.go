package correlate

import (
	"context"
	"errors"
	"sync"
)

// Framing gives you messages. To turn messages into a REQUEST/RESPONSE
// channel you need one more thing: an id on every request, and a table of
// who is waiting for which reply.
//
// That id is what lets more than one request be in flight at once. Without
// it you are limited to one outstanding call, which is why HTTP/1.1 needs
// a connection per concurrent request and HTTP/2 does not.

var ErrClosed = errors.New("bridge closed")

type Response struct {
	ID    int
	OK    bool
	Value string
	Error string
}

// Pending tracks the callers waiting for replies.
type Pending struct {
	mu     sync.Mutex
	waits  map[int]chan Response
	nextID int
	closed bool
}

func NewPending() *Pending {
	return &Pending{waits: map[int]chan Response{}}
}

// Register allocates an id and a channel to wait on.
//
// TODO: implement this.
//
//	THE CHANNEL MUST BE BUFFERED, capacity 1. With an unbuffered channel, a
//	reply whose caller has already given up (timeout, cancellation) blocks
//	the reader goroutine FOREVER, and every subsequent call hangs. That is
//	the most common deadlock in code of this shape.
//
//	Return ErrClosed if the bridge is already shut.
func (p *Pending) Register() (int, chan Response, error) {
	panic("TODO: Register")
}

// Deliver routes a reply to whoever is waiting for it.
//
// TODO: implement this.
//
//	Look the id up, remove it from the table, and send. An id nobody is
//	waiting for is NOT an error — the caller may have timed out and gone.
//	Drop it quietly and carry on; panicking or blocking here takes the
//	whole connection down over one stale reply.
func (p *Pending) Deliver(res Response) {
	panic("TODO: Deliver")
}

// Wait blocks for the reply, the context, or the bridge closing.
//
// TODO: implement this.
//
//	A select over three cases. Whatever happens, UNREGISTER the id on the
//	way out — otherwise a timed-out call leaks an entry in the map forever,
//	which is a slow leak that only shows up under load.
func (p *Pending) Wait(ctx context.Context, id int, ch chan Response) (Response, error) {
	panic("TODO: Wait")
}

// Close fails every waiter.
//
// TODO: implement this.
//
//	Mark it closed and deliver a failure to everyone still waiting, so that
//	a dead connection does not leave callers blocked until their context
//	expires. Make it safe to call twice.
func (p *Pending) Close() {
	panic("TODO: Close")
}

// Unregister drops an id. Safe for an id that is not there.
func (p *Pending) Unregister(id int) {
	p.mu.Lock()
	defer p.mu.Unlock()
	delete(p.waits, id)
}

// Len is how many callers are waiting.
func (p *Pending) Len() int {
	p.mu.Lock()
	defer p.mu.Unlock()
	return len(p.waits)
}
