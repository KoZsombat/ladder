// 10 — generics and trait bounds
//
// `fn largest<T>(v: &[T]) -> T` does not compile on its own, because the
// compiler has no idea whether T can be compared. You must say so:
//
//     fn largest<T: PartialOrd + Copy>(v: &[T]) -> T
//
// Those are trait bounds, and they are what makes Rust generics different
// from TypeScript's: the body is checked ONCE against the bounds, not
// re-checked per instantiation. If it compiles for T, it compiles for every
// type satisfying the bounds — no surprises at the call site.

/// Returns the largest element, or None for an empty slice.
///
/// TODO: add the bounds this needs, then implement.
///
///   You need `PartialOrd` to use `>`, and `Copy` so you can return a value
///   out of a borrowed slice without cloning.
///
///   Delete the bounds and read the error — it names exactly which trait is
///   missing and where, and it suggests the fix.
pub fn largest<T>(v: &[T]) -> Option<T> {
    todo!()
}

/// A generic pair.
#[derive(Debug, PartialEq)]
pub struct Pair<T> {
    pub a: T,
    pub b: T,
}

impl<T> Pair<T> {
    /// TODO: implement. Available for EVERY T.
    pub fn new(a: T, b: T) -> Self {
        todo!()
    }
}

// TODO: add a second impl block, only for T that can be compared and copied,
// containing a method `larger(&self) -> T` returning the bigger of the two.
//
//     impl<T: PartialOrd + Copy> Pair<T> {
//         pub fn larger(&self) -> T { ... }
//     }
//
//   Two impl blocks for one type with different bounds is a CONDITIONAL
//   implementation: `larger` simply does not exist for a Pair of something
//   uncomparable. TypeScript cannot express that.

/// Counts how many elements satisfy the predicate.
///
/// TODO: implement this.
///
///   The bound for a closure parameter is `F: Fn(&T) -> bool`.
///   There are three closure traits and the difference matters:
///     Fn       — borrows what it captures, callable many times
///     FnMut    — mutably borrows, callable many times
///     FnOnce   — CONSUMES what it captures, callable once
///   Take the loosest one that works; `Fn` here.
pub fn count_matching<T, F>(v: &[T], pred: F) -> usize
where
    F: Fn(&T) -> bool,
{
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_largest() {
        assert_eq!(largest(&[3, 9, 4]), Some(9));
        assert_eq!(largest(&[1.5, 0.5]), Some(1.5));
        assert_eq!(largest::<i32>(&[]), None);
    }

    #[test]
    fn test_pair() {
        let p = Pair::new(3, 7);
        assert_eq!(p, Pair { a: 3, b: 7 });
        assert_eq!(p.larger(), 7);
    }

    #[test]
    fn test_count_matching() {
        assert_eq!(count_matching(&[1, 2, 3, 4], |x| x % 2 == 0), 2);
        assert_eq!(count_matching::<i32, _>(&[], |_| true), 0);
    }
}
