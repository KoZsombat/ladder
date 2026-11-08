// 02 — ownership and moves
//
// THE central idea in Rust, and the one with no equivalent in TypeScript,
// Go, OCaml or C.
//
// Every value has exactly one owner. When you assign it, pass it to a
// function, or return it, ownership MOVES and the old binding becomes
// unusable. When the owner goes out of scope, the value is dropped — freed,
// deterministically, with no garbage collector and no manual free.
//
// Types that are cheap to duplicate (i32, bool, char, &T, and tuples of
// those) implement Copy and are copied instead of moved. That is why
// integers feel normal and Strings do not.
//
// Do NOT fix these by sprinkling .clone() everywhere. Clone is a real cost
// and reaching for it reflexively is how people end up with slow Rust that
// still fights them. Each TODO says which tool is the right one.

/// Returns the string with " world" appended.
///
/// TODO: make this compile.
///
///   `push_str` needs a mutable String, but `s` is an immutable binding.
///   The fix is `let mut s = s;` at the top — or better, change the
///   parameter itself to `mut s: String`. Taking the parameter by value
///   means this function OWNS it, so it is free to mutate it and hand it
///   back. That is a normal, idiomatic Rust signature.
pub fn append_world(mut s: String) -> String {
    s.push_str(" world");
    s
}

/// Returns the length of the string WITHOUT consuming it, so the caller can
/// keep using it afterwards.
///
/// TODO: fix the signature.
///
///   As written this takes ownership, so the test's `s` is moved into the
///   call and the next line fails with "borrow of moved value".
///
///   Change the parameter to a BORROW: `&String`, or better `&str`, which
///   also accepts string literals and slices. "Accept the most general
///   borrowed form" is the Rust version of "accept interfaces".
pub fn string_len(s: &str) -> usize {
    s.len()
}

/// Pushes `v` onto the vector and returns how many items it now holds.
///
/// TODO: fix the signature.
///
///   You need a MUTABLE borrow: `&mut Vec<i32>`. The caller writes
///   `count_after_push(&mut v, 4)`.
///
///   The rule the borrow checker enforces: at any moment you may have EITHER
///   any number of shared borrows (&T) OR exactly one mutable borrow (&mut T),
///   never both. That single rule is what makes data races impossible at
///   compile time — and it is the same invariant you enforced by hand with a
///   Mutex in the Go track.
pub fn count_after_push(v: &mut Vec<i32>, x: i32) -> usize {
    v.push(x);
    v.len()
}

/// Returns the first and last element of the slice, or None if empty.
///
/// TODO: implement this.
///
///   `v.first()` and `v.last()` return Option<&i32>. You want Option<(i32, i32)>,
///   so you need to dereference with `*`. Copy types make that free.
///
///   Shape: `match (v.first(), v.last()) { (Some(a), Some(b)) => Some((*a, *b)), _ => None }`
pub fn ends(v: &[i32]) -> Option<(i32, i32)> {
    match (v.first(), v.last()) {
        (Some(a), Some(b)) => Some((*a, *b)),
        _ => None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_append_world() {
        assert_eq!(append_world(String::from("hello")), "hello world");
    }

    #[test]
    fn test_string_len_does_not_consume() {
        let s = String::from("hello");
        assert_eq!(string_len(&s), 5);
        // if string_len took ownership, this line would not compile
        assert_eq!(s, "hello");
    }

    #[test]
    fn test_count_after_push() {
        let mut v = vec![1, 2, 3];
        assert_eq!(count_after_push(&mut v, 4), 4);
        assert_eq!(v, vec![1, 2, 3, 4]);
    }

    #[test]
    fn test_ends() {
        assert_eq!(ends(&[1, 2, 3]), Some((1, 3)));
        assert_eq!(ends(&[7]), Some((7, 7)));
        assert_eq!(ends(&[]), None);
    }
}
