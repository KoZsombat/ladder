package bridge

import (
	"context"
	"net"
	"os/exec"
	"sync"
)

// Request carries an ID so replies can be matched to requests. That ID is
// what turns a pipe into an RPC channel, and what lets more than one
// request be in flight at a time.
type Request struct {
	ID   int    `json:"id"`
	Func string `json:"func"`
	Args []any  `json:"args"`
}

type Response struct {
	ID    int    `json:"id"`
	OK    bool   `json:"ok"`
	Value any    `json:"value,omitempty"`
	Error string `json:"error,omitempty"`
}

type Bridge struct {
	conn    net.Conn
	cmd     *exec.Cmd
	mu      sync.Mutex
	nextID  int
	pending map[int]chan Response
	closed  chan struct{}
}

// Spawn starts the child and connects to its socket.
//
// TODO: implement this.
//
//  1. exec.CommandContext the python child, passing the socket path in the
//     environment so two runs cannot collide.
//  2. Start it.
//  3. RETRY the Dial until the socket exists or a deadline passes. Do not
//     dial once and give up — the child has not necessarily bound yet, and
//     that race is the second most common bug in this project.
//  4. Start a goroutine running ReadLoop over the connection, decoding each
//     line into a Response and delivering it to the waiting channel in
//     `pending`.
//  5. Make sure the child is killed on EVERY exit path — normal return,
//     error, panic, context cancellation, Ctrl-C. Orphaned children holding
//     socket files are the classic failure of this design.
func Spawn(ctx context.Context, sockPath string) (*Bridge, error) {
	panic("TODO: Spawn")
}

// Call sends one request and waits for its reply.
//
// TODO: implement this.
//
//	Allocate an ID, register a channel in `pending`, marshal the request
//	with a trailing '\n', write it, then wait on the channel OR on
//	ctx.Done() OR on b.closed.
//
//	Waiting without a timeout means a dead child hangs you forever.
func (b *Bridge) Call(ctx context.Context, fn string, args ...any) (any, error) {
	panic("TODO: Call")
}

// Close shuts the connection and the child down.
//
// TODO: implement this. It must be safe to call twice.
func (b *Bridge) Close() error {
	panic("TODO: Close")
}
