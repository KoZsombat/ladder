# 02_folding

## Hint 1
Recurse into the children first, then decide. Four lines after that.

## Hint 2
```ts
export function fold(n: Node): Node {
  if (n.n === "num") return n;
  const l = fold(n.l);
  const r = fold(n.r);
  // now check whether both are literals
}
```

## Hint 3
```ts
  if (l.n === "num" && r.n === "num") {
    if (n.op === "/" && r.v === 0) return { n: "bin", op: n.op, l, r };
    return { n: "num", v: evaluate({ n: "bin", op: n.op, l, r }) };
  }
  return { n: "bin", op: n.op, l, r };
```
and
```ts
export function size(n: Node): number {
  return n.n === "num" ? 1 : 1 + size(n.l) + size(n.r);
}
```

## Hint 4 — in the project
Put the same four lines at the top of your compiler's binary case and you
have an optimising compiler. Then print the bytecode for `2 + 3 * 4` with
and without it, and look at the difference.
