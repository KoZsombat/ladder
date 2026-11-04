// 01 — a grammar is a surface with edges
//
// JSON's number grammar:
//
//     -?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?
//
// Your language's built-in number parser is FAR more permissive than that.
// JavaScript's Number() accepts Infinity, hex, binary, a leading +, a bare
// .5, a trailing 1., whitespace and the empty string. Handing it unvalidated
// text is how a parser silently accepts documents the spec forbids.
//
// The discipline: validate the SHAPE yourself, then convert.

/**
 * Returns true only for text that is a complete, legal JSON number.
 *
 * TODO: implement this.
 *
 *   Allowed:  0  -0  1  -1  1.5  1e10  1E+10  1e-10  -1.5e3  12345
 *   Forbidden: 01  +1  .5  1.  1.e3  Infinity  NaN  0x10  ""  " 1"  1_000
 *
 *   The leading-zero rule is the one people miss: "0" is fine, "01" is not,
 *   and "0.5" is fine. The grammar says a number starts with either a lone
 *   0 or a nonzero digit followed by any digits.
 *
 *   Write the regex with ^ and $ anchors, or you will accept "1abc".
 */
export function isJsonNumber(text: string): boolean {
  throw new Error("TODO: isJsonNumber");
}

/**
 * Reads a JSON number starting at `i`, returning its value and the index
 * just past it. Throws on anything illegal.
 *
 * TODO: implement this.
 *
 *   Match the grammar against src.slice(i), take the matched text, convert
 *   with Number(), and return [value, i + matched.length].
 *
 *   Because you matched the shape first, the Number() call is now safe.
 */
export function readNumber(src: string, i: number): [number, number] {
  throw new Error("TODO: readNumber");
}
