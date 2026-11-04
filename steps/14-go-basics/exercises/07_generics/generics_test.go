package generics

import (
	"sort"
	"strconv"
	"testing"
)

func TestMap(t *testing.T) {
	got := Map([]int{1, 2, 3}, func(i int) string { return strconv.Itoa(i * 10) })
	if len(got) != 3 || got[0] != "10" || got[2] != "30" {
		t.Errorf("Map = %v", got)
	}
}

func TestFilter(t *testing.T) {
	got := Filter([]int{1, 2, 3, 4}, func(i int) bool { return i%2 == 0 })
	if len(got) != 2 || got[0] != 2 || got[1] != 4 {
		t.Errorf("Filter = %v", got)
	}
}

func TestReduce(t *testing.T) {
	got := Reduce([]int{1, 2, 3}, "", func(acc string, i int) string {
		return acc + strconv.Itoa(i)
	})
	if got != "123" {
		t.Errorf("Reduce = %q", got)
	}
}

func TestSum(t *testing.T) {
	if got := Sum([]int{1, 2, 3}); got != 6 {
		t.Errorf("Sum ints = %v", got)
	}
	if got := Sum([]float64{1.5, 2.5}); got != 4 {
		t.Errorf("Sum floats = %v", got)
	}
	type Celsius float64
	if got := Sum([]Celsius{1, 2}); got != 3 {
		t.Errorf("Sum named type = %v — is your constraint using ~?", got)
	}
}

func TestKeys(t *testing.T) {
	got := Keys(map[string]int{"a": 1, "b": 2})
	sort.Strings(got)
	if len(got) != 2 || got[0] != "a" || got[1] != "b" {
		t.Errorf("Keys = %v", got)
	}
}
