package errors

import "errors"

// Errors in Go are ordinary values of an interface type with one method:
//
//	type error interface { Error() string }
//
// There are no exceptions for expected failures. The discipline that makes
// this pleasant rather than noisy is wrapping: every layer adds context with
// %w, and only the layer that can actually DECIDE something inspects the
// error. Handle an error exactly once — log it OR return it, never both.

// ErrNotFound is a sentinel error: a package-level value callers can compare
// against with errors.Is.
var ErrNotFound = errors.New("not found")

// ValidationError is a typed error, for when the caller needs the DETAILS
// and not just the identity.
type ValidationError struct {
	Field string
	Msg   string
}

// TODO: give *ValidationError an Error() string method so it satisfies error.
//
//	Return exactly:  Field + ": " + Msg      e.g. "age: must be positive"
//
//	Use a POINTER receiver. Then `&ValidationError{...}` is an error, and
//	errors.As(err, &target) works with target of type *ValidationError.

// Find looks up a key in db.
//
// TODO: implement this.
//
//	On a hit return the value and nil.
//	On a miss return "" and an error that WRAPS ErrNotFound, with context:
//
//	    fmt.Errorf("find %q: %w", key, ErrNotFound)
//
//	The %w verb is what makes errors.Is(err, ErrNotFound) return true further
//	up the stack. If you use %v instead, the message looks identical and
//	errors.Is silently returns false — which is a genuinely nasty bug and the
//	reason this exercise exists.
func Find(db map[string]string, key string) (string, error) {
	return "", nil
}

// ValidateAge returns a *ValidationError when age is out of range.
//
// TODO: implement this.
//
//	age < 0    -> &ValidationError{Field: "age", Msg: "must be positive"}
//	age > 150  -> &ValidationError{Field: "age", Msg: "unrealistic"}
//	otherwise  -> nil
//
//	Return the literal nil, NOT a nil *ValidationError variable. This is the
//	most notorious trap in Go: an interface holding a nil pointer is itself
//	NOT nil, so `if err != nil` fires even though "there is no error".
//	The test below checks for exactly that.
func ValidateAge(age int) error {
	return nil
}

// Describe classifies an error for a caller.
//
// TODO: implement this.
//
//	nil                          -> "ok"
//	wraps ErrNotFound            -> "missing"
//	is/wraps a *ValidationError  -> "invalid " + that error's Field
//	anything else                -> "unknown"
//
//	Use errors.Is for the sentinel (identity) and errors.As for the typed one
//	(you want the value out of it). That is the whole difference between the
//	two functions: Is asks "is this that error?", As asks "give me that error
//	as this type".
func Describe(err error) string {
	return ""
}
