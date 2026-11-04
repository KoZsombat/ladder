# 01_stack

## Hint 1
`evalStack` is one loop with an if/else. `isBalanced` is the same loop with
a counter instead of a stack.

## Hint 2
```ts
for (const op of ops) {
  if (typeof op === "number") { st.push(op); continue; }
  if (st.length < 2) throw new Error(`${op} needs two operands, found ${st.length}`);
  const b = st.pop()!, a = st.pop()!;
  st.push(op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b);
}
```

## Hint 3
```ts
export function isBalanced(ops: Op[]): boolean {
  let depth = 0;
  for (const op of ops) {
    if (typeof op === "number") { depth++; continue; }
    if (depth < 2) return false;
    depth -= 1;              // pops two, pushes one
  }
  return depth === 1;
}
```
