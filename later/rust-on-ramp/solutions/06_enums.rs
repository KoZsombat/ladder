#[derive(Debug, Clone, PartialEq)]
pub enum Shape {
    Circle(f64),
    Rect { w: f64, h: f64 },
    Point,
}

pub fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rect { w, h } => w * h,
        Shape::Point => 0.0,
    }
}

pub fn name(s: &Shape) -> &'static str {
    match s {
        Shape::Circle(_) => "circle",
        Shape::Rect { .. } => "rect",
        Shape::Point => "point",
    }
}

pub fn radius(s: &Shape) -> Option<f64> {
    if let Shape::Circle(r) = s {
        Some(*r)
    } else {
        None
    }
}

pub fn size_class(s: &Shape) -> &'static str {
    match area(s) {
        a if a < 1.0 => "tiny",
        a if a < 100.0 => "small",
        _ => "big",
    }
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
