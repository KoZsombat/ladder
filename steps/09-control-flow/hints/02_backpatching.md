# 02_backpatching

## Hint 1
```ts
emit(...xs: number[]): void { this.out.push(...xs); }
emitJump(op: number): number { this.emit(op, 0); return this.out.length - 1; }
patch(site: number): void { this.out[site] = this.out.length; }
```

## Hint 2
```ts
export function compileIf(e, cond, thenBody): void {
  cond();
  const site = e.emitJump(OP.JZ);
  thenBody();
  e.patch(site);
}
```

## Hint 3
```ts
export function compileWhile(e, cond, body): void {
  const top = e.here();
  cond();
  const exit = e.emitJump(OP.JZ);
  body();
  e.emit(OP.JMP, top);
  e.patch(exit);
}
```

## Hint 4 — when the countdown misbehaves
Print the emitted array and disassemble it by hand (step 03 exercise 02 gave
you the disassembler). An off-by-one patch target is invisible in the source
and obvious in the listing. This is exactly what the project's `--trace`
flag is for.
