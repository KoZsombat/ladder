# 11 — Hints

## Tier 1
Build it in this order: `rng`, `int`, `array`, `forAll` without shrinking,
then `shrinkLoop`. Each step is testable on its own.

## Tier 2
```ts
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export function int(max = 100): Gen<number> {
  return {
    gen: (r) => {
      if (r() < 0.2) return [0, 1, -1, max, -max][Math.floor(r() * 5)];
      return Math.floor(r() * (2 * max + 1)) - max;
    },
    shrink: (v) => (v === 0 ? [] : [0, Math.trunc(v / 2), v > 0 ? v - 1 : v + 1]),
  };
}
```

## Tier 3
```ts
export function forAll<T>(g, prop, runs = 100, seed = Date.now() >>> 0): void {
  const r = rng(seed);
  for (let i = 0; i < runs; i++) {
    const v = g.gen(r);
    try { prop(v); } catch (err) {
      throw new PropertyFailure(seed, shrinkLoop(g, v, prop), err);
    }
  }
}

export function shrinkLoop<T>(g, bad: T, prop): T {
  const fails = (v: T) => { try { prop(v); return false; } catch { return true; } };
  let best = bad;
  for (;;) {
    let improved = false;
    for (const cand of g.shrink(best)) {
      if (fails(cand)) { best = cand; improved = true; break; }
    }
    if (!improved) return best;
  }
}
```

## Tier 4 — point it at your own code
Two properties worth writing once this works:

```ts
// ROUND TRIP, against your project-01 parser
forAll(exprGen(), (ast) => {
  assert.equal(evaluate(parse(show(ast))), evaluate(ast));
});

// MODEL-BASED, against your project-10 hash table.
// Note it generates a SEQUENCE of operations, not one call — that is where
// the interesting bugs are.
forAll(array(opGen()), (ops) => {
  const mine = new HashMap<number>();
  const model = new Map<string, number>();
  for (const op of ops) {
    if (op.t === "set") { mine.set(op.k, op.v); model.set(op.k, op.v); }
    else { mine.delete(op.k); model.delete(op.k); }
    assert.equal(mine.get(op.k), model.get(op.k));
  }
  assert.equal(mine.size, model.size);
});
```
Then plant a bug on purpose — resize at 1.5 instead of 0.75 — and confirm
your runner finds it inside 100 cases.
