# 09_traits

## Hint 1
Two `impl` blocks and two one-line functions.

## Hint 2
```rust
impl Shape for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.r * self.r }
}

impl Shape for Square {
    fn area(&self) -> f64 { self.side * self.side }
    fn describe(&self) -> String { format!("a square of side {}", self.side) }
}
```

## Hint 3
```rust
pub fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}
pub fn area_of(s: &impl Shape) -> f64 { s.area() }
```

## Solution
See `solutions/09_traits.rs`.
