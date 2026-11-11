import { tokenize } from "./lexer.ts";
import { cursor, type Cursor } from "./cursor.ts";

export type Node =
  | { n: "num"; v: number }
  | { n: "bin"; op: string; l: Node; r: Node }
  | { n: "neg"; e: Node };

/** Binding power: how tightly an operator grips its operands. */
const BP: Record<string, { bp: number; right: boolean }> = {
  "+": { bp: 1, right: false },
  "-": { bp: 1, right: false },
  "*": { bp: 2, right: false },
  "/": { bp: 2, right: false },
  "**": { bp: 3, right: true },
};

/**
 * The Pratt loop.
 *
 * TODO: implement this.
 *
 *   let left = parseAtom(c)
 *   loop:
 *     peek the next token; stop unless it is a binary operator
 *     look up its binding power; stop if bp < minBP
 *     consume the operator
 *     const right = parseExpr(c, <HERE>)
 *     left = { n: "bin", op, l: left, r: right }
 *   return left
 *
 *   <HERE> is the entire exercise. For a LEFT-associative operator pass
 *   bp + 1; for a RIGHT-associative one pass bp.
 *
 *   Why: with bp + 1, an operator of the same precedence fails the
 *   `bp < minBP` check, the loop ends, the left side closes off, and the
 *   tree nests left. With plain bp it passes, recursion swallows it, and
 *   the tree nests right. One character decides the shape of the tree.
 *
 *   Get `10 - 3 - 2` = 5 and `2 ** 3 ** 2` = 512 and you have it.
 */
export function parseExpr(c: Cursor, minBP: number): Node {
  let left = parseAtom(c);

  while (true) {
    let token = c.peek();
    if (token.t != "op") break;
    const bp = BP[token.v];
    if (bp.bp < minBP) break;

    c.next();

    const right = parseExpr(c, bp.right ? bp.bp : bp.bp + 1);

    left = { n: "bin", op: token.v, l: left, r: right };
  }

  return left;
}

/**
 * TODO: implement this.
 *
 *   - a number token becomes { n: "num", v }
 *   - a "-" here is UNARY minus: { n: "neg", e: parseAtom(c) }.
 *     It belongs here, not in the binary loop. Write down in NOTES.md
 *     whether it binds tighter than ** in your language; it differs.
 *   - "(" parses a full expression and then MUST consume the ")".
 *     Forgetting that consume gives you an infinite loop, not an error.
 *   - anything else throws
 */
export function parseAtom(c: Cursor): Node {
  const token = c.next();
  if (token.t == "num") return { n: "num", v: token.v };
  if (token.t == "op" && token.v == "-") return { n: "neg", e: parseAtom(c) };
  if (token.t == "lparen") {
    const e = parseExpr(c, 0);
    c.expect("rparen");
    return e;
  }
  throw new Error("bad");
}

export function parse(src: string): Node {
  return parseExpr(cursor(tokenize(src)), 0);
}
