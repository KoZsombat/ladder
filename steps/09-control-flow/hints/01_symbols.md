# 01_symbols

## Hint 1
An array of Maps, used as a stack, plus one counter that only ever goes up.

## Hint 2
```ts
push(): void { this.frames.push(new Map()); }

pop(): void {
  if (this.frames.length === 1) throw new Error("cannot pop the global scope");
  this.frames.pop();
}
```

## Hint 3
```ts
declare(name: string): number {
  const top = this.frames[this.frames.length - 1];
  const existing = top.get(name);
  if (existing !== undefined) return existing;     // same scope: same slot
  const slot = this.next++;
  top.set(name, slot);
  return slot;
}

lookup(name: string): number | undefined {
  for (let i = this.frames.length - 1; i >= 0; i--) {
    const slot = this.frames[i].get(name);
    if (slot !== undefined) return slot;
  }
  return undefined;
}
```

## Hint 4
The project's compiler only needs the flat version — one scope, no push or
pop. You are writing the scoped one because step 10 (call frames) needs it,
and because seeing shadowing implemented is what makes it stop being magic.
