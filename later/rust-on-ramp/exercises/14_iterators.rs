// 14 — iterators and closures
//
// Rust iterators are LAZY: `map` builds a new iterator and does nothing
// until something consumes it. That is why a chain of twenty adapters
// allocates nothing and compiles down to roughly the loop you would have
// written by hand — "zero-cost abstraction" is literally true here, and you
// can check it in the generated assembly.
//
// Three ways to iterate a collection, and the difference is ownership:
//     v.iter()       -> &T      borrows
//     v.iter_mut()   -> &mut T  borrows mutably
//     v.into_iter()  -> T       CONSUMES the collection

/// Sum of the squares of the even numbers.
///
/// TODO: implement this as one chain.
///
///   .iter().filter(...).map(...).sum()
///   Note `filter`'s closure gets `&&i32` here (a reference to the iterator's
///   `&i32`), which is why you will see `|&&x|` or `|x| **x` patterns. The
///   easy way out is `.copied()` right after `.iter()`.
pub fn sum_even_squares(v: &[i32]) -> i32 {
    todo!()
}

/// Returns the words longer than `n`, uppercased.
///
/// TODO: implement this.
///
///   `collect()` is the universal consumer — it can build a Vec, a String,
///   a HashMap, or a Result. The target type is what decides; annotate it
///   with a turbofish `collect::<Vec<_>>()` or on the binding.
pub fn long_words(words: &[&str], n: usize) -> Vec<String> {
    todo!()
}

/// Returns a running total: [1,2,3] becomes [1,3,6].
///
/// TODO: implement this with `scan`.
///
///   `scan` is `fold` that yields every intermediate value:
///     v.iter().scan(0, |acc, &x| { *acc += x; Some(*acc) }).collect()
///
///   The `Some` is how scan signals "keep going"; returning None stops it.
pub fn running_total(v: &[i32]) -> Vec<i32> {
    todo!()
}

/// Returns a closure that adds `n` to whatever it is given.
///
/// TODO: implement this.
///
///   `move |x| x + n` — the `move` keyword forces the closure to take
///   ownership of `n` instead of borrowing it, which it must do because the
///   closure outlives this function.
///
///   The return type `impl Fn(i32) -> i32` means "some concrete type that
///   implements this trait; I am not telling you which". Every closure has
///   its own unnamed type, so this is the only way to return one without
///   boxing it.
pub fn adder(n: i32) -> impl Fn(i32) -> i32 {
    todo!()
}

/// Applies `f` to every element and returns the results.
///
/// TODO: implement this. The bound is already written.
pub fn apply_all<F: Fn(i32) -> i32>(v: &[i32], f: F) -> Vec<i32> {
    todo!()
}

/// Returns the index of the first element greater than `threshold`.
///
/// TODO: implement this with `position`.
pub fn first_above(v: &[i32], threshold: i32) -> Option<usize> {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sum_even_squares() {
        assert_eq!(sum_even_squares(&[1, 2, 3, 4]), 20); // 4 + 16
        assert_eq!(sum_even_squares(&[]), 0);
    }

    #[test]
    fn test_long_words() {
        assert_eq!(
            long_words(&["hi", "hello", "hey"], 2),
            vec!["HELLO".to_string(), "HEY".to_string()]
        );
    }

    #[test]
    fn test_running_total() {
        assert_eq!(running_total(&[1, 2, 3]), vec![1, 3, 6]);
        assert_eq!(running_total(&[]), Vec::<i32>::new());
    }

    #[test]
    fn test_adder() {
        let add5 = adder(5);
        assert_eq!(add5(10), 15);
        assert_eq!(add5(0), 5);
    }

    #[test]
    fn test_apply_all() {
        assert_eq!(apply_all(&[1, 2, 3], |x| x * 10), vec![10, 20, 30]);
    }

    #[test]
    fn test_first_above() {
        assert_eq!(first_above(&[1, 5, 9], 4), Some(1));
        assert_eq!(first_above(&[1, 2], 100), None);
    }
}
