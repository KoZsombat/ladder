// 08 — Result and the ? operator
//
//   enum Result<T, E> { Ok(T), Err(E) }
//
// Rust has panics, but they are for BUGS (index out of range, failed
// invariant), not for expected failures. Anything a caller could reasonably
// handle comes back as a Result.
//
// The `?` operator is what makes this pleasant instead of a pyramid:
//
//     let n: i32 = s.parse()?;
//
// means "if that was Ok, give me the value; if it was Err, return it from
// this function right now". It is the OCaml `let*` from the ladder, built
// into the language — same shape, same purpose, no runtime.

use std::num::ParseIntError;

#[derive(Debug, PartialEq)]
pub enum CalcError {
    Parse(String),
    DivideByZero,
}

/// Parses a string into an i32.
///
/// TODO: implement this.
///
///   `s.trim().parse::<i32>()` returns Result<i32, ParseIntError>.
///   You need Result<i32, CalcError>, so map the error:
///
///     s.trim().parse::<i32>().map_err(|e| CalcError::Parse(e.to_string()))
///
///   `map_err` transforms the error side and leaves Ok alone. This is how
///   you convert a library's error type into your own at a boundary.
pub fn parse_num(s: &str) -> Result<i32, CalcError> {
    todo!()
}

/// Divides a by b.
///
/// TODO: implement this. Return Err(CalcError::DivideByZero) when b is 0.
pub fn divide(a: i32, b: i32) -> Result<i32, CalcError> {
    todo!()
}

/// Parses both strings and divides the first by the second.
///
/// TODO: implement this using `?` — THREE lines, no match at all.
///
///     let a = parse_num(a_str)?;
///     let b = parse_num(b_str)?;
///     divide(a, b)
///
///   Write it with nested matches first if you want to feel the difference.
///   That version is about fifteen lines and much harder to read, which is
///   exactly the point.
pub fn parse_and_divide(a_str: &str, b_str: &str) -> Result<i32, CalcError> {
    todo!()
}

/// Sums every number in the list. Fails on the FIRST unparseable entry.
///
/// TODO: implement this.
///
///   A loop with `?` works and is clear:
///     let mut total = 0;
///     for s in list { total += parse_num(s)?; }
///     Ok(total)
///
///   The idiomatic one-liner is worth knowing too:
///     list.iter().map(|s| parse_num(s)).sum()
///   because Result implements Sum — collecting an iterator of Results into
///   a Result<Vec<_>, _> (or a sum) short-circuits on the first error. That
///   trick surprises everyone the first time.
pub fn sum_all(list: &[&str]) -> Result<i32, CalcError> {
    todo!()
}

/// Demonstrates `?` with a DIFFERENT error type, using From.
///
/// TODO: make this compile.
///
///   The body uses `?` on a ParseIntError inside a function returning
///   CalcError. That only works if CalcError implements From<ParseIntError>.
///   Write that impl at the TODO below — then `?` converts automatically.
///
///   This is why `?` scales: each layer declares how foreign errors become
///   its own, and the call sites stay clean.
pub fn parse_pair(s: &str) -> Result<(i32, i32), CalcError> {
    let (a, b) = s.split_once(',').ok_or(CalcError::Parse("no comma".into()))?;
    Ok((a.trim().parse::<i32>()?, b.trim().parse::<i32>()?))
}

// TODO: implement this so that parse_pair compiles.
//
//     impl From<ParseIntError> for CalcError {
//         fn from(e: ParseIntError) -> Self {
//             CalcError::Parse(e.to_string())
//         }
//     }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_num() {
        assert_eq!(parse_num(" 42 "), Ok(42));
        assert!(matches!(parse_num("x"), Err(CalcError::Parse(_))));
    }

    #[test]
    fn test_divide() {
        assert_eq!(divide(10, 2), Ok(5));
        assert_eq!(divide(1, 0), Err(CalcError::DivideByZero));
    }

    #[test]
    fn test_parse_and_divide() {
        assert_eq!(parse_and_divide("10", "2"), Ok(5));
        assert_eq!(parse_and_divide("10", "0"), Err(CalcError::DivideByZero));
        assert!(matches!(parse_and_divide("x", "2"), Err(CalcError::Parse(_))));
    }

    #[test]
    fn test_sum_all() {
        assert_eq!(sum_all(&["1", "2", "3"]), Ok(6));
        assert!(matches!(sum_all(&["1", "oops"]), Err(CalcError::Parse(_))));
        assert_eq!(sum_all(&[]), Ok(0));
    }

    #[test]
    fn test_parse_pair() {
        assert_eq!(parse_pair("3, 4"), Ok((3, 4)));
        assert!(matches!(parse_pair("3"), Err(CalcError::Parse(_))));
        assert!(matches!(parse_pair("3,x"), Err(CalcError::Parse(_))));
    }
}
