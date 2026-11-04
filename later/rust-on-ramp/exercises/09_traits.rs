// 09 — traits
//
// A trait is a set of methods a type can implement. It is Go's interface
// plus operator overloading plus a bit of Haskell's type classes.
//
// Two differences from Go that matter:
//   - implementation is EXPLICIT: `impl Shape for Circle { ... }`. You cannot
//     accidentally satisfy a trait.
//   - traits can have default method bodies, and can be implemented for types
//     you did not define (as long as you own the trait).
//
// Dispatch comes in two flavours and you should know which you are using:
//   - `fn f(x: impl Shape)` or `fn f<T: Shape>(x: T)` — STATIC: the compiler
//     generates one copy per concrete type. Fast, bigger binary.
//   - `fn f(x: &dyn Shape)` — DYNAMIC: a vtable, like Go's interfaces.
//     Needed when you want a Vec of mixed types.

pub trait Shape {
    fn area(&self) -> f64;

    /// A DEFAULT method: implementors get it for free unless they override.
    fn describe(&self) -> String {
        format!("a shape of area {:.2}", self.area())
    }
}

pub struct Circle {
    pub r: f64,
}
pub struct Square {
    pub side: f64,
}

// TODO: implement Shape for Circle.
//
//   impl Shape for Circle {
//       fn area(&self) -> f64 { std::f64::consts::PI * self.r * self.r }
//   }
//
//   Do NOT override describe() — the test checks you get the default.

// TODO: implement Shape for Square, and DO override describe()
//       to return exactly: "a square of side {side}"
//       (use {} formatting; for side 3.0 that is "a square of side 3").

/// Returns the total area of a mixed collection.
///
/// TODO: implement this.
///
///   The parameter is `&[Box<dyn Shape>]` — a slice of trait objects, which
///   is what lets one Vec hold Circles and Squares at once. `Box` is needed
///   because a `dyn Shape` has no known size at compile time.
pub fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    todo!()
}

/// Returns the area of any single shape, using STATIC dispatch.
///
/// TODO: implement this. The body is one line; the signature is the lesson.
pub fn area_of(s: &impl Shape) -> f64 {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_areas() {
        assert!((Circle { r: 1.0 }.area() - std::f64::consts::PI).abs() < 1e-9);
        assert_eq!(Square { side: 3.0 }.area(), 9.0);
    }

    #[test]
    fn test_default_describe() {
        let c = Circle { r: 1.0 };
        assert_eq!(c.describe(), "a shape of area 3.14");
    }

    #[test]
    fn test_overridden_describe() {
        let s = Square { side: 3.0 };
        assert_eq!(s.describe(), "a square of side 3");
    }

    #[test]
    fn test_total_area_dynamic() {
        let shapes: Vec<Box<dyn Shape>> = vec![
            Box::new(Square { side: 2.0 }),
            Box::new(Square { side: 3.0 }),
        ];
        assert_eq!(total_area(&shapes), 13.0);
    }

    #[test]
    fn test_area_of_static() {
        assert_eq!(area_of(&Square { side: 4.0 }), 16.0);
    }
}
