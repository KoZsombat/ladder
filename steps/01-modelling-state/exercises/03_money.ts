// 03 — integer money, and a greedy algorithm that is wrong in general
//
// Two ideas, both of which the vending machine needs immediately.
//
// FIRST: never store money in a float. 0.1 + 0.2 is 0.30000000000000004,
// and over a few thousand transactions that drift becomes real. Store
// integer minor units — fillér, cents — or in this case whole forints,
// and format for display at the very last moment.
//
// SECOND: the greedy change-making algorithm. Take as many of the largest
// coin as fit, then the next, and so on. It is obvious, it is fast, and it
// is NOT correct for every coin set — which is a genuinely useful thing to
// have felt once.

export type Coin = 5 | 10 | 20 | 50 | 100 | 200;
export const FORINT: Coin[] = [200, 100, 50, 20, 10, 5]; // descending

/**
 * Formats integer forints for display: 1234 becomes "1 234 Ft".
 *
 * TODO: implement this. Thin space (U+00A0) between groups of three.
 *
 *   The point is that the formatting lives HERE, at the edge, and nowhere
 *   else in the program ever sees a non-integer amount.
 */
export function formatFt(amount: number): string {
  throw new Error("TODO: formatFt");
}

/**
 * Greedy change-making from an UNLIMITED supply of the given coins.
 * Returns the coins, largest first, or null when the amount cannot be made.
 *
 * TODO: implement this.
 *
 *   For each coin from largest to smallest, take as many as fit, then move
 *   on. If you reach the end with a remainder, return null.
 *
 *   `coins` is a parameter rather than a constant on purpose: the next
 *   function needs you to run it against a different set.
 */
export function greedyChange(amount: number, coins: number[]): number[] | null {
  throw new Error("TODO: greedyChange");
}

/**
 * The SMALLEST number of coins that makes `amount`, or null.
 *
 * TODO: implement this with dynamic programming.
 *
 *   best[0] = 0, and best[n] = 1 + min(best[n - c]) over every coin c that
 *   fits. Walk n upward from 1 to amount. Thirteen lines.
 *
 *   You are writing this ONLY so that the test below can compare it against
 *   the greedy answer and show you where greedy fails. It is also the
 *   canonical introduction to DP, which entry F01 covers properly: write
 *   the obvious recursion, notice it recomputes subproblems, cache them.
 */
export function fewestCoins(amount: number, coins: number[]): number | null {
  throw new Error("TODO: fewestCoins");
}
