package interfaces

import "strings"

// Go interfaces are satisfied IMPLICITLY. There is no `implements` keyword.
// If your type has the methods, it is the interface, even if you have never
// heard of that interface.
//
// The consequence worth internalising, coming from TypeScript: you define the
// interface where you CONSUME it, not where you implement it. A package that
// needs to read bytes declares its own one-method interface; it does not ask
// you to import a base class. That is why idiomatic Go interfaces are one or
// two methods, and why "accept interfaces, return structs" is the rule.

// Shape is the interface this package consumes.
type Shape interface {
	Area() float64
	Name() string
}

type Circle struct{ R float64 }
type Square struct{ Side float64 }

// TODO: give Circle and Square the two methods that make them satisfy Shape.
//
//	Circle.Area is math.Pi * R * R; Circle.Name returns "circle".
//	Square.Area is Side * Side;     Square.Name returns "square".
//
//	Note that you will NOT write "implements Shape" anywhere. The compiler
//	checks it at the point where you pass a Circle to something wanting a
//	Shape. The `var _ Shape = Circle{}` line at the bottom of this file is
//	the idiom for asking the compiler to check it right here instead — a
//	compile-time assertion that costs nothing at runtime.

// TotalArea sums the areas of all the shapes.
//
// TODO: implement this.
//
//	A range loop and a call to s.Area(). The dynamic dispatch is the point:
//	TotalArea has no idea which concrete types it is holding.
func TotalArea(shapes []Shape) float64 {
	return 0
}

// Describe returns a comma-separated list like "circle, square, circle".
//
// TODO: implement this.
//
//	Build it with strings.Builder and strings.Join, not by += on a string:
//	Go strings are immutable, so += in a loop allocates a new string every
//	time. For three shapes it does not matter; the habit does.
func Describe(shapes []Shape) string {
	var sb strings.Builder
	_ = sb
	return ""
}

// Largest returns the shape with the biggest area, or nil for an empty slice.
//
// TODO: implement this.
//
//	Returning nil for the empty case is why the return type is the interface
//	and not a concrete type. Watch out for the classic Go trap in the NEXT
//	exercise: an interface holding a nil pointer is NOT equal to nil.
func Largest(shapes []Shape) Shape {
	return nil
}

var (
	_ Shape = Circle{}
	_ Shape = Square{}
)
