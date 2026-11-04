package interfaces

import (
	"math"
	"strings"
)

type Shape interface {
	Area() float64
	Name() string
}

type Circle struct{ R float64 }
type Square struct{ Side float64 }

func (c Circle) Area() float64 { return math.Pi * c.R * c.R }
func (c Circle) Name() string  { return "circle" }

func (s Square) Area() float64 { return s.Side * s.Side }
func (s Square) Name() string  { return "square" }

func TotalArea(shapes []Shape) float64 {
	total := 0.0
	for _, s := range shapes {
		total += s.Area()
	}
	return total
}

func Describe(shapes []Shape) string {
	names := make([]string, 0, len(shapes))
	for _, s := range shapes {
		names = append(names, s.Name())
	}
	return strings.Join(names, ", ")
}

func Largest(shapes []Shape) Shape {
	var best Shape
	for _, s := range shapes {
		if best == nil || s.Area() > best.Area() {
			best = s
		}
	}
	return best
}

var (
	_ Shape = Circle{}
	_ Shape = Square{}
)
