import type { Re } from "./parse.ts";

/**
 * `cont` is "what comes after me". Passing the continuation is what makes
 * backtracking expressible without an explicit stack.
 */
export type Cont = (pos: number) => number | null;

/**
 * Returns the position after a successful match, or null.
 *
 * TODO: implement this.
 *
 *   char:   s[pos] === node.c ? cont(pos + 1) : null
 *   any:    pos < s.length ? cont(pos + 1) : null
 *   class:  test s[pos] against the ranges, honouring `neg`
 *   concat: thread the continuation through the children — the first child's
 *           continuation is "match the rest of them"
 *   alt:    try each child with the SAME cont; first success wins
 *   star:   THE EXERCISE. Greedy, but it must give characters back:
 *
 *             const try_ = (p) => {
 *               const more = m(node.x, s, p, (q) => (q === p ? null : try_(q)));
 *               return more !== null ? more : cont(p);
 *             };
 *             return try_(pos);
 *
 *           That last line is the whole project. It first tries one more
 *           repetition; if the REST OF THE PATTERN fails down that path, it
 *           falls back to stopping here. The `q === p` guard stops an
 *           infinite loop when the body matches the empty string.
 *   plus:   one mandatory repetition, then star
 *   opt:    try with, then without
 */
export function m(node: Re, s: string, pos: number, cont: Cont): number | null {
  throw new Error("TODO: m");
}

/**
 * Unanchored search: try every start position.
 *
 * TODO: implement this.
 */
export function test(node: Re, s: string): boolean {
  throw new Error("TODO: test");
}
