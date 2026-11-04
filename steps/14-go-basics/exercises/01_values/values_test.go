package values

import "testing"

func TestCelsius(t *testing.T) {
	cases := []struct {
		f, want float64
	}{
		{32, 0},
		{212, 100},
		{98.6, 37},
	}
	for _, c := range cases {
		got := Celsius(c.f)
		if diff := got - c.want; diff > 0.001 || diff < -0.001 {
			t.Errorf("Celsius(%v) = %v, want %v", c.f, got, c.want)
		}
	}
}

func TestClamp(t *testing.T) {
	cases := []struct{ v, lo, hi, want int }{
		{5, 0, 10, 5},
		{-3, 0, 10, 0},
		{99, 0, 10, 10},
		{0, 0, 10, 0},
		{10, 0, 10, 10},
	}
	for _, c := range cases {
		if got := Clamp(c.v, c.lo, c.hi); got != c.want {
			t.Errorf("Clamp(%d,%d,%d) = %d, want %d", c.v, c.lo, c.hi, got, c.want)
		}
	}
}

func TestDivide(t *testing.T) {
	if got, ok := Divide(10, 3); got != 3 || !ok {
		t.Errorf("Divide(10,3) = (%d,%v), want (3,true)", got, ok)
	}
	if got, ok := Divide(7, 0); got != 0 || ok {
		t.Errorf("Divide(7,0) = (%d,%v), want (0,false)", got, ok)
	}
}
