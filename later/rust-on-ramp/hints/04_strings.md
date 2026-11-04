# 04_strings

## Hint 1
Four of the five are single expressions. `is_palindrome` is three lines.

## Hint 2
```rust
pub fn greet(name: &str) -> String { format!("Hello, {name}!") }
pub fn char_count(s: &str) -> usize { s.chars().count() }
pub fn reverse(s: &str) -> String { s.chars().rev().collect() }
pub fn bracket_join(words: &[&str]) -> String { format!("[{}]", words.join(", ")) }
```

## Hint 3
```rust
pub fn is_palindrome(s: &str) -> bool {
    let cleaned: Vec<char> = s
        .chars()
        .filter(|c| c.is_alphanumeric())
        .flat_map(|c| c.to_lowercase())
        .collect();
    cleaned.iter().eq(cleaned.iter().rev())
}
```
`to_lowercase` on a char returns an ITERATOR, not a char, because one
uppercase character can lowercase into several (German ß is the famous
example). That is why it is `flat_map` and not `map`.

## Solution
See `solutions/04_strings.rs`.
