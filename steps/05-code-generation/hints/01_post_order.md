# 01_post_order

## Hint 1
`compile` is five lines. If yours is longer, the tree is doing work you are
duplicating.

## Hint 2
```ts
export function compile(n: Node, out: (number | string)[]): void {
  if (n.n === "num") { out.push(n.v); return; }
  compile(n.l, out);
  compile(n.r, out);
  out.push(n.op);
}
```

## Hint 3
```ts
export function runFlat(ops: (number | string)[]): number {
  const st: number[] = [];
  for (const op of ops) {
    if (typeof op === "number") { st.push(op); continue; }
    const b = st.pop()!, a = st.pop()!;
    st.push(op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : (a / b) | 0);
  }
  return st[0];
}
```

## Hint 4 — why the differential test matters
Two independent implementations checking each other, with no expected values
to maintain. You will use the same trick to validate an allocator against
`malloc` and a backtester against a naive replay. It is the cheapest
correctness check in the business.
