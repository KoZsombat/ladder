// 02 — constant folding: your first optimising pass
//
// When both children of a node are literals, the answer is known at compile
// time. Emit the result instead of the three instructions that would
// compute it.
//
// Four lines, and it is a real optimisation pass of the kind every compiler
// has dozens of. It also introduces the question every pass has to answer:
// is this transformation SAFE?

import type { Node } from "./01_post_order.ts";

/**
 * Returns an equivalent tree with constant subtrees collapsed.
 *
 * TODO: implement this.
 *
 *   Fold the children FIRST (bottom-up), then check whether both came back
 *   as numbers. If so, compute and return a single num node.
 *
 *   Folding top-down instead misses nested cases: (1+2)*(3+4) only collapses
 *   fully if the inner sums are folded before the multiplication is examined.
 *
 *   SAFETY: do NOT fold a division by zero. Leave it alone and let it fail
 *   at runtime, where the error message can say what the program was doing.
 *   A compiler that crashes while optimising dead code is a famously
 *   annoying class of bug.
 */
export function fold(n: Node): Node {
  throw new Error("TODO: fold");
}

/**
 * Counts the nodes in a tree, so the test can prove folding did something.
 *
 * TODO: implement this.
 */
export function size(n: Node): number {
  throw new Error("TODO: size");
}
