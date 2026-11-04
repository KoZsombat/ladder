// 02 — invariants as code
//
// An invariant is something that must be true after EVERY operation. The
// habit this exercise builds: write it as an executable function, call it
// after each operation in your tests, and let it point at the operation
// that broke things instead of the one three steps later that noticed.
//
// It is the cheapest debugging tool in this repo and the one people skip.

export type Pair = { key: string; value: number };

/**
 * A tiny "cache": a map plus an array kept in recency order. Deliberately
 * naive — the point is the checker, not the structure.
 */
export class Toy {
  map = new Map<string, number>();
  order: string[] = [];           // most recent first

  put(key: string, value: number, capacity: number): void {
    if (!this.map.has(key)) this.order.unshift(key);
    else this.order = [key, ...this.order.filter((k) => k !== key)];
    this.map.set(key, value);
    while (this.map.size > capacity) {
      const victim = this.order.pop()!;
      this.map.delete(victim);
    }
  }
}

/**
 * Throws a DESCRIPTIVE error if the toy's two structures disagree.
 *
 * TODO: implement this. Check all four:
 *
 *   1. order has no duplicates
 *   2. every key in order is in the map
 *   3. every key in the map is in order
 *   4. order.length === map.size
 *
 *   Check MEMBERSHIP before counts. A size mismatch is true but useless on
 *   its own; naming the offending key is what turns the message into a lead.
 *
 *   Each failure message should name the offending key. "invariant broken"
 *   on its own tells you nothing at 2am; "key 'b' is in the list but not
 *   the map" tells you which operation to look at.
 */
export function checkToy(t: Toy): void {
  throw new Error("TODO: checkToy");
}

/**
 * Runs a sequence of puts, calling the checker after each one, and returns
 * the index of the first operation that broke the invariant (or -1).
 *
 * TODO: implement this.
 *
 *   This is the pattern worth stealing: find the FIRST bad operation, not
 *   the final bad state. Step 08 turns the same idea into a shrinker.
 */
export function firstBreak(ops: Pair[], capacity: number): number {
  throw new Error("TODO: firstBreak");
}
