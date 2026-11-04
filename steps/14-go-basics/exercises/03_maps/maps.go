package maps

// A Go map returns the zero value for a missing key rather than undefined.
// `m["nope"]` on a map[string]int is 0, not an error and not nil. To tell
// "present and zero" from "absent" you use the comma-ok form:
//
//	v, ok := m[key]
//
// That `ok` is the same shape as the second return of Divide in exercise 01,
// and the same shape as a type assertion. Go reuses it everywhere.

// WordCount counts how many times each word appears in words.
//
// TODO: implement this.
//
//	Make the map with make(map[string]int) and increment m[w]. You do NOT
//	need to check whether the key exists first: a missing key reads as 0,
//	so m[w]++ works on the first sighting of a word.
//
//	Writing to a nil map panics, so the make() is not optional. Reading from
//	a nil map is fine, which is an asymmetry worth remembering.
func WordCount(words []string) map[string]int {
	return nil
}

// MostCommon returns the word with the highest count and that count.
// On a tie, return the alphabetically smallest word.
// For an empty map return ("", 0).
//
// TODO: implement this.
//
//	The trap: map iteration order in Go is deliberately RANDOMISED. Two runs
//	over the same map give different orders. So you cannot rely on "first one
//	wins" for ties — you must compare explicitly.
//
//	That randomisation is a feature: it stops people depending on an order
//	that was never guaranteed. Run the test a few times; a tie-broken-wrong
//	implementation fails intermittently, which is exactly the kind of bug the
//	language is trying to make loud.
func MostCommon(counts map[string]int) (string, int) {
	return "", 0
}

// Lookup reports whether key is present, distinguishing a stored zero from
// an absent key.
//
// TODO: implement this.
//
//	Use the comma-ok form and return both parts.
func Lookup(m map[string]int, key string) (int, bool) {
	return 0, false
}
