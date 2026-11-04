// 01 — seeded randomness and edge-biased generators
//
// Two rules that decide whether a property test finds anything.
//
// SEEDED: a failure you cannot reproduce is a failure nobody debugs. Print
// the seed, accept it as an argument, and the same run happens again.
//
// EDGE-BIASED: uniform random almost never produces 0, 1, -1, the empty
// string or the maximum integer — which is precisely where the bugs are.
// A generator that does not deliberately over-sample the edges will run ten
// thousand cases and find nothing.

export type Gen<T> = {
  gen: (r: () => number) => T;
  shrink: (v: T) => T[];
};

/**
 * A linear congruential generator.
 *
 * TODO: implement this.
 *
 *   s = (s * 1664525 + 1013904223) >>> 0, and return s / 2**32.
 *   Use Math.imul for the multiply, same reason as step 06.
 */
export function rng(seed: number): () => number {
  throw new Error("TODO: rng");
}

/**
 * TODO: implement this.
 *
 *   About 20% of the time, return one of [0, 1, -1, max, -max].
 *   Otherwise a uniform value in [-max, max].
 *
 *   shrink: candidates "closer to zero", most aggressive first —
 *   [0, trunc(v/2), v-1 or v+1]. An already-zero value shrinks to nothing.
 */
export function int(max = 100): Gen<number> {
  throw new Error("TODO: int");
}

/**
 * TODO: implement this.
 *
 *   gen: a random length in [0, maxLen], each element from `el`.
 *   shrink: three families, in this order —
 *     the empty array, the first half, and each one-element-removed variant.
 *   Those three cover most real shrinking: drop everything, halve, or
 *   bisect by removal.
 */
export function array<T>(el: Gen<T>, maxLen = 20): Gen<T[]> {
  throw new Error("TODO: array");
}
