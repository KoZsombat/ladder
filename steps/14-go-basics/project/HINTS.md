# Project — Hints

## Tier 1
`New`, `Total` and `Unique` are one-liners. `AddText` is three lines.
`Top` is the only one with real content, and it is a sort.

## Tier 2
```go
func New() *Counter { return &Counter{counts: make(map[string]int)} }

func (c *Counter) AddText(s string) {
	for _, w := range strings.FieldsFunc(s, func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsDigit(r) && r != '\''
	}) {
		c.counts[strings.ToLower(w)]++
		c.total++
	}
}
```

## Tier 3
```go
func (c *Counter) Top(n int) []Count {
	out := make([]Count, 0, len(c.counts))
	for w, k := range c.counts {
		out = append(out, Count{Word: w, N: k})
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].N != out[j].N {
			return out[i].N > out[j].N
		}
		return out[i].Word < out[j].Word     // the tie-break that makes it deterministic
	})
	if n <= 0 || n > len(out) {
		return out
	}
	return out[:n]
}
```

## Tier 4 — the per-file helper
```go
func CountFiles(paths []string) (*Counter, error) {
	c := New()
	for _, p := range paths {
		if err := addFile(c, p); err != nil {
			return nil, err
		}
	}
	return c, nil
}

func addFile(c *Counter, path string) error {
	f, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("reading %s: %w", path, err)
	}
	defer f.Close()          // runs at the end of THIS function, not the loop
	if err := c.AddReader(f); err != nil {
		return fmt.Errorf("reading %s: %w", path, err)
	}
	return nil
}
```
That separate function is the whole reason the defer is correct. Put the
`defer f.Close()` in the loop body instead and a thousand files means a
thousand open descriptors until `CountFiles` returns.

## Tier 5 — stretch
Add `-min` to filter rare words, and `-sort=alpha`. Then make it read files
CONCURRENTLY with a worker pool — but only after step 15, and notice that
the shared `counts` map now needs a mutex or a per-worker map that you merge
at the end. That realisation is the bridge into the next step.
