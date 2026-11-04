package generics

// Go got generics in 1.18. They are deliberately less powerful than
// TypeScript's: no conditional types, no mapped types, no inference from
// return position. What they do give you is Map/Filter/Reduce without
// interface{} and without reflection.
//
// The more useful lesson is when NOT to reach for them. If a function is
// only ever called with one type, a concrete signature is clearer. Generics
// earn their place in containers and small algorithms, not everywhere.

// Map applies f to each element and returns a new slice.
//
// TODO: implement this.
//
//	The signature is already written for you. `[T, U any]` declares two type
//	parameters; `any` is an alias for interface{} and means no constraint.
func Map[T, U any](xs []T, f func(T) U) []U {
	return nil
}

// Filter keeps the elements f returns true for.
//
// TODO: implement this.
func Filter[T any](xs []T, f func(T) bool) []T {
	return nil
}

// Reduce folds xs into a single value, starting from init.
//
// TODO: implement this.
func Reduce[T, U any](xs []T, init U, f func(U, T) U) U {
	var zero U
	return zero
}

// Number is a type CONSTRAINT: a set of types this parameter may be.
// The ~ means "any type whose underlying type is this", so a
// `type Celsius float64` is allowed too.
type Number interface {
	~int | ~int64 | ~float64
}

// Sum adds up any slice of numbers.
//
// TODO: implement this.
//
//	Because of the constraint, `+` is legal on T here. Without the
//	constraint it would not compile — the compiler must know the operator
//	exists for every type the parameter could be.
func Sum[T Number](xs []T) T {
	var zero T
	return zero
}

// Keys returns a map's keys. Order is unspecified.
//
// TODO: implement this.
//
//	`comparable` is the built-in constraint for types usable as map keys.
func Keys[K comparable, V any](m map[K]V) []K {
	return nil
}
