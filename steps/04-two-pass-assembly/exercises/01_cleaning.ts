// 01 — cleaning source text
//
// Every tool that reads a file does this first: strip comments, trim, drop
// blanks, and classify what is left. It is unglamorous and it is where a
// surprising share of bugs live, because a half-stripped comment or a
// stray tab shows up as a parse error three stages later.

export type Line =
  | { kind: "label"; name: string }
  | { kind: "instr"; op: string; arg?: string };

/**
 * TODO: implement this.
 *
 *   For each line of `src`:
 *   - remove everything from the first ";" onward
 *   - trim
 *   - skip it if it is now empty
 *   - a line ending in ":" is a label (without the colon)
 *   - otherwise split on whitespace: the first word is the op, an optional
 *     second word is the argument
 *
 *   Lowercase the op. Decide once whether PUSH and push are the same thing;
 *   whatever you decide, apply it in BOTH passes of the project, or your
 *   label addresses and your emitted code will disagree.
 */
export function clean(src: string): Line[] {
  throw new Error("TODO: clean");
}
