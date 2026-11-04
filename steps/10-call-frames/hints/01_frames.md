# 01_frames

## Hint 1
`splice`, not repeated `pop`. `stack.splice(stack.length - argc, argc)`
returns the arguments in their original order.

## Hint 2
```ts
call(target: number, argc: number, returnTo: number): number {
  const base = this.locals.length;
  const args = this.stack.splice(this.stack.length - argc, argc);
  this.locals.push(...args);
  this.frames.push({ ret: returnTo, base, argc });
  if (this.frames.length > this.maxDepth) throw new Error("stack overflow");
  return target;
}
```

## Hint 3
```ts
ret(): number | null {
  const f = this.frames.pop()!;
  this.locals.length = f.base;
  if (f.ret === -1) { this.frames.push(f); return null; }
  return f.ret;
}

load(slot: number): number { return this.locals[this.frame().base + slot] ?? 0; }
store(slot: number, v: number): void { this.locals[this.frame().base + slot] = v; }
```
Pushing the outermost frame back keeps `frame()` valid after the program
ends, which saves a null check everywhere else.

## Hint 4 — write the convention down
Before the project, put this in NOTES.md and then obey it:

    - the caller pushes arguments, left to right
    - CALL addr, argc  takes them into the new frame
    - RET leaves the return value on the operand stack
    - LOAD/STORE slot are frame-relative

Almost every bug in the project is the caller and the callee disagreeing
about that list. That disagreement is exactly what an ABI is.
