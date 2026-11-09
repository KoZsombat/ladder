// 03 — borrowing, and the one rule
//
// At any point in a program, for any value, you may have EITHER:
//   - any number of shared borrows  (&T),  or
//   - exactly one mutable borrow    (&mut T)
//
// never both at once. The compiler proves this statically. The payoff is
// that iterator invalidation, use-after-free and data races stop being
// possible — not "unlikely", impossible.
//
// Since Rust 2018 the checker uses "non-lexical lifetimes": a borrow ends at
// its LAST USE, not at the end of the block. So code that looks illegal is
// often fine, and the fix for code that is genuinely illegal is usually just
// to move things around rather than to clone.

/// Returns the sum of all elements. Must not consume or modify the vector.
///
/// TODO: implement this with a shared borrow.
///
///   `for x in v` would MOVE v (if it were owned). `for x in &v` or
///   `for x in v.iter()` borrows. Here `v` is already a `&[i32]`, so a plain
///   `for x in v` iterates over borrowed items and `x` is an `&i32`.
pub fn total(v: &[i32]) -> i32 {
    let mut sum = 0;
    for i in v {
        sum += i;
    };
    sum
}

/// Doubles every element in place.
///
/// TODO: implement this.
///
///   `for x in v.iter_mut() { *x *= 2; }` — note the `*` to write THROUGH
///   the mutable reference. Forgetting the star gives you a type error about
///   `&mut i32` and `i32`, which is the compiler telling you that a
///   reference is not the thing it points at.
pub fn double_all(v: &mut Vec<i32>) {
    for num in v {
        *num = *num * 2;
    };
}

/// Returns the largest element, and also pushes it onto `log`.
///
/// TODO: make this compile.
///
///   The body below holds a shared borrow of `v` (from `iter().max()`) while
///   trying to take a mutable borrow of `log`. Those are two DIFFERENT
///   values, so this is actually legal — the compile error you will hit is
///   something else: `max()` returns Option<&i32>, and you cannot push a
///   `&i32` into a `Vec<i32>`.
///
///   Copy the value out with `*` or `.copied()`, then push.
pub fn max_and_log(v: &[i32], log: &mut Vec<i32>) -> Option<i32> {
    let m = v.iter().max().copied();
    if let Some(x) = m {
        log.push(x)
    }
    m
}

/// Returns the first word of the string, borrowed from the input.
///
/// TODO: implement this.
///
///   Return a `&str` that points INTO `s` — no allocation at all. This is
///   what a slice is: a pointer plus a length into memory someone else owns.
///
///   `s.split_whitespace().next().unwrap_or("")` is the easy way.
///   The lifetime annotation in the signature says "the returned slice lives
///   at most as long as the input" — which is exactly why the caller cannot
///   drop the String and keep the word. Exercise 11 goes into this.
pub fn first_word(s: &str) -> &str {
    s.split_whitespace().next().unwrap_or("")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_total() {
        let v = vec![1, 2, 3];
        assert_eq!(total(&v), 6);
        assert_eq!(v.len(), 3); // not consumed
    }

    #[test]
    fn test_double_all() {
        let mut v = vec![1, 2, 3];
        double_all(&mut v);
        assert_eq!(v, vec![2, 4, 6]);
    }

    #[test]
    fn test_max_and_log() {
        let mut log = Vec::new();
        assert_eq!(max_and_log(&[3, 9, 4], &mut log), Some(9));
        assert_eq!(log, vec![9]);
        assert_eq!(max_and_log(&[], &mut log), None);
        assert_eq!(log, vec![9]); // nothing logged for an empty slice
    }

    #[test]
    fn test_first_word() {
        assert_eq!(first_word("hello world"), "hello");
        assert_eq!(first_word("  spaced  out"), "spaced");
        assert_eq!(first_word(""), "");
    }
}
