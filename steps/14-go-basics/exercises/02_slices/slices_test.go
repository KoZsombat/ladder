package slices

import (
	"reflect"
	"testing"
)

func TestEvens(t *testing.T) {
	in := []int{1, 2, 3, 4, 5, 6}
	want := []int{2, 4, 6}
	got := Evens(in)
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("Evens = %v, want %v", got, want)
	}
	if !reflect.DeepEqual(in, []int{1, 2, 3, 4, 5, 6}) {
		t.Errorf("Evens modified its input: %v", in)
	}
	if got := Evens(nil); len(got) != 0 {
		t.Errorf("Evens(nil) = %v, want empty", got)
	}
}

func TestSum(t *testing.T) {
	if got := Sum([]int{1, 2, 3}); got != 6 {
		t.Errorf("Sum = %d, want 6", got)
	}
	if got := Sum(nil); got != 0 {
		t.Errorf("Sum(nil) = %d, want 0", got)
	}
}

func TestReverse(t *testing.T) {
	in := []int{1, 2, 3}
	got := Reverse(in)
	if !reflect.DeepEqual(got, []int{3, 2, 1}) {
		t.Fatalf("Reverse = %v, want [3 2 1]", got)
	}
	if !reflect.DeepEqual(in, []int{1, 2, 3}) {
		t.Errorf("xs was modified: %v — you aliased the backing array instead of copying", in)
	}
}

func TestChunk(t *testing.T) {
	got := Chunk([]int{1, 2, 3, 4, 5}, 2)
	want := [][]int{{1, 2}, {3, 4}, {5}}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Chunk = %v, want %v", got, want)
	}
	if got := Chunk([]int{1}, 0); got != nil {
		t.Errorf("Chunk(size 0) = %v, want nil", got)
	}
}
