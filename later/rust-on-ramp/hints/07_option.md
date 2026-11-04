# 07_option

## Hint 1
None of these need `.unwrap()` or a full `match` except the last one.
The combinators are the exercise.

## Hint 2
```rust
pub fn at(v: &[i32], i: usize) -> Option<i32> { v.get(i).copied() }
pub fn name_len(name: Option<&str>) -> usize { name.map_or(0, |s| s.len()) }
```

## Hint 3
```rust
pub fn first_even_doubled(v: &[i32]) -> Option<i32> {
    v.iter().find(|x| *x % 2 == 0).map(|x| x * 2)
}

pub fn lookup_number(pairs: &[(&str, &str)], key: &str) -> Option<i32> {
    pairs.iter()
        .find(|(k, _)| *k == key)
        .and_then(|(_, v)| v.parse::<i32>().ok())
}

pub fn add_both(a: Option<i32>, b: Option<i32>) -> Option<i32> {
    match (a, b) {
        (Some(x), Some(y)) => Some(x + y),
        _ => None,
    }
}
```

## Solution
See `solutions/07_option.rs`.
