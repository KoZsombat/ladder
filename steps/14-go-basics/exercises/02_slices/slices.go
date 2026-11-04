package slices

// A Go slice is a 3-word header: a pointer to a backing array, a length and a
// capacity. Two slices can share one array, which is where every slice bug
// comes from. Coming from TypeScript this is the single biggest adjustment:
// `arr.slice()` in JS always copies, `a[1:3]` in Go never does.

// Evens returns only the even numbers from xs, in order.
//
// TODO: implement this.
//
//	Build a new slice and append to it. Do NOT modify xs.
//
//	Pre-size it with make([]int, 0, len(xs)) so append does not have to grow
//	the backing array repeatedly. The 0 is the length and len(xs) is the
//	capacity — getting those two the wrong way round gives you a slice that
//	starts with len(xs) zeroes, which is the classic beginner bug here.
func Evens(xs []int) []int {
	return nil
}

// Sum returns the total of xs. An empty or nil slice sums to 0.
//
// TODO: implement this.
//
//	Use `for _, v := range xs`. Note that a nil slice is perfectly usable:
//	len(nil slice) is 0 and ranging over it does nothing, so you do not need
//	a nil check. That is why Go code so rarely tests for nil slices.
func Sum(xs []int) int {
	return 0
}

// Reverse returns a NEW slice with the elements of xs in reverse order.
// xs itself must not change.
//
// TODO: implement this.
//
//	The trap: `out := xs` does not copy anything, it makes a second header
//	pointing at the same array, so reversing "out" would also reverse xs.
//	You need make + copy, or append to a fresh slice.
//
//	Write the wrong version first, watch the test fail on "xs was modified",
//	then fix it. That failure is the exercise.
func Reverse(xs []int) []int {
	return nil
}

// Chunk splits xs into consecutive groups of at most size elements.
// Chunk([1,2,3,4,5], 2) is [[1,2],[3,4],[5]].
// If size <= 0, return nil.
//
// TODO: implement this.
//
//	Walk i from 0 to len(xs) in steps of size, and take xs[i:end] where end
//	is min(i+size, len(xs)) — Go 1.21+ has a builtin min().
//
//	Careful: xs[i:end] SHARES memory with xs. For this exercise that is fine
//	because nobody writes to the chunks, but make a note of it: returning
//	sub-slices of a caller's array is how libraries accidentally let callers
//	corrupt each other.
func Chunk(xs []int, size int) [][]int {
	return nil
}
