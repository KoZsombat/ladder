# 02_ownership

## Hint 1
Three signature changes and one small function body. Nothing here needs
`.clone()`.

## Hint 2
- `append_world(mut s: String) -> String`
- `string_len(s: &str) -> usize`
- `count_after_push(v: &mut Vec<i32>, x: i32) -> usize`

## Hint 3
```rust
pub fn ends(v: &[i32]) -> Option<(i32, i32)> {
    match (v.first(), v.last()) {
        (Some(a), Some(b)) => Some((*a, *b)),
        _ => None,
    }
}
```

## Solution
See `solutions/02_ownership.rs`.
