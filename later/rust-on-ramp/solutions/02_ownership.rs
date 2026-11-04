pub fn append_world(mut s: String) -> String {
    s.push_str(" world");
    s
}

pub fn string_len(s: &str) -> usize {
    s.len()
}

pub fn count_after_push(v: &mut Vec<i32>, x: i32) -> usize {
    v.push(x);
    v.len()
}

pub fn ends(v: &[i32]) -> Option<(i32, i32)> {
    match (v.first(), v.last()) {
        (Some(a), Some(b)) => Some((*a, *b)),
        _ => None,
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
