# 14_iterators

## Hint 1
Every one of these is a single expression. If you find yourself writing a
`for` loop with a `mut` accumulator, there is an adapter for it.

## Hint 2
```rust
pub fn sum_even_squares(v: &[i32]) -> i32 {
    v.iter().copied().filter(|x| x % 2 == 0).map(|x| x * x).sum()
}

pub fn long_words(words: &[&str], n: usize) -> Vec<String> {
    words.iter().filter(|w| w.len() > n).map(|w| w.to_uppercase()).collect()
}
```

## Hint 3
```rust
pub fn running_total(v: &[i32]) -> Vec<i32> {
    v.iter().scan(0, |acc, &x| { *acc += x; Some(*acc) }).collect()
}

pub fn adder(n: i32) -> impl Fn(i32) -> i32 { move |x| x + n }

pub fn apply_all<F: Fn(i32) -> i32>(v: &[i32], f: F) -> Vec<i32> {
    v.iter().map(|&x| f(x)).collect()
}

pub fn first_above(v: &[i32], threshold: i32) -> Option<usize> {
    v.iter().position(|&x| x > threshold)
}
```

## Solution
See `solutions/14_iterators.rs`.
