# 11_lifetimes

## Hint 1
Two annotations and two one-line bodies. The compiler's error messages here
literally contain the text to paste.

## Hint 2
```rust
pub fn longer<'a>(a: &'a str, b: &'a str) -> &'a str
pub struct Excerpt<'a> { pub part: &'a str }
impl<'a> Excerpt<'a> { ... }
```

## Hint 3
```rust
pub fn first_line(text: &str) -> &str {
    text.lines().next().unwrap_or("")
}

impl<'a> Excerpt<'a> {
    pub fn first_sentence(text: &'a str) -> Excerpt<'a> {
        let part = text.split('.').next().unwrap_or(text);
        Excerpt { part }
    }
}
```

## Solution
See `solutions/11_lifetimes.rs`.
