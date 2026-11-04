# 05_interfaces

## Hint 1
You need four methods (two per type) and three functions. Nothing anywhere
says "implements".

## Hint 2
```go
func (c Circle) Area() float64 { return math.Pi * c.R * c.R }
func (c Circle) Name() string  { return "circle" }
```
`Describe`: collect names into a `[]string` and `strings.Join(names, ", ")`.
`Largest`: track the best so far, start with `var best Shape` (which is nil).

## Hint 3
`Largest` in full:
```go
var best Shape
for _, s := range shapes {
    if best == nil || s.Area() > best.Area() {
        best = s
    }
}
return best
```
Remember to add `"math"` and keep `"strings"` in the import block. If you
dropped `strings.Builder`, delete the unused import — Go treats unused
imports as compile errors, not warnings.

## Solution
See `solutions/05_interfaces/interfaces.go`.
