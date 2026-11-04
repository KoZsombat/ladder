# 01_variables

## Hint 1
Two of these are one-word fixes the compiler tells you about. Read the error
output before anything else — `rustc` prints the correction inline.

## Hint 2
- `sum_to`: `let mut total = 0;`
- `len_as_i32`: `s.len() as i32`
- `max_of`: `if a >= b { a } else { b }` with no semicolons on the branches
- `parse_and_double`: trim first, then `match`

## Hint 3
```rust
pub fn parse_and_double(s: &str) -> i32 {
    let s = s.trim();
    match s.parse::<i32>() {
        Ok(n) => n * 2,
        Err(_) => 0,
    }
}
```

## Solution
See `solutions/01_variables.rs`.
