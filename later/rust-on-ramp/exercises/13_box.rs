// 13 — Box and recursive types
//
// Rust needs to know the size of every type at compile time. A recursive
// enum has no finite size:
//
//     enum Expr { Num(i32), Add(Expr, Expr) }   // infinite size, rejected
//
// `Box<T>` is a pointer to a heap allocation. Its size is one pointer,
// whatever T is, so wrapping the recursive fields fixes it:
//
//     enum Expr { Num(i32), Add(Box<Expr>, Box<Expr>) }
//
// This is the type you would use for the AST in the calculator project on
// the ladder — and the reason OCaml needs no Box there is that OCaml boxes
// everything by default. Rust makes the allocation visible.

/// An expression tree.
///
/// TODO: fix this enum so it compiles.
///
///   Read the error first: "recursive type `Expr` has infinite size", and it
///   suggests inserting `Box` for you. That is the single friendliest
///   compiler error in this whole track.
pub enum Expr {
    Num(i32),
    Add(Expr, Expr),
    Mul(Expr, Expr),
    Neg(Expr),
}

/// Evaluates the tree.
///
/// TODO: implement this with a match.
///
///   The recursion mirrors the data exactly. For `Add(a, b)` you call
///   `eval(a)` — and because `a` is a `&Box<Expr>`, Rust auto-dereferences
///   it for you when the parameter wants `&Expr`. You do not need `&**a`,
///   though writing it would also work.
pub fn eval(e: &Expr) -> i32 {
    todo!()
}

/// Renders the tree fully parenthesised: Add(Num(1), Num(2)) -> "(1 + 2)".
///
/// TODO: implement this. Neg(Num(3)) is "(-3)".
///
///   This printer is worth writing for the same reason it was on the ladder:
///   it is how you SEE that your tree shape is right.
pub fn show(e: &Expr) -> String {
    todo!()
}

/// Counts the number of nodes in the tree.
///
/// TODO: implement this.
pub fn node_count(e: &Expr) -> usize {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn tree() -> Expr {
        // 2 * (3 + 4)
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
