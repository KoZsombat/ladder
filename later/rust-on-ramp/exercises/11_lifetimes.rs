// 11 — lifetimes
//
// A lifetime is not a thing you create; it is a NAME for a region of code,
// used to relate the lifespan of inputs to outputs. `'a` is pronounced
// "tick a". You almost never need to write them — the compiler elides them
// in the common cases — but when it cannot infer, it asks, and the error is
// famously confusing until you know what it is asking for.
//
// The question it is always asking is: "this function returns a reference —
// which input does it borrow FROM?" It needs the answer so it can stop the
// caller from dropping that input while the result is still alive.

/// Returns the longer of two strings.
///
/// TODO: make this compile.
///
///   As written, the compiler cannot tell whether the result borrows from
///   `a` or from `b`, so it refuses. Annotate:
///
///     pub fn longer<'a>(a: &'a str, b: &'a str) -> &'a str
///
///   Read it as: "for some region 'a, both inputs live at least that long,
///   and so does the output". It does NOT mean the two inputs have equal
///   lifetimes — the compiler picks the shorter of the two for 'a.
pub fn longer(a: &str, b: &str) -> &str {
    if a.len() >= b.len() {
        a
    } else {
        b
    }
}

/// Returns the first line of the text.
///
/// TODO: implement this.
///
///   No annotation needed here! With exactly one reference input, elision
///   assigns the output the same lifetime automatically. That rule is why
///   you rarely see lifetimes in real code.
pub fn first_line(text: &str) -> &str {
    todo!()
}

/// A struct that BORROWS rather than owns.
///
/// TODO: add the lifetime parameter so this compiles.
///
///     pub struct Excerpt<'a> { pub part: &'a str }
///
///   Any struct holding a reference needs one. It means "an Excerpt cannot
///   outlive the string it points into", which the compiler then enforces at
///   every use. This is how you build zero-copy parsers — and it is exactly
///   what the tokenizer on the ladder would do in Rust: tokens pointing into
///   the source string, no allocation per token.
pub struct Excerpt {
    pub part: &str,
}

impl Excerpt {
    /// TODO: implement. Returns the first sentence of `text` (up to the
    /// first '.'), or the whole text if there is no '.'.
    pub fn first_sentence(text: &str) -> Excerpt {
        todo!()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_longer() {
        let a = String::from("hello");
        let b = String::from("hi");
        assert_eq!(longer(&a, &b), "hello");
    }

    #[test]
    fn test_first_line() {
        assert_eq!(first_line("one\ntwo"), "one");
        assert_eq!(first_line("only"), "only");
    }

    #[test]
    fn test_excerpt() {
        let text = String::from("First. Second.");
        let e = Excerpt::first_sentence(&text);
        assert_eq!(e.part, "First");
        let e2 = Excerpt::first_sentence("no dot here");
        assert_eq!(e2.part, "no dot here");
    }
}
