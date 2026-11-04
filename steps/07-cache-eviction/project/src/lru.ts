type N<V> = { key: string; val: V; prev: N<V>; next: N<V> };

export class LRU<V> {
  private map = new Map<string, N<V>>();
  private head: N<V>; // head.next is the MOST recently used
  private tail: N<V>; // tail.prev is the LEAST recently used — the eviction victim
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    // Two sentinel nodes. They waste two objects and remove every null
    // check from the unlink and insert code. Half the bugs, for free.
    this.head = {} as N<V>;
    this.tail = {} as N<V>;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get size(): number {
    return this.map.size;
  }

  /** TODO: implement. Detach n from wherever it is. Two assignments. */
  private unlink(n: N<V>): void {
    throw new Error("TODO: unlink");
  }

  /** TODO: implement. Splice n in directly after head. Four assignments. */
  private toFront(n: N<V>): void {
    throw new Error("TODO: toFront");
  }

  /**
   * TODO: implement this.
   *
   *   A miss returns undefined. A HIT must also move the node to the front —
   *   without that it is not an LRU cache, it is a FIFO queue, and the
   *   acceptance trace below will catch you.
   */
  get(key: string): V | undefined {
    throw new Error("TODO: get");
  }

  /**
   * TODO: implement this.
   *
   *   Existing key: update the value AND move it to the front.
   *   New key: create the node, put it in the map, splice it to the front.
   *   Then, if size exceeds capacity, evict tail.prev — unlink it AND
   *   delete it from the map. Forgetting the map delete never gives a wrong
   *   answer; it just leaks memory forever, which is worse.
   *
   *   Handle capacity 0 and capacity 1. Both break naive implementations.
   */
  put(key: string, val: V): void {
    throw new Error("TODO: put");
  }

  /**
   * The invariant: the map and the list hold exactly the same entries, and
   * the map's value for a key is the node holding that key.
   *
   * TODO: implement this, and call it after EVERY operation in your tests.
   * It will catch more bugs than all your example tests combined.
   */
  checkInvariant(): void {
    throw new Error("TODO: checkInvariant");
  }

  /** Most-recent-first, for the tests. */
  keysMRU(): string[] {
    const out: string[] = [];
    for (let p = this.head.next; p !== this.tail; p = p.next) out.push(p.key);
    return out;
  }
}
