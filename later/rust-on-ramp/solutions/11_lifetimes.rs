pub fn longer<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() {
        a
    } else {
        b
    }
}

pub fn first_line(text: &str) -> &str {
    text.lines().next().unwrap_or("")
}

pub struct Excerpt<'a> {
    pub part: &'a str,
}

impl<'a> Excerpt<'a> {
    pub fn first_sentence(text: &'a str) -> Excerpt<'a> {
        let part = text.split('.').next().unwrap_or(text);
        Excerpt { part }
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
