/**
 * A seeded PRNG. Without one, failures are not reproducible and the whole
 * tool is useless in CI.
 *
 * TODO: implement this (a linear congruential generator is plenty):
 *   s = (s * 1664525 + 1013904223) >>> 0, return s / 2**32
 *   Use Math.imul for the multiply.
 */
export function rng(seed: number): () => number {
  throw new Error("TODO: rng");
}

export type Gen<T> = {
  gen: (r: () => number) => T;
  /** "Smaller" candidates, most interesting first. */
  shrink: (v: T) => T[];
};

/**
 * TODO: implement this.
 *
 *   Bias it DELIBERATELY toward the edges: 0, 1, -1, max, -max should come
 *   up far more often than uniform random would give. Uniform random almost
 *   never hits the values that break things, which is why a naive generator
 *   finds nothing.
 *
 *   shrink: toward zero. [0, trunc(v/2), v-1 or v+1] is a good set.
 */
export function int(max = 100): Gen<number> {
  throw new Error("TODO: int");
}

/**
 * TODO: implement this.
 *   gen: a random length up to maxLen, each element from `el`.
 *   shrink: the empty array, the first half, and each one-element-removed
 *           variant. Those three families cover most real shrinking.
 */
export function array<T>(el: Gen<T>, maxLen = 20): Gen<T[]> {
  throw new Error("TODO: array");
}

/** TODO: implement. Picks one of the generators at random. */
export function oneOf<T>(...gens: Gen<T>[]): Gen<T> {
  throw new Error("TODO: oneOf");
}

export class PropertyFailure extends Error {
  readonly seed: number;
  readonly counterexample: unknown;
  readonly reason: unknown;
  constructor(seed: number, counterexample: unknown, reason: unknown) {
    super(`property failed (seed=${seed}) on ${JSON.stringify(counterexample)}\n  ${reason}`);
    this.seed = seed;
    this.counterexample = counterexample;
    this.reason = reason;
  }
}

/**
 * TODO: implement this.
 *
 *   Run `runs` cases. On the first failure, shrink it, then throw a
 *   PropertyFailure carrying the SEED and the minimal counterexample.
 *
 *   Printing the seed is not optional: it is what turns "it failed once on
 *   CI" into something you can reproduce locally.
 */
export function forAll<T>(
  g: Gen<T>,
  prop: (v: T) => void,
  runs = 100,
  seed = Date.now() >>> 0,
): void {
  throw new Error("TODO: forAll");
}

/**
 * TODO: implement this.
 *
 *   Repeatedly try every shrink candidate. Keep one only if it fails with
 *   THE SAME kind of error — otherwise you report a different bug than the
 *   one you found, which is worse than not shrinking at all.
 *
 *   Stop when no candidate improves on the current best.
 */
export function shrinkLoop<T>(g: Gen<T>, bad: T, prop: (v: T) => void): T {
  throw new Error("TODO: shrinkLoop");
}
