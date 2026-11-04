# 10 — Hints

## Tier 1
Write `fnv1a` and check its distribution before anything else. A bad hash
makes every other test look broken for the wrong reason.

## Tier 2
```ts
export function fnv1a(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
```

## Tier 3
```ts
set(key: string, value: V): void {
  const i = this.index(key);
  for (let e = this.buckets[i]; e; e = e.next) {
    if (e.key === key) { e.value = value; return; }
  }
  this.buckets[i] = { key, value, next: this.buckets[i] };
  this.count++;
  if (this.count / this.buckets.length > 0.75) this.resize();
}

private resize(): void {
  const old = this.buckets;
  this.buckets = new Array(old.length * 2).fill(null);
  for (const head of old) {
    for (let e = head; e; ) {
      const next = e.next;
      const i = this.index(e.key);   // recomputed, because the modulus changed
      e.next = this.buckets[i];
      this.buckets[i] = e;
      e = next;
    }
  }
}
```
`delete` needs a `prev` pointer, or you can rebuild the chain without the
matching entry.

## Tier 4 — the measurement that is the point
Replace `fnv1a` with `() => 1` and run the 100k test. Every key lands in one
bucket and lookups go quadratic. Time it. That is a hash-flooding DoS, and
it is why Node, Python and Go all seed their hashers randomly at startup.

Then, if you have the appetite: rewrite with open addressing and linear
probing and benchmark both. The "worse" algorithm usually wins, because of
the cache — your first taste of what project 22 is built on.
