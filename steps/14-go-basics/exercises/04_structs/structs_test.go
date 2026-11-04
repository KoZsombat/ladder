package structs

import "testing"

func TestCounter(t *testing.T) {
	var c Counter
	c.Inc()
	c.Inc()
	c.Inc()
	if got := c.Value(); got != 3 {
		t.Errorf("after 3 Inc, Value = %d, want 3 — is Inc using a value receiver?", got)
	}
}

func TestRectArea(t *testing.T) {
	r := Rect{W: 3, H: 4}
	if got := r.Area(); got != 12 {
		t.Errorf("Area = %v, want 12", got)
	}
}

func TestRectScale(t *testing.T) {
	r := Rect{W: 3, H: 4}
	r.Scale(2)
	if r.W != 6 || r.H != 8 {
		t.Errorf("after Scale(2) = %v, want W=6 H=8", r)
	}
}

func TestRectString(t *testing.T) {
	r := Rect{W: 3, H: 4}
	if got := r.String(); got != "Rect(3x4)" {
		t.Errorf("String = %q, want \"Rect(3x4)\"", got)
	}
}
