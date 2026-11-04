export type Token =
  | { t: "num"; v: number }
  | { t: "op"; v: "+" | "-" | "*" | "/" | "**" }
  | { t: "lparen" }
  | { t: "rparen" }
  | { t: "eof" };

/**
 * Turns source text into a flat list of tokens.
 *
 * TODO: implement this.
 *
 *   Walk an index through the string. For each position:
 *   - skip whitespace HERE (never in the parser)
 *   - a run of digits becomes { t: "num", v }
 *   - "**" must be matched BEFORE "*", or you tokenize it as two
 *     multiplications and `2 ** 3 ** 2` comes out as 64 instead of 512
 *   - + - * / ( ) become their tokens
 *   - anything else throws with the character and its position
 *
 *   Always push { t: "eof" } at the end. It saves the parser from checking
 *   for the end of the array on every peek.
 */
export function tokenize(src: string): Token[] {
  throw new Error("TODO: tokenize");
}
