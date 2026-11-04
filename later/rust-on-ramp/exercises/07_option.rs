// 07 — Option: there is no null
//
//   enum Option<T> { Some(T), None }
//
// That is the whole definition, and it is in the standard library, not the
// language. Anything that might be absent says so in its type, and you
// cannot forget to handle the absent case because the compiler will not let
// you get at the value without unwrapping it somehow.
//
// This is strictNullChecks taken all the way, and it is the same `option`
// you met in OCaml.
//
// About `.unwrap()`: it panics on None. It is fine in tests and in a
// prototype. In real code it is a claim that None is impossible — so prefer
// the combinators below, which make the None path explicit and cheap.

/// Returns the element at `i`, or None.
///
/// TODO: implement this.
///
///   `v.get(i)` already returns Option<&T>. Use `.copied()` to turn
///   Option<&i32> into Option<i32>.
///
///   Compare with `v[i]`, which PANICS out of range. Rust gives you both and
///   makes you choose; most languages only give you the one that lies.
pub fn at(v: &[i32], i: usize) -> Option<i32> {
    todo!()
}

/// Returns the first even number, doubled.
///
/// TODO: implement this.
///
///   `v.iter().find(|x| ...)` gives Option<&i32>, then `.map(|x| x * 2)`
///   transforms the inside WITHOUT unwrapping. `map` on an Option is the
///   same idea as `?.` in TypeScript, but checked.
pub fn first_even_doubled(v: &[i32]) -> Option<i32> {
    todo!()
}

/// Returns the length of the name, or 0 if there is no name.
///
/// TODO: implement this.
///
///   `name.map(|s| s.len()).unwrap_or(0)` — or more directly
///   `name.map_or(0, |s| s.len())`.
///
///   `unwrap_or` is `??` in TypeScript. `unwrap_or_else` takes a closure for
///   when the default is expensive to compute, and `unwrap_or_default` uses
///   the type's zero value.
pub fn name_len(name: Option<&str>) -> usize {
    todo!()
}

/// Looks up `key` in the list of pairs, then parses the value as an i32.
/// Returns None if the key is missing OR the value does not parse.
///
/// TODO: implement this.
///
///   This is where `and_then` earns its place: it chains operations that
///   each might fail, without nesting matches.
///
///     pairs.iter()
///          .find(|(k, _)| *k == key)
///          .and_then(|(_, v)| v.parse::<i32>().ok())
///
///   `and_then` is flat_map for Option: your closure returns an Option and
///   the result is NOT nested. `.ok()` turns a Result into an Option,
///   discarding the error.
pub fn lookup_number(pairs: &[(&str, &str)], key: &str) -> Option<i32> {
    todo!()
}

/// Returns the sum of two optional numbers, but only if BOTH are present.
///
/// TODO: implement this with a match on the tuple `(a, b)`.
pub fn add_both(a: Option<i32>, b: Option<i32>) -> Option<i32> {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_at() {
        assert_eq!(at(&[1, 2, 3], 1), Some(2));
        assert_eq!(at(&[1, 2, 3], 9), None);
    }

    #[test]
    fn test_first_even_doubled() {
        assert_eq!(first_even_doubled(&[1, 3, 4, 6]), Some(8));
        assert_eq!(first_even_doubled(&[1, 3]), None);
    }

    #[test]
    fn test_name_len() {
        assert_eq!(name_len(Some("abc")), 3);
        assert_eq!(name_len(None), 0);
    }

    #[test]
    fn test_lookup_number() {
        let pairs = [("a", "1"), ("b", "nope")];
        assert_eq!(lookup_number(&pairs, "a"), Some(1));
        assert_eq!(lookup_number(&pairs, "b"), None);
        assert_eq!(lookup_number(&pairs, "zzz"), None);
    }

    #[test]
    fn test_add_both() {
        assert_eq!(add_both(Some(1), Some(2)), Some(3));
        assert_eq!(add_both(Some(1), None), None);
        assert_eq!(add_both(None, None), None);
    }
}
