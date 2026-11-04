pub fn sum_to(n: u32) -> u32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}

pub fn len_as_i32(s: &str) -> i32 {
    s.len() as i32
}

pub fn max_of(a: i64, b: i64) -> i64 {
    if a >= b {
        a
    } else {
        b
    }
}

pub fn parse_and_double(s: &str) -> i32 {
    let s = s.trim();
    match s.parse::<i32>() {
        Ok(n) => n * 2,
        Err(_) => 0,
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
