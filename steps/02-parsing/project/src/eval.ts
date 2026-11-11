import type { Node } from "./parser.ts";

/**
 * TODO: implement this. A recursive switch on node.n — about eight lines.
 *
 *   Notice there is no precedence logic here at all. The tree shape already
 *   encodes it, which is exactly why getting the tree right was worth the
 *   effort.
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
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        case "**":
          return left ** right;
      }
    }
    default:
      return 0;
  }
}

/**
 * Renders the tree fully parenthesised: "((1 + (2 * 3)) - 4)".
 *
 * TODO: implement this.
 *
 *   Ten lines, and it is your debugger for the rest of the project — when
 *   precedence is wrong you SEE it instead of guessing.
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
      switch (n.op) {
        case "+":
          return `(${left} + ${right})`;
        case "-":
          return `(${left} - ${right})`;
        case "*":
          return `(${left} * ${right})`;
        case "/":
          return `(${left} / ${right})`;
        case "**":
          return `(${left} ** ${right})`;
      }
    }
    default:
      return "0";
  }
}
