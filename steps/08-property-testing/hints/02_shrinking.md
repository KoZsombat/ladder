# 02_shrinking

## Hint 1
Capture the original failure's message first, then only accept candidates
whose message matches.

## Hint 2
```ts
export function shrink<T>(g: Gen<T>, bad: T, prop: (v: T) => void): T {
  const why = (v: T): string | null => {
    try { prop(v); return null; } catch (e) { return String((e as Error).message); }
  };
  const original = why(bad);
  if (original === null) return bad;
  // ...
}
```

## Hint 3
```ts
  let best = bad;
  for (;;) {
    let improved = false;
    for (const cand of g.shrink(best)) {
      if (why(cand) === original) { best = cand; improved = true; break; }
    }
    if (!improved) return best;
  }
```

## Hint 4
```ts
export function roundTrip<A, B>(encode, decode) {
  return (a: A) => { assert.deepEqual(decode(encode(a)), a); };
}
export function idempotent<A>(f) {
  return (a: A) => { assert.deepEqual(f(f(a)), f(a)); };
}
export function oracle<A, B>(mine, theirs) {
  return (a: A) => { assert.deepEqual(mine(a), theirs(a)); };
}
```
Import `assert` from `node:assert/strict`, or throw by hand if you would
rather keep the module dependency-free.
