# 12_collections

## Hint 1
Three of the four are a single loop with the entry API; `dedup_consecutive`
is one method call.

## Hint 2
```rust
pub fn word_count(words: &[&str]) -> HashMap<String, usize> {
    let mut m = HashMap::new();
    for w in words {
        *m.entry(w.to_string()).or_insert(0) += 1;
    }
    m
}
```
The `*` is there because `or_insert` hands you a `&mut usize`.

## Hint 3
```rust
pub fn repeated(counts: &HashMap<String, usize>) -> Vec<String> {
    let mut out: Vec<String> = counts
        .iter()
        .filter(|(_, &n)| n > 1)
        .map(|(k, _)| k.clone())
        .collect();
    out.sort();
    out
}

pub fn group_by_parity(v: &[i32]) -> HashMap<&'static str, Vec<i32>> {
    let mut m: HashMap<&'static str, Vec<i32>> = HashMap::new();
    for &x in v {
        let key = if x % 2 == 0 { "even" } else { "odd" };
        m.entry(key).or_insert_with(Vec::new).push(x);
    }
    m
}
```

## Solution
See `solutions/12_collections.rs`.
