// 03 — recursion over a tree
//
// An AST is nested plain objects. No class hierarchy, no visitor interface,
// no base class. Resist making it object-oriented: the tree is DATA, and
// the functions that walk it live outside it.
//
// Here the tree is given to you. You write three walks over it — and those
// three are exactly `evaluate`, `show` and the node counter you will need
// in the project.

export type Node =
  | { n: "num"; v: number }
  | { n: "bin"; op: "+" | "-" | "*" | "/"; l: Node; r: Node }
  | { n: "neg"; e: Node };

/**
 * TODO: implement this. A switch on n.n, recursing into the children.
 *
 *   Note there is NO precedence logic here. The tree shape already encodes
 *   it: deeper means evaluated sooner. That is why getting the tree right
 *   in the project is worth the effort — everything downstream gets simple.
 */
export function evaluate(n: Node): number {
  switch (n.n) {
    case "num":
      return n.v;
    case "neg":
      return evaluate(n.e) * -1;
    case "bin": {
      const left = evaluate(n.l);
      const right = evaluate(n.r);
      switch (n.op) {
        case "*":
          return left * right;
        case "/":
          return left / right;
        case "+":
          return left + right;
        case "-":
          return left - right;
      }
    }
    default:
      return 0;
  }
}

/**
 * Renders fully parenthesised: the tree for 1 + 2 * 3 becomes "(1 + (2 * 3))".
 *
 * TODO: implement this.
 *
 *   Ten lines, and it is your debugger for the whole next project. When
 *   precedence comes out wrong you will SEE it instead of guessing.
 */
export function show(n: Node): string {
  switch (n.n) {
    case "num":
      return String(n.v);
    case "neg":
      return `(-${show(n.e)})`;
    case "bin": {
      const left = show(n.l);
      const right = show(n.r);
      return `(${left} ${n.op} ${right})`;
    }
    default:
      return "0";
  }
}

/**
 * The maximum depth of the tree. A single number is depth 1.
 *
 * TODO: implement this.
 *
 *   1 + the max of the children's depths. This is the same shape as the
 *   other two, which is the point: once you can see the shape, every tree
 *   walk you ever write is a variation on it.
 */
export function depth(n: Node): number {
  switch (n.n) {
    case "num":
      return 1;
    case "neg":
      return 1 + depth(n.e);
    case "bin": {
      const left = depth(n.l);
      const right = depth(n.r);
      return 1 + Math.max(left, right);
    }
    default:
      return 0;
  }
}
