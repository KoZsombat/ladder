// 12 — Vec and HashMap
//
// The two collections you will use for almost everything. Both are generic,
// both own their contents, both grow.
//
// The HashMap API has one shape worth memorising because it appears nowhere
// else: the `entry` API.
//
//     *map.entry(key).or_insert(0) += 1;
//
// That is "give me a mutable reference to the value at key, inserting 0
// first if it is absent". One hash lookup instead of two, and no clone of
// the key unless it is actually needed.

use std::collections::HashMap;

/// Counts occurrences of each word.
///
/// TODO: implement this with the entry API.
///
///   Keys are `String` but the input is `&str`, so you need `.to_string()`
///   somewhere. The entry API only allocates when the key is new, which is
///   why `entry(w.to_string())` is still fine here — but note that it DOES
///   allocate on every call in this form. The zero-allocation version needs
///   `raw_entry` (unstable) or a check-then-insert; do not worry about it yet.
pub fn word_count(words: &[&str]) -> HashMap<String, usize> {
    todo!()
}

/// Returns the words that occur more than once, sorted alphabetically.
///
/// TODO: implement this.
///
///   Iterate the map, keep counts > 1, collect the keys, then `.sort()`.
///   Remember: HashMap iteration order is unspecified AND randomised per
///   process (Rust seeds its hasher), so the sort is not optional.
pub fn repeated(counts: &HashMap<String, usize>) -> Vec<String> {
    todo!()
}

/// Removes consecutive duplicates, in place.
/// [1,1,2,2,2,3,1] becomes [1,2,3,1].
///
/// TODO: implement this.
///
///   `v.dedup()` does exactly this. Knowing it exists is the exercise —
///   Vec has a large and genuinely useful API, and reading its docs once is
///   worth an hour.
pub fn dedup_consecutive(v: &mut Vec<i32>) {
    todo!()
}

/// Groups numbers by whether they are even.
/// Returns a map from "even"/"odd" to the numbers, each group in input order.
///
/// TODO: implement this.
///
///   entry().or_insert_with(Vec::new).push(x)
///
///   `or_insert_with` takes a closure so the default is only built when it
///   is actually needed — with `or_insert(Vec::new())` you allocate an empty
///   Vec on EVERY call and throw it away most of the time.
pub fn group_by_parity(v: &[i32]) -> HashMap<&'static str, Vec<i32>> {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_word_count() {
        let c = word_count(&["a", "b", "a"]);
        assert_eq!(c.get("a"), Some(&2));
        assert_eq!(c.get("b"), Some(&1));
        assert_eq!(c.get("zzz"), None);
    }

    #[test]
    fn test_repeated() {
        let c = word_count(&["a", "b", "a", "c", "c", "c"]);
        assert_eq!(repeated(&c), vec!["a".to_string(), "c".to_string()]);
    }

    #[test]
    fn test_dedup_consecutive() {
        let mut v = vec![1, 1, 2, 2, 2, 3, 1];
        dedup_consecutive(&mut v);
        assert_eq!(v, vec![1, 2, 3, 1]);
    }

    #[test]
    fn test_group_by_parity() {
        let g = group_by_parity(&[1, 2, 3, 4]);
        assert_eq!(g.get("even"), Some(&vec![2, 4]));
        assert_eq!(g.get("odd"), Some(&vec![1, 3]));
    }
}
