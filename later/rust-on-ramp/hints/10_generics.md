# 10_generics

## Hint 1
`largest` needs `<T: PartialOrd + Copy>`. The rest follows.

## Hint 2
```rust
pub fn largest<T: PartialOrd + Copy>(v: &[T]) -> Option<T> {
    let mut it = v.iter();
    let mut best = *it.next()?;        // ? works on Option too
    for &x in it {
        if x > best { best = x; }
    }
    Some(best)
}
```
Note `?` on an Option inside a function returning Option — same early-return
mechanism as with Result.

## Hint 3
```rust
impl<T> Pair<T> {
    pub fn new(a: T, b: T) -> Self { Pair { a, b } }
}

impl<T: PartialOrd + Copy> Pair<T> {
    pub fn larger(&self) -> T {
        if self.a >= self.b { self.a } else { self.b }
    }
}

pub fn count_matching<T, F>(v: &[T], pred: F) -> usize
where F: Fn(&T) -> bool {
    v.iter().filter(|x| pred(x)).count()
}
```

## Solution
See `solutions/10_generics.rs`.
