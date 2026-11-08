// 01 — variables, types, and the absence of implicit conversion
//
// Rust is immutable by default. `let x = 5;` cannot be reassigned; you need
// `let mut x = 5;`. That default is the opposite of almost every language you
// know, and it is the first thing that will trip you up.
//
// Like Go and OCaml, Rust does no implicit numeric conversion. An i32 and a
// usize are different types and `i + u` does not compile. You convert
// explicitly with `as` (cheap, can truncate) or `try_into()` (checked).

/// Returns the sum of 1..=n.
///
/// TODO: make this compile and pass.
///
///   The body below is wrong in exactly one way: `total` is never declared
///   mutable. Add `mut`. Read the compiler error first — Rust's errors are
///   the best of any mainstream language and they usually tell you the fix
///   verbatim, including the exact text to insert.
pub fn sum_to(n: u32) -> u32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}

/// Returns the length of `s` as an i32. 
///
/// TODO: make this compile.
///
///   `s.len()` returns a usize (a pointer-sized unsigned integer), and this
///   function returns i32. Rust will not convert for you.
///
///   Use `s.len() as i32`. Then think about what happens for a string longer
///   than 2 billion bytes — `as` silently wraps. The honest version is
///   `i32::try_from(s.len()).unwrap_or(i32::MAX)`, and knowing the difference
///   is the point of this exercise.
pub fn len_as_i32(s: &str) -> i32 {
    s.len() as i32
}

/// Returns the larger of two values, or `a` if they are equal.
///
/// TODO: implement this.
///
///   Rust has no ternary, but `if` IS an expression, so this is:
///   `if a >= b { a } else { b }` — note: no semicolons on those branches.
///   A semicolon turns an expression into a statement whose value is `()`,
///   and you will get a type error about expecting i64 and finding ().
///   That error will happen to you at least once today; now you know why.
pub fn max_of(a: i64, b: i64) -> i64 {
    if a >= b {a} else {b}
}

/// Shadowing: returns the input parsed as a number, doubled.
/// On a parse failure, return 0.
///
/// TODO: implement this.
///
///   `s.parse::<i32>()` returns a Result. For now use
///   `match s.parse::<i32>() { Ok(n) => n * 2, Err(_) => 0 }`.
///   Exercise 08 does Result properly.
///
///   Notice you can write `let s = s.trim();` — a NEW binding that shadows
///   the parameter, possibly with a different type. That is shadowing, and
///   it is not mutation: the old value still exists, it is just unreachable.
pub fn parse_and_double(s: &str) -> i32 {
    match s.trim().parse::<i32>() {
        Ok(n) => n * 2,
        Err(_) => 0 
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sum_to() {
        assert_eq!(sum_to(5), 15);
        assert_eq!(sum_to(0), 0);
    }

    #[test]
    fn test_len_as_i32() {
        assert_eq!(len_as_i32("hello"), 5);
        assert_eq!(len_as_i32(""), 0);
    }

    #[test]
    fn test_max_of() {
        assert_eq!(max_of(3, 7), 7);
        assert_eq!(max_of(7, 3), 7);
        assert_eq!(max_of(4, 4), 4);
    }

    #[test]
    fn test_parse_and_double() {
        assert_eq!(parse_and_double("21"), 42);
        assert_eq!(parse_and_double("  21  "), 42);
        assert_eq!(parse_and_double("nope"), 0);
    }
}
