pub fn total(v: &[i32]) -> i32 {
    v.iter().sum()
}

pub fn double_all(v: &mut Vec<i32>) {
    for x in v.iter_mut() {
        *x *= 2;
    }
}

pub fn max_and_log(v: &[i32], log: &mut Vec<i32>) -> Option<i32> {
    let m = v.iter().max().copied();
    if let Some(x) = m {
        log.push(x);
    }
    m
}

pub fn first_word(s: &str) -> &str {
    s.split_whitespace().next().unwrap_or("")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_total() {
        let v = vec![1, 2, 3];
        assert_eq!(total(&v), 6);
        assert_eq!(v.len(), 3);
    }

    #[test]
    fn test_double_all() {
        let mut v = vec![1, 2, 3];
        double_all(&mut v);
        assert_eq!(v, vec![2, 4, 6]);
    }

    #[test]
    fn test_max_and_log() {
        let mut log = Vec::new();
        assert_eq!(max_and_log(&[3, 9, 4], &mut log), Some(9));
        assert_eq!(log, vec![9]);
        assert_eq!(max_and_log(&[], &mut log), None);
        assert_eq!(log, vec![9]);
    }

    #[test]
    fn test_first_word() {
        assert_eq!(first_word("hello world"), "hello");
        assert_eq!(first_word("  spaced  out"), "spaced");
        assert_eq!(first_word(""), "");
    }
}
