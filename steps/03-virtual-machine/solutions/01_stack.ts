export type Op = number | "+" | "-" | "*" | "/";

export function evalStack(ops: Op[]): number[] {
  const st: number[] = [];
  for (const op of ops) {
    if (typeof op === "number") { st.push(op); continue; }
    if (st.length < 2) throw new Error(`${op} needs two operands, found ${st.length}`);
    const b = st.pop()!, a = st.pop()!;
    st.push(op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b);
  }
  return st;
}

export function isBalanced(ops: Op[]): boolean {
  let depth = 0;
  for (const op of ops) {
    if (typeof op === "number") { depth++; continue; }
    if (depth < 2) return false;
    depth -= 1;
  }
  return depth === 1;
}
