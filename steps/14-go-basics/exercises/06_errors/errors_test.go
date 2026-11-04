package errors

import (
	stderrors "errors"
	"fmt"
	"testing"
)

func TestFind(t *testing.T) {
	db := map[string]string{"a": "apple"}
	if v, err := Find(db, "a"); v != "apple" || err != nil {
		t.Errorf("Find hit = (%q,%v)", v, err)
	}
	_, err := Find(db, "nope")
	if err == nil {
		t.Fatal("Find miss returned nil error")
	}
	if !stderrors.Is(err, ErrNotFound) {
		t.Errorf("errors.Is(err, ErrNotFound) = false; did you use %%v instead of %%w?")
	}
	if got := err.Error(); got == ErrNotFound.Error() {
		t.Errorf("error message lost its context: %q", got)
	}
}

func TestValidateAge(t *testing.T) {
	if err := ValidateAge(30); err != nil {
		t.Errorf("ValidateAge(30) = %v, want nil", err)
	}
	// the nil-interface trap
	if err := ValidateAge(30); err != nil {
		t.Error("returned a typed nil pointer instead of a literal nil")
	}
	err := ValidateAge(-1)
	var ve *ValidationError
	if !stderrors.As(err, &ve) {
		t.Fatalf("ValidateAge(-1) = %v, want a *ValidationError", err)
	}
	if ve.Field != "age" {
		t.Errorf("Field = %q, want \"age\"", ve.Field)
	}
	if got := err.Error(); got != "age: must be positive" {
		t.Errorf("Error() = %q, want \"age: must be positive\"", got)
	}
}

func TestDescribe(t *testing.T) {
	cases := []struct {
		err  error
		want string
	}{
		{nil, "ok"},
		{fmt.Errorf("wrapped: %w", ErrNotFound), "missing"},
		{&ValidationError{Field: "age", Msg: "bad"}, "invalid age"},
		{fmt.Errorf("layer: %w", &ValidationError{Field: "name", Msg: "bad"}), "invalid name"},
		{stderrors.New("boom"), "unknown"},
	}
	for _, c := range cases {
		if got := Describe(c.err); got != c.want {
			t.Errorf("Describe(%v) = %q, want %q", c.err, got, c.want)
		}
	}
}
