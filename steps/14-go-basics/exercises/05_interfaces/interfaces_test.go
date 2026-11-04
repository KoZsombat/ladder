package interfaces

import (
	"math"
	"testing"
)

func TestAreas(t *testing.T) {
	if got := (Circle{R: 2}).Area(); math.Abs(got-12.566) > 0.01 {
		t.Errorf("Circle{2}.Area = %v, want ~12.566", got)
	}
	if got := (Square{Side: 3}).Area(); got != 9 {
		t.Errorf("Square{3}.Area = %v, want 9", got)
	}
}

func TestTotalArea(t *testing.T) {
	got := TotalArea([]Shape{Square{Side: 2}, Square{Side: 3}})
	if got != 13 {
		t.Errorf("TotalArea = %v, want 13", got)
	}
	if got := TotalArea(nil); got != 0 {
		t.Errorf("TotalArea(nil) = %v, want 0", got)
	}
}

func TestDescribe(t *testing.T) {
	got := Describe([]Shape{Circle{R: 1}, Square{Side: 1}, Circle{R: 2}})
	if got != "circle, square, circle" {
		t.Errorf("Describe = %q", got)
	}
	if got := Describe(nil); got != "" {
		t.Errorf("Describe(nil) = %q, want empty", got)
	}
}

func TestLargest(t *testing.T) {
	got := Largest([]Shape{Square{Side: 2}, Circle{R: 5}, Square{Side: 3}})
	if got == nil || got.Name() != "circle" {
		t.Errorf("Largest = %v, want the circle", got)
	}
	if got := Largest(nil); got != nil {
		t.Errorf("Largest(nil) = %v, want nil", got)
	}
}
