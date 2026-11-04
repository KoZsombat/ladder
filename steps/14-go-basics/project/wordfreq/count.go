package wordfreq

import (
	"io"
)

// Count is one word and how often it appeared.
type Count struct {
	Word string
	N    int
}

// Counter accumulates word counts across several sources.
type Counter struct {
	counts map[string]int
	total  int
}

// New returns a ready-to-use Counter.
//
// TODO: implement this.
//
//	Writing to a nil map PANICS, so the make() is not optional. (Reading
//	from one is fine, which is an asymmetry worth remembering.)
func New() *Counter {
	panic("TODO: New")
}

// AddText counts the words in s.
//
// TODO: implement this.
//
//	A word is a maximal run of letters, apostrophes and digits, compared
//	case-insensitively: "The" and "the" are the same word, "don't" is one
//	word, and "well-known" is two.
//
//	strings.FieldsFunc with a predicate does the splitting in one call.
//	Lowercase with strings.ToLower.
//
//	You do NOT need to check whether a key exists before incrementing:
//	a missing key reads as 0, so m[w]++ works on the first sighting.
func (c *Counter) AddText(s string) {
	panic("TODO: AddText")
}

// AddReader counts the words from any io.Reader.
//
// TODO: implement this.
//
//	Use bufio.Scanner with ScanWords, or read it all and call AddText.
//	Return sc.Err() — ignoring it means a line longer than 64KB silently
//	truncates your counts, which is a real bug people ship.
//
//	Taking io.Reader rather than a filename is the Go habit this project
//	exists to build: the function becomes testable with strings.NewReader
//	and does not care whether the bytes came from a file, a socket or a
//	test fixture.
func (c *Counter) AddReader(r io.Reader) error {
	panic("TODO: AddReader")
}

// Top returns the n commonest words, most frequent first.
//
// TODO: implement this.
//
//	Ties broken ALPHABETICALLY. That is not decoration: Go randomises map
//	iteration order deliberately, so without an explicit tie-break your
//	output changes between runs and your test fails one time in five.
//	Use sort.Slice.
//
//	n <= 0, or n larger than the vocabulary, should return everything.
func (c *Counter) Top(n int) []Count {
	panic("TODO: Top")
}

// Total is how many words were counted in all.
//
// TODO: implement this. A value receiver is right here: it only reads.
func (c *Counter) Total() int {
	panic("TODO: Total")
}

// Unique is how many DISTINCT words were counted.
//
// TODO: implement this.
func (c *Counter) Unique() int {
	panic("TODO: Unique")
}
