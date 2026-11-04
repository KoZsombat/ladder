package wordfreq

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestAddText(t *testing.T) {
	c := New()
	c.AddText("the quick brown fox the THE")
	if got := c.Total(); got != 6 {
		t.Errorf("Total = %d, want 6", got)
	}
	if got := c.Unique(); got != 4 {
		t.Errorf("Unique = %d, want 4", got)
	}
	top := c.Top(1)
	if len(top) != 1 || top[0].Word != "the" || top[0].N != 3 {
		t.Errorf("Top(1) = %v, want [{the 3}]", top)
	}
}

func TestWordBoundaries(t *testing.T) {
	c := New()
	c.AddText("don't well-known end. Start")
	words := map[string]int{}
	for _, x := range c.Top(0) {
		words[x.Word] = x.N
	}
	for _, want := range []string{"don't", "well", "known", "end", "start"} {
		if words[want] == 0 {
			t.Errorf("missing word %q (got %v)", want, words)
		}
	}
}

func TestTiesAreBrokenAlphabetically(t *testing.T) {
	// run it repeatedly: Go randomises map iteration order on purpose
	for i := 0; i < 50; i++ {
		c := New()
		c.AddText("pear apple fig pear apple")
		top := c.Top(2)
		if len(top) != 2 || top[0].Word != "apple" || top[1].Word != "pear" {
			t.Fatalf("Top(2) = %v, want apple then pear — check your tie-break", top)
		}
	}
}

func TestTopBounds(t *testing.T) {
	c := New()
	c.AddText("a b c")
	if got := len(c.Top(0)); got != 3 {
		t.Errorf("Top(0) returned %d, want everything", got)
	}
	if got := len(c.Top(99)); got != 3 {
		t.Errorf("Top(99) returned %d, want everything", got)
	}
	if got := len(c.Top(2)); got != 2 {
		t.Errorf("Top(2) returned %d", got)
	}
}

func TestEmpty(t *testing.T) {
	c := New()
	if c.Total() != 0 || c.Unique() != 0 || len(c.Top(5)) != 0 {
		t.Error("a fresh counter should be empty and not panic")
	}
	c.AddText("")
	if c.Total() != 0 {
		t.Error("empty text added words")
	}
}

func TestAddReader(t *testing.T) {
	c := New()
	if err := c.AddReader(strings.NewReader("one two two")); err != nil {
		t.Fatal(err)
	}
	if c.Total() != 3 {
		t.Errorf("Total = %d, want 3", c.Total())
	}
}

func TestCountFiles(t *testing.T) {
	dir := t.TempDir()
	a := filepath.Join(dir, "a.txt")
	b := filepath.Join(dir, "b.txt")
	os.WriteFile(a, []byte("alpha beta"), 0o644)
	os.WriteFile(b, []byte("beta gamma"), 0o644)

	c, err := CountFiles([]string{a, b})
	if err != nil {
		t.Fatal(err)
	}
	if c.Total() != 4 {
		t.Errorf("Total = %d, want 4", c.Total())
	}
	top := c.Top(1)
	if top[0].Word != "beta" || top[0].N != 2 {
		t.Errorf("Top(1) = %v, want [{beta 2}]", top)
	}
}

func TestMissingFileWrapsTheError(t *testing.T) {
	_, err := CountFiles([]string{"/definitely/not/here.txt"})
	if err == nil {
		t.Fatal("want an error")
	}
	if !errors.Is(err, os.ErrNotExist) {
		t.Errorf("errors.Is(err, os.ErrNotExist) is false — did you use %%v instead of %%w?")
	}
	if !strings.Contains(err.Error(), "here.txt") {
		t.Errorf("the error should name the file: %v", err)
	}
}
