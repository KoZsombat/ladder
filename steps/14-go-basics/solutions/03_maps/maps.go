package maps

func WordCount(words []string) map[string]int {
	m := make(map[string]int)
	for _, w := range words {
		m[w]++
	}
	return m
}

func MostCommon(counts map[string]int) (string, int) {
	bestWord, bestN := "", 0
	for w, n := range counts {
		if n > bestN || (n == bestN && bestWord != "" && w < bestWord) {
			bestWord, bestN = w, n
		}
	}
	return bestWord, bestN
}

func Lookup(m map[string]int, key string) (int, bool) {
	v, ok := m[key]
	return v, ok
}
