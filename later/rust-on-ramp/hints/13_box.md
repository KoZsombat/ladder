# 13_box

## Hint 1
Wrap every recursive field in `Box<...>`:
```rust
pub enum Expr {
    Num(i32),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}
```

## Hint 2
```rust
pub fn eval(e: &Expr) -> i32 {
    match e {
        Expr::Num(n) => *n,
        Expr::Add(a, b) => eval(a) + eval(b),
        Expr::Mul(a, b) => eval(a) * eval(b),
        Expr::Neg(a) => -eval(a),
    }
}
```

## Hint 3
```rust
pub fn show(e: &Expr) -> String {
    match e {
        Expr::Num(n) => n.to_string(),
        Expr::Add(a, b) => format!("({} + {})", show(a), show(b)),
        Expr::Mul(a, b) => format!("({} * {})", show(a), show(b)),
        Expr::Neg(a) => format!("(-{})", show(a)),
    }
}
```
`node_count` is the same walk with `1 + node_count(a) + node_count(b)`.

## Solution
See `solutions/13_box.rs`.
