// 06 — enums and exhaustive matching
//
// A Rust enum is a sum type: a value that is exactly one of several named
// shapes, each of which can carry its own data. This is OCaml's variant and
// TypeScript's discriminated union — except the compiler FORCES you to
// handle every case.
//
// That exhaustiveness is the single most useful property for refactoring:
// add a variant, rebuild, and the compiler lists every place that must
// change. It is the same guarantee you met in the OCaml project on the
// ladder, and the reason the AST there was a variant.

#[derive(Debug, Clone, PartialEq)]
pub enum Shape {
    Circle(f64),             // tuple variant: one unnamed field
    Rect { w: f64, h: f64 }, // struct variant: named fields
    Point,                   // unit variant: no data
}

/// TODO: implement with a single `match`.
///
///   Circle(r)     -> PI * r * r      (use std::f64::consts::PI)
///   Rect { w, h } -> w * h
///   Point         -> 0.0
///
///   Deliberately leave out the Point arm first, compile, and read the error:
///   "non-exhaustive patterns: `Shape::Point` not covered". That message is
///   what you came to Rust for. Then add it.
///
///   Avoid a catch-all `_ => 0.0`: it compiles, and it silently swallows
///   every variant you add in future. Only reach for `_` when the set really
///   is open-ended.
pub fn area(s: &Shape) -> f64 {
    todo!()
}

/// Returns a short name for the shape.
///
/// TODO: implement this. You can ignore a variant's payload with `..`:
///   `Shape::Rect { .. } => "rect"`
pub fn name(s: &Shape) -> &'static str {
    todo!()
}

/// Returns Some(radius) only for circles.
///
/// TODO: implement this with `if let`.
///
///   `if let` is a match with one arm you care about:
///   `if let Shape::Circle(r) = s { Some(*r) } else { None }`
pub fn radius(s: &Shape) -> Option<f64> {
    todo!()
}

/// Classifies a shape by size.
/// "tiny" under 1.0, "small" under 100.0, "big" otherwise.
///
/// TODO: implement this with a match on a RANGE and a guard.
///
///   match area(s) {
///       a if a < 1.0   => "tiny",
///       a if a < 100.0 => "small",
///       _              => "big",
///   }
///
///   Those `if` clauses are match guards. Note that the compiler cannot
///   prove guards are exhaustive, which is why the final `_` is required
///   here and is genuinely correct.
pub fn size_class(s: &Shape) -> &'static str {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_area() {
        assert!((area(&Shape::Circle(1.0)) - std::f64::consts::PI).abs() < 1e-9);
        assert_eq!(area(&Shape::Rect { w: 3.0, h: 4.0 }), 12.0);
        assert_eq!(area(&Shape::Point), 0.0);
    }

    #[test]
    fn test_name() {
        assert_eq!(name(&Shape::Circle(1.0)), "circle");
        assert_eq!(name(&Shape::Rect { w: 1.0, h: 1.0 }), "rect");
        assert_eq!(name(&Shape::Point), "point");
    }

    #[test]
    fn test_radius() {
        assert_eq!(radius(&Shape::Circle(2.5)), Some(2.5));
        assert_eq!(radius(&Shape::Point), None);
    }

    #[test]
    fn test_size_class() {
        assert_eq!(size_class(&Shape::Point), "tiny");
        assert_eq!(size_class(&Shape::Rect { w: 2.0, h: 2.0 }), "small");
        assert_eq!(size_class(&Shape::Rect { w: 50.0, h: 50.0 }), "big");
    }
}
