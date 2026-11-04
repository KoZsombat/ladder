package wordfreq

// CountFiles counts every named file into one Counter.
//
// TODO: implement this.
//
//	For each path: open it, AddReader it, close it. Use defer for the
//	close, inside a small helper function — a `defer f.Close()` in the loop
//	body does not run until the whole function returns, so a thousand files
//	means a thousand open descriptors. That is a classic Go bug and the
//	reason this is its own function.
//
//	WRAP the error with the filename:
//
//	    fmt.Errorf("reading %s: %w", path, err)
//
//	With %w, errors.Is(err, os.ErrNotExist) still works up the stack. With
//	%v the message looks identical and errors.Is silently returns false —
//	which the test below checks for specifically.
//
//	Keep going after a failure or stop at the first one? Decide, write it
//	in a comment, and make the test agree. (The test expects: stop and
//	return the error.)
func CountFiles(paths []string) (*Counter, error) {
	panic("TODO: CountFiles")
}
