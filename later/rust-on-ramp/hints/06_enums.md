# 06_enums

## Hint 1
All four are one `match` each. Matching on a `&Shape` gives you borrowed
bindings, so `r` in `Shape::Circle(r)` is an `&f64` — dereference with `*r`
or let the arithmetic coerce.

## Hint 2
```rust
pub fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rect { w, h } => w * h,
        Shape::Point => 0.0,
    }
}
```

## Hint 3
```rust
pub fn name(s: &Shape) -> &'static str {
    match s {
        Shape::Circle(_) => "circle",
        Shape::Rect { .. } => "rect",
        Shape::Point => "point",
    }
}

pub fn radius(s: &Shape) -> Option<f64> {
    if let Shape::Circle(r) = s { Some(*r) } else { None }
}
```

## Solution
See `solutions/06_enums.rs`.
