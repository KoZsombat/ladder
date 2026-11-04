package values

// Go is statically typed with no implicit conversions between numeric types.
// An int and an int64 are different types, and `int + int64` does not compile.
// This is the same rule you met in OCaml with int vs float, and the same rule
// TypeScript does NOT have.

// Celsius converts a temperature given in Fahrenheit to Celsius.
//
// TODO: implement this.
//
//	The formula is (f - 32) * 5 / 9.
//
//	The catch: the parameter is a float64 and the return is a float64, but
//	32, 5 and 9 are untyped integer constants. Go will happily use an untyped
//	constant as a float64, so `(f - 32) * 5 / 9` compiles. But if you first
//	store 5 in a variable with `x := 5`, x becomes an int and `f * x` stops
//	compiling. Try both ways and read the error — that error message is the
//	whole point of this exercise.
func Celsius(f float64) float64 {
	return 0
}

// Clamp returns v limited to the range [lo, hi].
//
// TODO: implement this.
//
//	If v is below lo return lo, if it is above hi return hi, otherwise v.
//	Go has no ternary operator, so this is an if/else — that absence is
//	deliberate in the language design and you will stop missing it.
func Clamp(v, lo, hi int) int {
	return 0
}

// Divide returns the quotient of a and b, and whether the division was legal.
//
// TODO: implement this.
//
//	Return (a/b, true) normally, and (0, false) when b is zero.
//
//	The second return value is the shape Go uses everywhere instead of
//	exceptions or null: a value plus a flag, or a value plus an error.
//	You will see `v, ok := m[key]` and `v, err := f()` constantly.
func Divide(a, b int) (int, bool) {
	return 0, false
}
