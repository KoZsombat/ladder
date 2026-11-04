// 02 — shrinking, and the property shapes worth knowing
//
// A random failure arrives as a 40-element mess. Shrinking repeatedly tries
// smaller candidates, keeping any that STILL FAIL, until none improve.
// Without it, property testing produces failures nobody debugs.
//
// The subtle rule: a candidate only counts if it fails for the SAME REASON.
// Otherwise you report a different bug than the one you found, which is
// worse than not shrinking at all.

import type { Gen } from "./01_generators.ts";

/**
 * Repeatedly shrinks `bad` while the property still fails.
 *
 * TODO: implement this.
 *
 *   Loop: for each candidate from g.shrink(best), if it still fails, take
 *   it and start the loop again. If none do, return best.
 *
 *   "Still fails" means the property throws. Compare the error's MESSAGE
 *   with the original, so a candidate that throws something different is
 *   rejected.
 */
export function shrink<T>(g: Gen<T>, bad: T, prop: (v: T) => void): T {
  throw new Error("TODO: shrink");
}

/**
 * The property shapes. There are only a handful, and finding them is the
 * actual skill — the machinery is twenty lines.
 *
 * TODO: implement these three as predicates you can hand to a runner.
 *
 *   roundTrip(encode, decode): decode(encode(x)) must deep-equal x.
 *     Your parser plus your printer is exactly this shape.
 *
 *   idempotent(f): f(f(x)) must deep-equal f(x). Sorting, normalising,
 *     formatting and `fold` from step 05 are all idempotent.
 *
 *   oracle(mine, theirs): both must agree. This is the differential test
 *     from step 05 again, and the strongest property you can have when a
 *     reference implementation exists.
 */
export function roundTrip<A, B>(encode: (a: A) => B, decode: (b: B) => A): (a: A) => void {
  throw new Error("TODO: roundTrip");
}

export function idempotent<A>(f: (a: A) => A): (a: A) => void {
  throw new Error("TODO: idempotent");
}

export function oracle<A, B>(mine: (a: A) => B, theirs: (a: A) => B): (a: A) => void {
  throw new Error("TODO: oracle");
}
