// 01 — "what comes after me", as a function
//
// A continuation is the rest of the computation, passed as a callback.
// It sounds abstract and it is the cleanest way to express backtracking:
// instead of returning "I matched", a matcher asks "if I consume this much,
// can YOU finish?" — and tries something else when the answer is no.
//
// This exercise uses coin-counting rather than regex, so the mechanism is
// visible without any grammar in the way.

export type Cont = (remaining: number) => boolean;

/**
 * Can `amount` be made EXACTLY from the given coin values, using any
 * number of each?
 *
 * TODO: implement this with continuations.
 *
 *   For each coin, try taking it (recursing on amount - coin) and ask the
 *   continuation whether the rest works out. If no coin leads anywhere,
 *   return false — that is the backtrack.
 *
 *   The base case: amount === 0 means success, so call cont(0).
 *
 *   Yes, plain recursion solves this too. You are writing it in this shape
 *   because the regex matcher needs exactly this shape, and meeting it on
 *   a problem you already understand is much easier.
 */
export function canMake(amount: number, coins: number[], cont: Cont): boolean {
  throw new Error("TODO: canMake");
}

/**
 * GREEDY WITH GIVE-BACK. Takes as many of `coin` as possible, then asks
 * the continuation. If that fails, takes one fewer, and so on down to zero.
 *
 * TODO: implement this.
 *
 *   This is the star operator, with the regex removed:
 *
 *     take as many as fit
 *     ask cont
 *     if it failed, take one fewer and ask again
 *     ... down to taking none at all
 *
 *   Returns the number taken on success, or null.
 *
 *   The give-back is the entire exercise. A version that takes the maximum
 *   and gives up is the bug that makes `a*a` fail to match `aaa`.
 */
export function greedyTake(
  amount: number,
  coin: number,
  cont: (remaining: number) => boolean,
): number | null {
  throw new Error("TODO: greedyTake");
}
