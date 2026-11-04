# 06 — Hints

## Tier 1
Ten lines. If it is longer, you are doing something the tree already did
for you.

## Tier 2
```ts
export function compileExpr(n: Node, out: number[]): void {
  switch (n.n) {
    case "num": out.push(OP.PUSH, n.v); return;
    case "neg": out.push(OP.PUSH, 0); compileExpr(n.e, out); out.push(OP.SUB); return;
    case "bin": {
      const op = BINOP[n.op];
      if (op === undefined) throw new Error(`cannot compile operator ${n.op}`);
      compileExpr(n.l, out);
      compileExpr(n.r, out);
      out.push(op);
      return;
    }
  }
}

export function compile(n: Node): number[] {
  const out: number[] = [];
  compileExpr(n, out);
  out.push(OP.PRINT, OP.HALT);
  return out;
}
```

## Tier 3 — when you are done
Print the bytecode your compiler produced for `2 + 3 * 4` and read it:

    PUSH 2  PUSH 3  PUSH 4  MUL  ADD  PRINT  HALT

That array of numbers is a program written by a program you wrote. Sit with
it for a minute.

## Tier 4 — constant folding
```ts
if (n.n === "bin" && n.l.n === "num" && n.r.n === "num") {
  out.push(OP.PUSH, evaluate(n));
  return;
}
```
Put that at the top of the "bin" case. One optimising pass, four lines.
