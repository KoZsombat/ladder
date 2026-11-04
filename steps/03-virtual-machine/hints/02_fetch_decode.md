# 02_fetch_decode

## Hint 1
```ts
let addr = 0;
while (addr < program.length) {
  out.push(addr);
  addr += HAS_OPERAND.has(program[addr]) ? 2 : 1;
}
```

## Hint 2
For the names, invert the OP object once:
```ts
const NAME: Record<number, string> = Object.fromEntries(
  Object.entries(OP).map(([k, v]) => [v, k]),
);
```

## Hint 3
```ts
export function disassemble(program: number[]): string[] {
  return instructionAddresses(program).map((a) => {
    const op = program[a];
    const n = NAME[op] ?? `?${op}`;
    return HAS_OPERAND.has(op) ? `${a}: ${n} ${program[a + 1]}` : `${a}: ${n}`;
  });
}
```
