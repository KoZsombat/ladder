// 02 — a glob matcher: backtracking on strings
//
// Globs are regex with the grammar removed: just literals, ? for any one
// character, and * for any run. That makes them the perfect place to get
// the string-position threading right before the project adds parsing,
// alternation and character classes on top.
//
// The matcher returns a POSITION, not a boolean. Concatenation threads that
// position through: match the first part, feed its result to the second.
// That threading is what makes the whole thing compose.

export type Cont = (pos: number) => number | null;

/**
 * Matches `pat` against `s` starting at `pos`, calling `cont` with the
 * position after the match. Returns the final position or null.
 *
 * TODO: implement this.
 *
 *   Walk the pattern from index `pi`:
 *   - end of pattern -> cont(pos)
 *   - "?"  -> consume one character if there is one, recurse at pi+1
 *   - "*"  -> the greedy give-back. Try consuming as MANY characters as
 *             possible, then fewer, then fewer... each time asking whether
 *             the rest of the pattern matches from there.
 *   - else -> the characters must be equal; recurse
 *
 *   The `*` case is the exercise. Count downward from (s.length - pos) to 0
 *   and return the first success. Counting UPWARD gives you a LAZY star,
 *   which is also a valid operator (`*?` in real regex) — try both and see
 *   which positions they return.
 */
export function matchFrom(pat: string, pi: number, s: string, pos: number, cont: Cont): number | null {
  throw new Error("TODO: matchFrom");
}

/** Anchored match: the whole string must be consumed. */
export function matches(pat: string, s: string): boolean {
  return matchFrom(pat, 0, s, 0, (p) => (p === s.length ? p : null)) !== null;
}

/**
 * Returns how many times `matchFrom` was entered for this pattern/input —
 * a crude cost counter, so the test can show you the blow-up.
 *
 * TODO: implement this by copying matchFrom and incrementing a counter,
 * or by threading a counter object through. Either is fine.
 */
export function matchCost(pat: string, s: string): number {
  throw new Error("TODO: matchCost");
}
