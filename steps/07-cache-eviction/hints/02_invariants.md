# 02_invariants

## Hint 1
Four checks, each one throwing its own message. Build a `Set` from `order`
once rather than calling `includes` in a loop.

## Hint 2
```ts
export function checkToy(t: Toy): void {
  const seen = new Set<string>();
  for (const k of t.order) {
    if (seen.has(k)) throw new Error(`duplicate key in the list: ${k}`);
    seen.add(k);
  }
  // ...
}
```
Check MEMBERSHIP before counts. A size mismatch is true but useless — it
tells you the structures disagree without saying where. Naming the key is
what turns the message into a lead.

## Hint 3
```ts
  for (const k of seen) {
    if (!t.map.has(k)) throw new Error(`key ${k} is in the list but not the map`);
  }
  for (const k of t.map.keys()) {
    if (!seen.has(k)) throw new Error(`key ${k} is in the map but not the list`);
  }
```
and
```ts
export function firstBreak(ops: Pair[], capacity: number): number {
  const t = new Toy();
  for (let i = 0; i < ops.length; i++) {
    t.put(ops[i].key, ops[i].value, capacity);
    try { checkToy(t); } catch { return i; }
  }
  return -1;
}
```

## Hint 4 — in the project
The LRU's `checkInvariant` is the same four checks over a map and a linked
list, plus a cycle guard. Call it after every operation in the tests. It
will catch the "forgot to delete the evicted key from the map" leak, which
never produces a wrong answer and therefore never shows up any other way.
