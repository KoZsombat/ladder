pub fn largest<T: PartialOrd + Copy>(v: &[T]) -> Option<T> {
    let mut it = v.iter();
    let mut best = *it.next()?;
    for &x in it {
        if x > best {
            best = x;
        }
    }
    Some(best)
}

#[derive(Debug, PartialEq)]
pub struct Pair<T> {
    pub a: T,
    pub b: T,
}

impl<T> Pair<T> {
    pub fn new(a: T, b: T) -> Self {
        Pair { a, b }
    }
}

impl<T: PartialOrd + Copy> Pair<T> {
    pub fn larger(&self) -> T {
        if self.a >= self.b {
            self.a
        } else {
            self.b
        }
    }
}

pub fn count_matching<T, F>(v: &[T], pred: F) -> usize
where
    F: Fn(&T) -> bool,
{
    v.iter().filter(|x| pred(x)).count()
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_largest() {
        assert_eq!(largest(&[3, 9, 4]), Some(9));
        assert_eq!(largest(&[1.5, 0.5]), Some(1.5));
        assert_eq!(largest::<i32>(&[]), None);
    }
    #[test]
    fn test_pair() {
        let p = Pair::new(3, 7);
        assert_eq!(p, Pair { a: 3, b: 7 });
        assert_eq!(p.larger(), 7);
    }
    #[test]
    fn test_count_matching() {
        assert_eq!(count_matching(&[1, 2, 3, 4], |x| x % 2 == 0), 2);
        assert_eq!(count_matching::<i32, _>(&[], |_| true), 0);
    }
}
