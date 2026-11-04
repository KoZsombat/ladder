package structs

import "fmt"

type Counter struct {
	n int
}

func (c *Counter) Inc()      { c.n++ }
func (c Counter) Value() int { return c.n }

type Rect struct {
	W, H float64
}

func (r Rect) Area() float64 { return r.W * r.H }

func (r *Rect) Scale(f float64) {
	r.W *= f
	r.H *= f
}

func (r Rect) String() string { return fmt.Sprintf("Rect(%gx%g)", r.W, r.H) }

var _ fmt.Stringer = Rect{}
