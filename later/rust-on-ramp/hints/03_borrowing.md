# 03_borrowing

## Hint 1
`total` and `first_word` are one-liners. `double_all` needs `*x`.
`max_and_log` needs you to turn an `Option<&i32>` into an `Option<i32>`.

## Hint 2
- `total`: `v.iter().sum()`
- `double_all`: `for x in v.iter_mut() { *x *= 2; }`
- `first_word`: `s.split_whitespace().next().unwrap_or("")`

## Hint 3
`max_and_log`:
```rust
let m = v.iter().max().copied();   // Option<&i32> -> Option<i32>
if let Some(x) = m {
    log.push(x);
}
m
```
`.copied()` on an `Option<&T>` where `T: Copy` gives `Option<T>`. The same
method exists on iterators, and `.cloned()` is its non-Copy sibling.

## Solution
See `solutions/03_borrowing.rs`.
