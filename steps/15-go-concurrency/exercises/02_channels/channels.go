package channels

// A channel is a typed pipe with a built-in handshake. An UNBUFFERED channel
// blocks the sender until a receiver takes the value — that rendezvous is a
// synchronisation point, not just data transfer. A buffered channel of size n
// lets n values sit in flight before the sender blocks.
//
// Two rules that prevent most channel bugs:
//   1. The SENDER closes, never the receiver. Closing a channel someone else
//      still sends on panics.
//   2. `for v := range ch` ends when the channel is closed. If nobody closes
//      it, the loop blocks forever — that is a deadlock, and Go will tell you
//      so by name.

// Generate sends 1..n on the returned channel and closes it.
//
// TODO: implement this.
//
//	Make the channel, start ONE goroutine that sends and then closes, and
//	return the channel immediately. The signature returns `<-chan int`, a
//	receive-only channel: that is how you tell callers "you may read, you
//	may not send or close". Use direction in signatures; it is free
//	documentation that the compiler enforces.
//
//	The close belongs in a `defer close(ch)` inside the goroutine.
func Generate(n int) <-chan int {
	return nil
}

// Square reads from in and sends each value squared on the returned channel,
// closing it when in is exhausted.
//
// TODO: implement this.
//
//	Same shape. `for v := range in` finishes by itself when the upstream
//	closes, which is why rule 1 matters: a pipeline stage that forgets to
//	close leaves every downstream stage hanging.
//
//	Generate -> Square -> Collect is a pipeline, and this is the whole
//	pattern behind the market-data stages later on the ladder.
func Square(in <-chan int) <-chan int {
	return nil
}

// Collect drains ch into a slice.
//
// TODO: implement this. One range loop and an append.
func Collect(ch <-chan int) []int {
	return nil
}

// Merge fans several channels into one, closing the result when all inputs
// are done.
//
// TODO: implement this.
//
//	One goroutine per input channel, all sending into the same out channel,
//	plus a WaitGroup. The close must happen AFTER all senders are finished,
//	which means a separate goroutine:
//
//	    go func() { wg.Wait(); close(out) }()
//
//	You cannot call wg.Wait() on the main path before returning out, because
//	nobody is draining out yet and the senders would block forever. Try it
//	and read the deadlock message — it is one of Go's genuinely good errors.
func Merge(chans ...<-chan int) <-chan int {
	return nil
}
