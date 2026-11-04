pub enum Expr {
    Num(i32),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}

pub fn eval(e: &Expr) -> i32 {
    match e {
        Expr::Num(n) => *n,
        Expr::Add(a, b) => eval(a) + eval(b),
        Expr::Mul(a, b) => eval(a) * eval(b),
        Expr::Neg(a) => -eval(a),
    }
}

pub fn show(e: &Expr) -> String {
    match e {
        Expr::Num(n) => n.to_string(),
        Expr::Add(a, b) => format!("({} + {})", show(a), show(b)),
        Expr::Mul(a, b) => format!("({} * {})", show(a), show(b)),
        Expr::Neg(a) => format!("(-{})", show(a)),
    }
}

pub fn node_count(e: &Expr) -> usize {
    match e {
        Expr::Num(_) => 1,
        Expr::Add(a, b) | Expr::Mul(a, b) => 1 + node_count(a) + node_count(b),
        Expr::Neg(a) => 1 + node_count(a),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn tree() -> Expr {
        Expr::Mul(
            Box::new(Expr::Num(2)),
            Box::new(Expr::Add(Box::new(Expr::Num(3)), Box::new(Expr::Num(4)))),
        )
    }
    #[test]
    fn test_eval() {
        assert_eq!(eval(&tree()), 14);
        assert_eq!(eval(&Expr::Neg(Box::new(Expr::Num(5)))), -5);
    }
    #[test]
    fn test_show() {
        assert_eq!(show(&tree()), "(2 * (3 + 4))");
        assert_eq!(show(&Expr::Neg(Box::new(Expr::Num(3)))), "(-3)");
    }
    #[test]
    fn test_node_count() {
        assert_eq!(node_count(&tree()), 5);
        assert_eq!(node_count(&Expr::Num(1)), 1);
    }
}
