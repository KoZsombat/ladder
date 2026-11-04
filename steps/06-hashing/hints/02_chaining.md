# 02_chaining

## Hint 1
Three small list functions and one loop-inside-a-loop. Nothing clever.

## Hint 2
```ts
export function chainSet(head, key, value): [Entry, boolean] {
  for (let e = head; e; e = e.next) {
    if (e.key === key) { e.value = value; return [head!, false]; }
  }
  return [{ key, value, next: head }, true];
}

export function chainGet(head, key) {
  for (let e = head; e; e = e.next) if (e.key === key) return e.value;
  return undefined;
}
```

## Hint 3
The simple `chainDelete`:
```ts
export function chainDelete(head, key): [Entry | null, boolean] {
  let removed = false;
  const keep: Entry[] = [];
  for (let e = head; e; e = e.next) {
    if (e.key === key && !removed) { removed = true; continue; }
    keep.push(e);
  }
  let out: Entry | null = null;
  for (let i = keep.length - 1; i >= 0; i--) out = { ...keep[i], next: out };
  return [out, removed];
}
```

## Hint 4
```ts
export function rehash(buckets, newSize, hash): (Entry | null)[] {
  const out: (Entry | null)[] = new Array(newSize).fill(null);
  for (const head of buckets) {
    for (let e = head; e; ) {
      const next = e.next;            // save it: we are about to overwrite e.next
      const i = hash(e.key) % newSize;
      e.next = out[i];
      out[i] = e;
      e = next;
    }
  }
  return out;
}
```
Saving `next` before relinking is the classic linked-list rebuild. Forget it
and you splice the chain into itself and loop forever.
