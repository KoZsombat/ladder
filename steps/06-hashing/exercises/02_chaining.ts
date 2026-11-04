// 02 — collisions, chaining and amortised resize
//
// Collisions are not an edge case, they are the normal case. With 23 keys
// in 365 buckets you already have a 50% chance of one — the birthday
// paradox, and the reason "it worked in my test with 5 keys" means nothing.
//
// Chaining: each bucket holds a linked list. Simple, and what you will
// write in the project.

export type Entry = { key: string; value: number; next: Entry | null };

/**
 * Prepends a new entry, or overwrites an existing one with the same key.
 * Returns the new head of the chain and whether a NEW entry was added.
 *
 * TODO: implement this.
 *
 *   Walk the chain first looking for the key. On a hit, overwrite and
 *   report added = false.
 *
 *   That flag matters more than it looks: if an overwrite increments your
 *   entry count, the load factor drifts upward on every update and the
 *   table resizes forever on a workload that never grows.
 */
export function chainSet(head: Entry | null, key: string, value: number): [Entry, boolean] {
  throw new Error("TODO: chainSet");
}

/** TODO: implement. Returns undefined when the key is absent. */
export function chainGet(head: Entry | null, key: string): number | undefined {
  throw new Error("TODO: chainGet");
}

/**
 * Removes a key, returning the new head and whether anything was removed.
 *
 * TODO: implement this.
 *
 *   The head case and the middle case are different, which is the usual
 *   linked-list annoyance. Rebuilding the chain without the matching entry
 *   is a legitimate and much simpler approach — take it if you prefer.
 */
export function chainDelete(head: Entry | null, key: string): [Entry | null, boolean] {
  throw new Error("TODO: chainDelete");
}

/**
 * Redistributes every entry of `buckets` into a new array of `newSize`.
 *
 * TODO: implement this.
 *
 *   THE TRAP: you cannot copy buckets across. The index is
 *   hash(key) % bucketCount, and the count just changed — so every entry
 *   has to be RE-HASHED into its new position.
 *
 *   Doubling is what makes the amortised cost O(1): the occasional
 *   expensive resize is paid for by all the cheap inserts before it.
 */
export function rehash(
  buckets: (Entry | null)[],
  newSize: number,
  hash: (k: string) => number,
): (Entry | null)[] {
  throw new Error("TODO: rehash");
}
