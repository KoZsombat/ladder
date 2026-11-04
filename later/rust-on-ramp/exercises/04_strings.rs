// 04 — String vs &str, and why Rust has two of them
//
// `String` is an owned, growable, heap-allocated UTF-8 buffer. `&str` is a
// borrowed view into UTF-8 bytes someone else owns — it could be a String,
// a literal baked into the binary, or part of a larger buffer.
//
// The rule of thumb that resolves 90% of the confusion:
//   - take `&str` in parameters (works for both, no allocation)
//   - return `String` when you built something new
//
// And the thing that bites everyone: Rust strings are NOT indexable by
// integer. `s[0]` does not compile. UTF-8 is variable width, so "the byte at
// index 0" and "the first character" are different questions, and Rust makes
// you say which one you mean.

/// Returns a greeting: "Hello, {name}!"
///
/// TODO: implement this.
///
///   `format!` is the macro that builds a String. It is `sprintf` with
///   compile-time checked arguments. Since Rust 2021 you can inline the
///   variable: `format!("Hello, {name}!")`.
pub fn greet(name: &str) -> String {
    todo!()
}

/// Returns the number of CHARACTERS (not bytes) in s.
///
/// TODO: implement this.
///
///   `s.len()` is the BYTE length. For "héllo" that is 6, not 5.
///   `s.chars().count()` is the character count.
///
///   Neither is "the number of things a user would call letters" — that is
///   grapheme clusters, which needs a crate. Rust is being honest with you
///   about a genuinely hard problem that other languages paper over.
pub fn char_count(s: &str) -> usize {
    todo!()
}

/// Returns s reversed, by characters.
///
/// TODO: implement this.
///
///   `s.chars().rev().collect()` — and note `collect()` needs to know what
///   to build. The return type says String, so inference handles it here.
///   When it cannot, you write `collect::<String>()`.
pub fn reverse(s: &str) -> String {
    todo!()
}

/// Joins the words with ", " and wraps the result in square brackets.
/// ["a","b"] becomes "[a, b]"; an empty slice becomes "[]".
///
/// TODO: implement this.
///
///   `words.join(", ")` works on a slice of anything string-like.
pub fn bracket_join(words: &[&str]) -> String {
    todo!()
}

/// Returns true if s reads the same forwards and backwards, ignoring case
/// and any character that is not alphanumeric.
///
/// TODO: implement this.
///
///   Build a filtered, lowercased Vec<char> first, then compare it to its
///   own reverse. Doing it in one chained expression is possible but harder
///   to read, and readability wins.
///
///   Useful methods: `.chars()`, `.filter(|c| c.is_alphanumeric())`,
///   `.flat_map(|c| c.to_lowercase())`, `.collect::<Vec<char>>()`,
///   `.iter().rev()`, `.eq()`.
pub fn is_palindrome(s: &str) -> bool {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        assert_eq!(greet("Zsombor"), "Hello, Zsombor!");
    }

    #[test]
    fn test_char_count() {
        assert_eq!(char_count("hello"), 5);
        assert_eq!(char_count("héllo"), 5); // 6 bytes, 5 chars
        assert_eq!(char_count(""), 0);
    }

    #[test]
    fn test_reverse() {
        assert_eq!(reverse("abc"), "cba");
        assert_eq!(reverse(""), "");
    }

    #[test]
    fn test_bracket_join() {
        assert_eq!(bracket_join(&["a", "b", "c"]), "[a, b, c]");
        assert_eq!(bracket_join(&[]), "[]");
    }

    #[test]
    fn test_is_palindrome() {
        assert!(is_palindrome("A man, a plan, a canal: Panama"));
        assert!(is_palindrome(""));
        assert!(!is_palindrome("hello"));
    }
}
