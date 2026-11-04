pub fn greet(name: &str) -> String {
    format!("Hello, {name}!")
}

pub fn char_count(s: &str) -> usize {
    s.chars().count()
}

pub fn reverse(s: &str) -> String {
    s.chars().rev().collect()
}

pub fn bracket_join(words: &[&str]) -> String {
    format!("[{}]", words.join(", "))
}

pub fn is_palindrome(s: &str) -> bool {
    let cleaned: Vec<char> = s
        .chars()
        .filter(|c| c.is_alphanumeric())
        .flat_map(|c| c.to_lowercase())
        .collect();
    cleaned.iter().eq(cleaned.iter().rev())
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
        assert_eq!(char_count("héllo"), 5);
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
