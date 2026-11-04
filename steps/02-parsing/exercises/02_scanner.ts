// 02 — a scanner: characters in, tokens out
//
// The tokenizer is half of parsing, and keeping it SEPARATE from the parser
// is what makes both easy. The tokenizer worries about whitespace, comments
// and multi-character symbols. The parser never sees a character.
//
// Merging the two is what makes parsing feel impossible.

export type Token =
  | { t: "num"; v: number }
  | { t: "word"; v: string }
  | { t: "sym"; v: string }
  | { t: "eof" };

const SYMBOLS = ["<=", ">=", "==", "!=", "+", "-", "*", "/", "<", ">", "(", ")"];

/**
 * TODO: implement this.
 *
 *   Walk an index through the string:
 *   - skip spaces and tabs HERE, never in the parser
 *   - a run of digits becomes { t: "num" }
 *   - a letter or _ starts a run of letters/digits/_ and becomes { t: "word" }
 *   - otherwise match against SYMBOLS
 *   - anything else throws, naming the character and its index
 *   - always push { t: "eof" } last, so the parser never has to bounds-check
 *
 *   THE TRAP: SYMBOLS is ordered longest-first on purpose. If you match "<"
 *   before "<=", then "a <= b" tokenizes as "<" followed by "=" and your
 *   parser gets a baffling error three functions away. Use
 *   `SYMBOLS.find(s => src.startsWith(s, i))` and the order does the work.
 *
 *   The same trap bites in the calculator project with ** and *, where it
 *   turns 2 ** 3 ** 2 into 64 instead of 512.
 */
export function tokenize(src: string): Token[] {
  throw new Error("TODO: tokenize");
}
