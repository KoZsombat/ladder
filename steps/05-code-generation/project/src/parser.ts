import { tokenize, cursor, type Cursor } from "./lexer.ts";

export type Node =
  | { n: "num"; v: number }
  | { n: "bin"; op: string; l: Node; r: Node }
  | { n: "neg"; e: Node };

const BP: Record<string, { bp: number; right: boolean }> = {
  "+": { bp: 1, right: false }, "-": { bp: 1, right: false },
  "*": { bp: 2, right: false }, "/": { bp: 2, right: false },
  "**": { bp: 3, right: true },
};

// Reference copy of your project-01 Pratt parser.
export function parseExpr(c: Cursor, minBP: number): Node {
  let left = parseAtom(c);
  for (;;) {
    const tok = c.peek();
    if (tok.t !== "op") break;
    const info = BP[tok.v];
    if (!info || info.bp < minBP) break;
    c.next();
    const right = parseExpr(c, info.right ? info.bp : info.bp + 1);
    left = { n: "bin", op: tok.v, l: left, r: right };
  }
  return left;
}

export function parseAtom(c: Cursor): Node {
  const tok = c.next();
  if (tok.t === "num") return { n: "num", v: tok.v };
  if (tok.t === "op" && tok.v === "-") return { n: "neg", e: parseAtom(c) };
  if (tok.t === "punct" && tok.v === "(") {
    const e = parseExpr(c, 0);
    c.expect("punct", ")");
    return e;
  }
  throw new Error(`unexpected token ${JSON.stringify(tok)}`);
}

export const parse = (src: string) => parseExpr(cursor(tokenize(src)), 0);

/** The interpreter you already have — kept so the differential test can run. */
export function evaluate(n: Node): number {
  switch (n.n) {
    case "num": return n.v;
    case "neg": return -evaluate(n.e);
    case "bin": {
      const a = evaluate(n.l), b = evaluate(n.r);
      switch (n.op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return (a / b) | 0;
        case "**": return a ** b;
        default: throw new Error(`bad op ${n.op}`);
      }
    }
  }
}
