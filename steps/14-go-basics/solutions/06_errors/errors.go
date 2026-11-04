package errors

import (
	stderrors "errors"
	"fmt"
)

var ErrNotFound = stderrors.New("not found")

type ValidationError struct {
	Field string
	Msg   string
}

func (e *ValidationError) Error() string { return e.Field + ": " + e.Msg }

func Find(db map[string]string, key string) (string, error) {
	if v, ok := db[key]; ok {
		return v, nil
	}
	return "", fmt.Errorf("find %q: %w", key, ErrNotFound)
}

func ValidateAge(age int) error {
	if age < 0 {
		return &ValidationError{Field: "age", Msg: "must be positive"}
	}
	if age > 150 {
		return &ValidationError{Field: "age", Msg: "unrealistic"}
	}
	return nil
}

func Describe(err error) string {
	if err == nil {
		return "ok"
	}
	if stderrors.Is(err, ErrNotFound) {
		return "missing"
	}
	var ve *ValidationError
	if stderrors.As(err, &ve) {
		return "invalid " + ve.Field
	}
	return "unknown"
}
