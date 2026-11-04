export type Expr =
  | { n: "num"; v: number }
  | { n: "var"; name: string }
  | { n: "bin"; op: string; l: Expr; r: Expr }
  | { n: "neg"; e: Expr };

export type Stmt =
  | { s: "assign"; name: string; e: Expr }
  | { s: "print"; e: Expr }
  | { s: "if"; cond: Expr; body: Stmt[] }
  | { s: "while"; cond: Expr; body: Stmt[] }
  | { s: "expr"; e: Expr };
