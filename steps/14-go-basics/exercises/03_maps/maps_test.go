package maps

import "testing"

func TestWordCount(t *testing.T) {
	got := WordCount([]string{"a", "b", "a", "c", "a"})
	if got["a"] != 3 || got["b"] != 1 || got["c"] != 1 {
		t.Errorf("WordCount = %v", got)
	}
	if got := WordCount(nil); got == nil {
		t.Error("WordCount(nil) returned a nil map; return an empty map so callers can write to it")
	}
}

func TestMostCommon(t *testing.T) {
	// run repeatedly: map iteration order is randomised, so a tie-break bug
	// shows up intermittently
	for i := 0; i < 50; i++ {
		w, n := MostCommon(map[string]int{"pear": 2, "apple": 2, "fig": 1})
		if w != "apple" || n != 2 {
			t.Fatalf("MostCommon tie = (%q,%d), want (apple,2) — check your tie-break", w, n)
		}
	}
	if w, n := MostCommon(map[string]int{}); w != "" || n != 0 {
		t.Errorf("MostCommon(empty) = (%q,%d), want (\"\",0)", w, n)
	}
}

func TestLookup(t *testing.T) {
	m := map[string]int{"zero": 0}
	if v, ok := Lookup(m, "zero"); v != 0 || !ok {
		t.Errorf("Lookup stored-zero = (%d,%v), want (0,true)", v, ok)
	}
	if v, ok := Lookup(m, "missing"); v != 0 || ok {
		t.Errorf("Lookup missing = (%d,%v), want (0,false)", v, ok)
	}
}
