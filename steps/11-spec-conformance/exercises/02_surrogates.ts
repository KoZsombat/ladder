// 02 — UTF-16 surrogate pairs
//
// Where half your conformance-suite failures will come from.
//
// JSON's \uXXXX escape names a UTF-16 CODE UNIT, not a character. Anything
// beyond U+FFFF is written as TWO escapes: a high surrogate in D800-DBFF
// followed by a low surrogate in DC00-DFFF. The real code point is
//
//     0x10000 + ((hi - 0xD800) << 10) + (lo - 0xDC00)
//
// A lone surrogate — a high one with no partner, or a low one on its own —
// is where implementations disagree, which is why the suite has a whole
// category for it.

/** TODO: implement. True for D800-DBFF. */
export function isHighSurrogate(u: number): boolean {
  throw new Error("TODO: isHighSurrogate");
}

/** TODO: implement. True for DC00-DFFF. */
export function isLowSurrogate(u: number): boolean {
  throw new Error("TODO: isLowSurrogate");
}

/** TODO: implement the combination formula above. */
export function combine(hi: number, lo: number): number {
  throw new Error("TODO: combine");
}

/**
 * Decodes a JSON string BODY (no surrounding quotes) into a real string.
 *
 * TODO: implement this.
 *
 *   Handle \" \\ \/ \b \f \n \r \t and \uXXXX.
 *
 *   On a \u that yields a high surrogate, you MUST look at what follows:
 *   if it is another \u giving a low surrogate, combine them with
 *   String.fromCodePoint. Otherwise throw — a lone high surrogate is not
 *   representable and silently emitting a replacement character is how
 *   data gets corrupted quietly.
 *
 *   Also reject a raw control character (below 0x20) that was not escaped.
 *   The spec forbids them, and a literal newline inside a string is the
 *   most common real-world instance.
 */
export function decodeStringBody(body: string): string {
  throw new Error("TODO: decodeStringBody");
}
