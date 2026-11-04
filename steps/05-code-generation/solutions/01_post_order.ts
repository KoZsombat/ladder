export type Node =
  | { n: "num"; v: number }
  | { n: "bin"; op: "+" | "-" | "*" | "/"; l: Node; r: Node };

export function evaluate(n: Node): number {
  if (n.n === "num") return n.v;
  const a = evaluate(n.l);
  const b = evaluate(n.r);
  switch (n.op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return (a / b) | 0;
  }
}

export function compile(n: Node, out: (number | string)[]): void {
  if (n.n === "num") { out.push(n.v); return; }
  compile(n.l, out);
  compile(n.r, out);
  out.push(n.op);
}

export function runFlat(ops: (number | string)[]): number {
  const st: number[] = [];
  for (const op of ops) {
    if (typeof op === "number") { st.push(op); continue; }
    const b = st.pop()!, a = st.pop()!;
    st.push(op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : (a / b) | 0);
  }
  return st[0];
}
