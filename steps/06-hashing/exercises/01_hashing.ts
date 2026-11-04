// 01 — a hash function, and what "spreads" means
//
// A hash function turns a key into a number. Take that number modulo the
// bucket count and you have an index. The quality you need is not
// cryptographic strength — it is UNIFORMITY: similar keys must land far
// apart, or every bucket but one stays empty.

/**
 * FNV-1a. Eight lines, and a real function used in real systems.
 *
 * TODO: implement this.
 *
 *   h = 0x811c9dc5                    (the offset basis)
 *   for each char: h ^= code; h = h * 0x01000193
 *   return h >>> 0
 *
 *   TWO THINGS THAT ARE NOT OPTIONAL:
 *
 *   Use Math.imul for the multiply. Plain `*` goes through a float, loses
 *   the low bits above 2^53, and quietly ruins the distribution — the
 *   function still "works", it just stops spreading, which is the worst
 *   kind of broken.
 *
 *   Finish with `>>> 0`. Bitwise ops in JavaScript produce SIGNED 32-bit
 *   integers, and a negative hash gives a negative modulo and an
 *   out-of-range bucket index.
 */
export function fnv1a(key: string): number {
  throw new Error("TODO: fnv1a");
}

/**
 * Returns how many keys land in each of `buckets` buckets.
 *
 * TODO: implement this. Used by the test to prove your hash spreads.
 */
export function distribution(keys: string[], buckets: number, hash: (k: string) => number): number[] {
  throw new Error("TODO: distribution");
}

/**
 * The chi-squared statistic for a distribution against a uniform
 * expectation. Lower is more uniform; for n keys in b buckets, a good hash
 * gives roughly b.
 *
 * TODO: implement this.
 *
 *   expected = keys / buckets
 *   sum over buckets of (observed - expected)^2 / expected
 *
 *   You are writing this so the test can MEASURE your hash rather than
 *   eyeballing it. "It looks fine" is how bad hashes ship.
 */
export function chiSquared(counts: number[]): number {
  throw new Error("TODO: chiSquared");
}
