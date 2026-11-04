# 07 — Hints

## Tier 1 — order of work
1. `slotOf`, `emitJump`, `patch` — three one-liners.
2. `compileExpr`, then `compileStmt` for assign/print/expr only.
   Check `x = 7; print x` before going near control flow.
3. `compileIf`. Check the skip test.
4. `compileWhile`. Check the countdown.

Turn the VM's trace on the moment something loops: `run(prog, true)`.

## Tier 2 — the small pieces
```ts
slotOf(name: string): number {
  let s = this.slots.get(name);
  if (s === undefined) { s = this.slots.size; this.slots.set(name, s); }
  return s;
}

emitJump(op: number): number {
  this.emit(op, 0);
  return this.out.length - 1;   // the OPERAND index
}

patch(site: number): void {
  this.out[site] = this.out.length;
}
```

## Tier 3 — control flow
```ts
compileIf(st) {
  this.compileExpr(st.cond);
  const site = this.emitJump(OP.JZ);
  for (const s of st.body) this.compileStmt(s);
  this.patch(site);
}

compileWhile(st) {
  const top = this.out.length;
  this.compileExpr(st.cond);
  const exit = this.emitJump(OP.JZ);
  for (const s of st.body) this.compileStmt(s);
  this.emit(OP.JMP, top);
  this.patch(exit);
}

compileStmt(st) {
  switch (st.s) {
    case "assign": this.compileExpr(st.e); this.emit(OP.STORE, this.slotOf(st.name)); return;
    case "print":  this.compileExpr(st.e); this.emit(OP.PRINT); return;
    case "expr":   this.compileExpr(st.e); this.emit(OP.POP); return;
    case "if":     this.compileIf(st); return;
    case "while":  this.compileWhile(st); return;
  }
}
```

## Tier 4 — the parser, if you are stuck there
```ts
export function parseBlock(c: Cursor, endPunct?: string): Stmt[] {
  const out: Stmt[] = [];
  for (;;) {
    if (c.at("eof")) break;
    if (endPunct && c.at("punct", endPunct)) break;
    out.push(parseStmt(c));
    c.eat("punct", ";");
  }
  return out;
}
```
For the assignment lookahead, the simplest honest approach is to parse an
expression and then check: if it came back as `{ n: "var" }` and the next
token is `=`, consume the `=` and parse the right-hand side.
