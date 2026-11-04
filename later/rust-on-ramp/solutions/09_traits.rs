pub trait Shape {
    fn area(&self) -> f64;
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

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.r * self.r
    }
}

impl Shape for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
    fn describe(&self) -> String {
        format!("a square of side {}", self.side)
    }
}

pub fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}

pub fn area_of(s: &impl Shape) -> f64 {
    s.area()
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
