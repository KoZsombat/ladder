/**
 * FNV-1a. Eight lines, and a real function used in real systems.
 *
 * TODO: implement this.
 *
 *   start with the offset basis 0x811c9dc5
 *   for each character: XOR in its code, then multiply by 0x01000193
 *   use Math.imul for the multiply — plain * goes through a float and
 *   loses the low bits, which quietly ruins the distribution
 *   finish with >>> 0 so the result is unsigned; a negative hash gives a
 *   negative modulo and an out-of-range bucket index
 */
export function fnv1a(key: string): number {
  throw new Error("TODO: fnv1a");
}

type Entry<V> = { key: string; value: V; next: Entry<V> | null };

export class HashMap<V> {
  private buckets: (Entry<V> | null)[] = new Array(16).fill(null);
  private count = 0;

  /** For the tests: how many buckets there currently are. */
  get capacity(): number {
    return this.buckets.length;
  }
  get size(): number {
    return this.count;
  }

  private index(key: string): number {
    return fnv1a(key) % this.buckets.length;
  }

  /**
   * TODO: implement this.
   *
   *   Walk the chain at the right bucket. If the key is already there,
   *   overwrite the value and return — the count must NOT grow, or your
   *   load factor drifts and you resize forever.
   *
   *   Otherwise prepend a new entry, increment the count, and resize when
   *   count / buckets.length exceeds 0.75.
   */
  set(key: string, value: V): void {
    throw new Error("TODO: set");
  }

  /** TODO: implement. Walk the chain, return undefined if not found. */
  get(key: string): V | undefined {
    throw new Error("TODO: get");
  }

  /** TODO: implement. Returns whether anything was removed. */
  delete(key: string): boolean {
    throw new Error("TODO: delete");
  }

  /**
   * TODO: implement this.
   *
   *   Allocate a bucket array of DOUBLE the size, then RE-HASH every entry
   *   into it. You cannot copy buckets across: the index depends on the
   *   bucket count, so entry positions all change.
   *
   *   Doubling is what makes the amortised cost O(1) — the expensive resize
   *   is paid for by all the cheap inserts before it.
   */
  private resize(): void {
    throw new Error("TODO: resize");
  }

  /**
   * TODO: implement this.
   *
   *   Then write in NOTES.md what order the keys come out in, and why you
   *   must never depend on it.
   */
  *keys(): IterableIterator<string> {
    throw new Error("TODO: keys");
  }
}
