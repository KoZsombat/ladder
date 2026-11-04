// 05 — structs, impl blocks, and the three kinds of self
//
// Rust separates DATA (struct) from BEHAVIOUR (impl block). There is no
// inheritance at all; composition and traits replace it entirely.
//
// A method's first parameter tells you what it does to the value:
//   fn area(&self)        — borrows, read-only          (most methods)
//   fn scale(&mut self)   — borrows mutably, can modify
//   fn into_parts(self)   — CONSUMES it; the caller cannot use it after
//
// That third form has no equivalent in the languages you know, and it is how
// Rust expresses "this transformation ends the old value's life".

#[derive(Debug, Clone, PartialEq)]
pub struct Rect {
    pub w: f64,
    pub h: f64,
}

impl Rect {
    /// An associated function (no self) — Rust's version of a constructor.
    /// Called as `Rect::new(3.0, 4.0)`.
    ///
    /// TODO: implement this.
    ///
    ///   Field init shorthand works when the names match: `Rect { w, h }`.
    pub fn new(w: f64, h: f64) -> Self {
        todo!()
    }

    /// TODO: implement. Read-only, so `&self`.
    pub fn area(&self) -> f64 {
        todo!()
    }

    /// TODO: implement. Modifies, so `&mut self`.
    pub fn scale(&mut self, f: f64) {
        todo!()
    }

    /// Consumes the rectangle and returns its sides.
    ///
    /// TODO: implement this.
    ///
    ///   `self` by value. After `let (w, h) = r.into_parts();` the variable
    ///   `r` is gone — try using it afterwards and read the error. The
    ///   `into_` prefix is the convention that warns callers of exactly this.
    pub fn into_parts(self) -> (f64, f64) {
        todo!()
    }

    /// Returns a new Rect with the sides swapped. Does not modify self.
    ///
    /// TODO: implement this. `&self` in, a fresh `Self` out.
    pub fn transposed(&self) -> Self {
        todo!()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_and_area() {
        let r = Rect::new(3.0, 4.0);
        assert_eq!(r.w, 3.0);
        assert_eq!(r.area(), 12.0);
    }

    #[test]
    fn test_scale() {
        let mut r = Rect::new(3.0, 4.0);
        r.scale(2.0);
        assert_eq!(r, Rect { w: 6.0, h: 8.0 });
    }

    #[test]
    fn test_into_parts() {
        let r = Rect::new(3.0, 4.0);
        assert_eq!(r.into_parts(), (3.0, 4.0));
    }

    #[test]
    fn test_transposed() {
        let r = Rect::new(3.0, 4.0);
        assert_eq!(r.transposed(), Rect { w: 4.0, h: 3.0 });
        assert_eq!(r.w, 3.0); // original untouched
    }
}
