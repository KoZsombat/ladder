# 12 — Hints

## Tier 1
Write `unlink`, `toFront` and `checkInvariant` first. With the invariant in
place, every later bug announces itself at the operation that caused it
instead of three operations later.

## Tier 2
```ts
private unlink(n: N<V>): void {
  n.prev.next = n.next;
  n.next.prev = n.prev;
}

private toFront(n: N<V>): void {
  n.next = this.head.next;
  n.prev = this.head;
  this.head.next.prev = n;
  this.head.next = n;
}

get(key: string): V | undefined {
  const n = this.map.get(key);
  if (!n) return undefined;
  this.unlink(n);
  this.toFront(n);
  return n.val;
}
```

## Tier 3
```ts
put(key: string, val: V): void {
  if (this.capacity <= 0) return;

  const existing = this.map.get(key);
  if (existing) {
    existing.val = val;
    this.unlink(existing);
    this.toFront(existing);
    return;
  }

  const n = { key, val } as N<V>;
  this.map.set(key, n);
  this.toFront(n);

  if (this.map.size > this.capacity) {
    const victim = this.tail.prev;
    this.unlink(victim);
    this.map.delete(victim.key);     // do NOT forget this line
  }
}

checkInvariant(): void {
  let n = 0;
  for (let p = this.head.next; p !== this.tail; p = p.next) {
    if (this.map.get(p.key) !== p) throw new Error(`map and list disagree at ${p.key}`);
    n++;
    if (n > this.map.size + 1) throw new Error("the list has a cycle");
  }
  if (n !== this.map.size) throw new Error(`list has ${n}, map has ${this.map.size}`);
}
```

## Tier 4 — stretch
Add hit/miss counters and print the hit rate on a skewed workload. Then add
a TTL per entry and decide whether expiry happens lazily on read or eagerly
with a sweep. That choice — lazy versus eager — is the same decision you
will make about compaction in project 13 and about garbage in project 21.
