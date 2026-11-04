pub fn at(v: &[i32], i: usize) -> Option<i32> {
    v.get(i).copied()
}

pub fn first_even_doubled(v: &[i32]) -> Option<i32> {
    v.iter().find(|x| *x % 2 == 0).map(|x| x * 2)
}

pub fn name_len(name: Option<&str>) -> usize {
    name.map_or(0, |s| s.len())
}

pub fn lookup_number(pairs: &[(&str, &str)], key: &str) -> Option<i32> {
    pairs
        .iter()
        .find(|(k, _)| *k == key)
        .and_then(|(_, v)| v.parse::<i32>().ok())
}

pub fn add_both(a: Option<i32>, b: Option<i32>) -> Option<i32> {
    match (a, b) {
        (Some(x), Some(y)) => Some(x + y),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_at() {
        assert_eq!(at(&[1, 2, 3], 1), Some(2));
        assert_eq!(at(&[1, 2, 3], 9), None);
    }
    #[test]
    fn test_first_even_doubled() {
        assert_eq!(first_even_doubled(&[1, 3, 4, 6]), Some(8));
        assert_eq!(first_even_doubled(&[1, 3]), None);
    }
    #[test]
    fn test_name_len() {
        assert_eq!(name_len(Some("abc")), 3);
        assert_eq!(name_len(None), 0);
    }
    #[test]
    fn test_lookup_number() {
        let pairs = [("a", "1"), ("b", "nope")];
        assert_eq!(lookup_number(&pairs, "a"), Some(1));
        assert_eq!(lookup_number(&pairs, "b"), None);
        assert_eq!(lookup_number(&pairs, "zzz"), None);
    }
    #[test]
    fn test_add_both() {
        assert_eq!(add_both(Some(1), Some(2)), Some(3));
        assert_eq!(add_both(Some(1), None), None);
        assert_eq!(add_both(None, None), None);
    }
}
