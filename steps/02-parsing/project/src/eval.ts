import type { Node } from "./parser.ts";

/**
 * TODO: implement this. A recursive switch on node.n — about eight lines.
 *
 *   Notice there is no precedence logic here at all. The tree shape already
 *   encodes it, which is exactly why getting the tree right was worth the
 *   effort.
 */
export function evaluate(n: Node): number {
  throw new Error("TODO: evaluate");
}

/**
 * Renders the tree fully parenthesised: "((1 + (2 * 3)) - 4)".
 *
 * TODO: implement this.
 *
 *   Ten lines, and it is your debugger for the rest of the project — when
 *   precedence is wrong you SEE it instead of guessing.
 */
export function show(n: Node): string {
  throw new Error("TODO: show");
}
