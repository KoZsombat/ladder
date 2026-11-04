#[derive(Debug, Clone, PartialEq)]
pub struct Rect {
    pub w: f64,
    pub h: f64,
}

impl Rect {
    pub fn new(w: f64, h: f64) -> Self {
        Rect { w, h }
    }
    pub fn area(&self) -> f64 {
        self.w * self.h
    }
    pub fn scale(&mut self, f: f64) {
        self.w *= f;
        self.h *= f;
    }
    pub fn into_parts(self) -> (f64, f64) {
        (self.w, self.h)
    }
    pub fn transposed(&self) -> Self {
        Rect { w: self.h, h: self.w }
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
        assert_eq!(r.w, 3.0);
    }
}
