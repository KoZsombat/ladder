pub fn sum_even_squares(v: &[i32]) -> i32 {
    v.iter().copied().filter(|x| x % 2 == 0).map(|x| x * x).sum()
}

pub fn long_words(words: &[&str], n: usize) -> Vec<String> {
    words
        .iter()
        .filter(|w| w.len() > n)
        .map(|w| w.to_uppercase())
        .collect()
}

pub fn running_total(v: &[i32]) -> Vec<i32> {
    v.iter()
        .scan(0, |acc, &x| {
            *acc += x;
            Some(*acc)
        })
        .collect()
}

pub fn adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

pub fn apply_all<F: Fn(i32) -> i32>(v: &[i32], f: F) -> Vec<i32> {
    v.iter().map(|&x| f(x)).collect()
}

pub fn first_above(v: &[i32], threshold: i32) -> Option<usize> {
    v.iter().position(|&x| x > threshold)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_sum_even_squares() {
        assert_eq!(sum_even_squares(&[1, 2, 3, 4]), 20);
        assert_eq!(sum_even_squares(&[]), 0);
    }
    #[test]
    fn test_long_words() {
        assert_eq!(
            long_words(&["hi", "hello", "hey"], 2),
            vec!["HELLO".to_string(), "HEY".to_string()]
        );
    }
    #[test]
    fn test_running_total() {
        assert_eq!(running_total(&[1, 2, 3]), vec![1, 3, 6]);
        assert_eq!(running_total(&[]), Vec::<i32>::new());
    }
    #[test]
    fn test_adder() {
        let add5 = adder(5);
        assert_eq!(add5(10), 15);
        assert_eq!(add5(0), 5);
    }
    #[test]
    fn test_apply_all() {
        assert_eq!(apply_all(&[1, 2, 3], |x| x * 10), vec![10, 20, 30]);
    }
    #[test]
    fn test_first_above() {
        assert_eq!(first_above(&[1, 5, 9], 4), Some(1));
        assert_eq!(first_above(&[1, 2], 100), None);
    }
}
