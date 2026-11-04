# 05_structs

## Hint 1
Every one of these is a single expression. The exercise is about which form
of `self` each method takes — and those are already written for you.

## Hint 2
```rust
pub fn new(w: f64, h: f64) -> Self { Rect { w, h } }
pub fn area(&self) -> f64 { self.w * self.h }
```

## Hint 3
```rust
pub fn scale(&mut self, f: f64) { self.w *= f; self.h *= f; }
pub fn into_parts(self) -> (f64, f64) { (self.w, self.h) }
pub fn transposed(&self) -> Self { Rect { w: self.h, h: self.w } }
```

## Solution
See `solutions/05_structs.rs`.
