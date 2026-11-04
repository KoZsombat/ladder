import { tokenize, cursor, type Cursor } from "./lexer.ts";
import type { Expr, Stmt } from "./ast.ts";

const BP: Record<string, { bp: number; right: boolean }> = {
  "<": { bp: 1, right: false }, ">": { bp: 1, right: false },
  "==": { bp: 1, right: false }, "!=": { bp: 1, right: false },
  "+": { bp: 2, right: false }, "-": { bp: 2, right: false },
  "*": { bp: 3, right: false }, "/": { bp: 3, right: false }, "%": { bp: 3, right: false },
};

// Your project-01 parser, extended with variables. Provided working.
export function parseExpr(c: Cursor, minBP: number): Expr {
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

function parseAtom(c: Cursor): Expr {
  const tok = c.next();
  if (tok.t === "num") return { n: "num", v: tok.v };
  if (tok.t === "ident") return { n: "var", name: tok.v };
  if (tok.t === "op" && tok.v === "-") return { n: "neg", e: parseAtom(c) };
  if (tok.t === "punct" && tok.v === "(") {
    const e = parseExpr(c, 0);
    c.expect("punct", ")");
    return e;
  }
  throw new Error(`unexpected token ${JSON.stringify(tok)}`);
}

/**
 * The SECOND entry point your parser now needs. Until this project
 * everything produced a value; `x = 5` does not.
 *
 * TODO: implement this.
 *
 *   - `print <expr>`                      -> { s: "print", e }
 *   - `if <expr> { <stmts> }`             -> { s: "if", cond, body }
 *   - `while <expr> { <stmts> }`          -> { s: "while", cond, body }
 *   - `<ident> = <expr>`                  -> { s: "assign", name, e }
 *   - anything else                       -> { s: "expr", e }
 *
 *   For the assignment case you need ONE token of lookahead past the
 *   identifier to see the "=". The cursor's `at` helper only looks at the
 *   current token, so either add a two-token peek or parse the expression
 *   and check whether what came back was a bare variable followed by "=".
 *   Either is fine; pick one and say why in a comment.
 *
 *   Statements are separated by ";" or by newlines; the lexer has already
 *   thrown newlines away, so just allow an optional ";" after each.
 */
export function parseStmt(c: Cursor): Stmt {
  throw new Error("TODO: parseStmt");
}

/**
 * TODO: implement this. Parse statements until `end` (a token type/value
 * pair) or end of input, and return the list.
 */
export function parseBlock(c: Cursor, endPunct?: string): Stmt[] {
  throw new Error("TODO: parseBlock");
}

export function parseProgram(src: string): Stmt[] {
  return parseBlock(cursor(tokenize(src)));
}
