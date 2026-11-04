# 01_values

## Hint 1
All three are one-liners or close to it. The exercise is not about cleverness,
it is about Go having no implicit numeric conversion and no ternary.

## Hint 2
- `Celsius`: write the arithmetic directly on the parameter. Do not introduce
  an intermediate `:=` variable for the constants.
- `Clamp`: two `if` statements and a final `return v`.
- `Divide`: guard `b == 0` first and return the zero value plus `false`.

## Hint 3
`Celsius` is `return (f - 32) * 5 / 9`.
`Clamp` starts with `if v < lo { return lo }`.
`Divide` starts with `if b == 0 { return 0, false }`.

## Solution
See `solutions/01_values/values.go`.
