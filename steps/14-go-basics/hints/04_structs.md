# 04_structs

## Hint 1
Two of these four methods mutate. A method that mutates needs a pointer
receiver, or it mutates a copy and the caller sees nothing.

## Hint 2
Change `func (c Counter) Inc()` to `func (c *Counter) Inc()`, then `c.n++`.
Same for `Scale`. `Area` and `String` stay value receivers.

You do not write `(&c).Inc()` at the call site — Go inserts the address-of
for you when the variable is addressable.

## Hint 3
```go
func (c *Counter) Inc()      { c.n++ }
func (c Counter) Value() int { return c.n }
func (r Rect) Area() float64 { return r.W * r.H }
func (r *Rect) Scale(f float64) { r.W *= f; r.H *= f }
func (r Rect) String() string { return fmt.Sprintf("Rect(%gx%g)", r.W, r.H) }
```

## Solution
See `solutions/04_structs/structs.go`.
