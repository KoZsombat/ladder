# 06_errors

## Hint 1
Four things: an `Error()` method, one wrap with `%w`, one function that
returns a typed error, and one that inspects with `errors.Is`/`errors.As`.

## Hint 2
```go
func (e *ValidationError) Error() string { return e.Field + ": " + e.Msg }
```
`Find`'s miss branch: `return "", fmt.Errorf("find %q: %w", key, ErrNotFound)`
(you will need to import `"fmt"`).

`Describe` starts with `if err == nil { return "ok" }`.

## Hint 3
`Describe`'s middle:
```go
if errors.Is(err, ErrNotFound) {
    return "missing"
}
var ve *ValidationError
if errors.As(err, &ve) {
    return "invalid " + ve.Field
}
return "unknown"
```
Note the import name: this package is itself called `errors`, so inside it you
cannot also import `"errors"` under that name. The test file imports it as
`stderrors`. In your file, import it as `stderrors "errors"` too, or rename
the `ErrNotFound` construction to use that alias.

## Solution
See `solutions/06_errors/errors.go`.
