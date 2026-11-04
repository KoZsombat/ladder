// 01 — a doubly linked list with sentinels
//
// Why doubly: on a cache hit you must move a node to the front, which means
// unlinking it from the MIDDLE. With only `next` pointers you cannot find
// the previous node in O(1). The `prev` pointer is the entire reason for
// the "doubly".
//
// Why sentinels: two dummy nodes at the ends mean the list is never empty,
// so unlink and insert have no null checks at all. Two wasted objects,
// half the bugs.

export type N = { key: string; prev: N; next: N };

export type List = {
  head: N; // head.next is the FIRST real node
  tail: N; // tail.prev is the LAST real node
};

/**
 * TODO: implement this.
 *
 *   Create two node-shaped objects and wire head.next = tail and
 *   tail.prev = head. Their `key` is never read; `{} as N` is fine.
 */
export function emptyList(): List {
  throw new Error("TODO: emptyList");
}

/**
 * TODO: implement this. Two assignments, no null checks.
 *
 *   n.prev.next = n.next
 *   n.next.prev = n.prev
 *
 *   Because of the sentinels this is correct even when n is the only real
 *   node in the list. Try writing the version with null checks to see what
 *   you are avoiding.
 */
export function unlink(n: N): void {
  throw new Error("TODO: unlink");
}

/**
 * Splices n in directly after head, making it the most recent.
 *
 * TODO: implement this. Four assignments, and the ORDER matters: write
 * n's pointers first, then fix up the two neighbours, or you lose the
 * reference you still need.
 */
export function toFront(list: List, n: N): void {
  throw new Error("TODO: toFront");
}

/** TODO: implement. The keys from most to least recent. */
export function keys(list: List): string[] {
  throw new Error("TODO: keys");
}
