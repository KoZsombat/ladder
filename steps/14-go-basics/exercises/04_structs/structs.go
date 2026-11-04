package structs

import "fmt"

// Go has no classes. It has structs with methods attached to them, and the
// receiver can be a value or a pointer. That choice is the whole exercise.
//
//	func (c Counter) Get() int    // VALUE receiver: gets a COPY
//	func (c *Counter) Inc()       // POINTER receiver: can mutate the original
//
// If a method with a value receiver assigns to a field, it assigns to the
// copy and the change is lost. This compiles happily and does nothing, which
// is why it catches everyone once.

type Counter struct {
	n int
}

// Inc increases the counter by one.
//
// TODO: implement this, and pick the right receiver.
//
//	The signature below uses a VALUE receiver, which is wrong for a mutating
//	method. Write the body first with the value receiver, run the test, watch
//	it fail with "got 0, want 3", then change the receiver to *Counter.
//
//	Living through that failure once is worth more than being told.
func (c Counter) Inc() {
	// TODO
}

// Value returns the current count.
//
// TODO: implement this. A value receiver is correct here: it only reads.
//
//	Go convention: if ANY method of a type needs a pointer receiver, give
//	them all pointer receivers, so the method set stays consistent.
func (c Counter) Value() int {
	return 0
}

type Rect struct {
	W, H float64
}

// Area returns the rectangle's area.
//
// TODO: implement this. Read-only, so a value receiver is right.
func (r Rect) Area() float64 {
	return 0
}

// Scale multiplies both sides by f, modifying the rectangle.
//
// TODO: implement this, with the receiver you now know you need.
func (r *Rect) Scale(f float64) {
	// TODO
}

// String makes Rect satisfy fmt.Stringer so it prints nicely.
//
// TODO: implement this. Return exactly: Rect(3x4) for W=3, H=4.
//
//	Use fmt.Sprintf with %g, which prints a float without trailing zeroes.
//	You are not declaring anywhere that Rect implements fmt.Stringer —
//	in Go, having the method IS implementing the interface. That is the
//	next exercise.
func (r Rect) String() string {
	return ""
}

var _ fmt.Stringer = Rect{}
