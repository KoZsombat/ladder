# 02_closures

## Hint 1
```ts
export function captureByValue(values, body): ByValue {
  return { kind: "value", captured: [...values], body };   // the spread IS the copy
}
export function captureByRef(cells, body): ByRef {
  return { kind: "ref", cells, body };                      // no copy on purpose
}
export function callClosure(c, args): number {
  return c.kind === "value" ? c.body(args, c.captured) : c.body(args, c.cells);
}
```

## Hint 2
```ts
export function makeCounters(mode: "value" | "ref") {
  const out: (ByValue | ByRef)[] = [];
  if (mode === "value") {
    for (let i = 0; i < 3; i++) out.push(captureByValue([i], (_a, cap) => cap[0]));
    return out;
  }
  // ...
}
```

## Hint 3
```ts
  const shared: Cell = { v: 0 };
  for (let i = 0; i < 3; i++) {
    out.push(captureByRef([shared], (_a, cells) => cells[0].v));
    shared.v++;
  }
  return out;
```
After the loop `shared.v` is 3, and all three closures read the same cell.

## Hint 4 — in the project
Implement capture BY VALUE: `MAKE_CLOSURE addr, n` takes n values off the
operand stack and stores them in a heap object; `LOAD_CAPTURED i` reads one
back. Then write in NOTES.md what would change for the by-reference design.
That note is the thing you will still remember in a year.
