# 04 — Hints

## Tier 1
One `while (true)` with a `switch`. The only subtlety is how far to advance
the instruction pointer for each opcode.

## Tier 2
```ts
export function run(program: number[], trace = false): RunResult {
  const stack: number[] = [];
  const output: number[] = [];
  let ip = 0;
  for (;;) {
    const op = program[ip];
    if (trace) console.error(`ip=${ip} ${NAME[op] ?? op} stack=[${stack}]`);
    switch (op) {
      case OP.PUSH: stack.push(program[ip + 1]); ip += 2; break;
      // ...
      case OP.HALT: return { output, stack };
      default: throw new Error(`unknown opcode ${op} at ip=${ip}`);
    }
  }
}
```

## Tier 3
```ts
case OP.ADD: { const b = stack.pop()!, a = stack.pop()!; stack.push(a + b); ip += 1; break; }
case OP.SUB: { const b = stack.pop()!, a = stack.pop()!; stack.push(a - b); ip += 1; break; }
case OP.MUL: { const b = stack.pop()!, a = stack.pop()!; stack.push(a * b); ip += 1; break; }
case OP.DIV: { const b = stack.pop()!, a = stack.pop()!; stack.push((a / b) | 0); ip += 1; break; }
case OP.POP: stack.pop(); ip += 1; break;
case OP.PRINT: output.push(stack.pop()!); ip += 1; break;
```

## Tier 4
Keep the trace flag. You will use it constantly in projects 05-08, and in 07
it is the difference between finding an off-by-one patch target in a minute
and in an hour.
