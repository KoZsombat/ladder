export type Node =
  | { n: "num"; v: number }
  | { n: "bin"; op: "+" | "-" | "*" | "/"; l: Node; r: Node }
  | { n: "neg"; e: Node };

export function evaluate(n: Node): number {
  switch (n.n) {
    case "num": return n.v;
    case "neg": return -evaluate(n.e);
    case "bin": {
      const a = evaluate(n.l), b = evaluate(n.r);
      switch (n.op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return a / b;
      }
    }
  }
}

export function show(n: Node): string {
  switch (n.n) {
    case "num": return String(n.v);
    case "neg": return `(-${show(n.e)})`;
    case "bin": return `(${show(n.l)} ${n.op} ${show(n.r)})`;
  }
}

export function depth(n: Node): number {
  switch (n.n) {
    case "num": return 1;
    case "neg": return 1 + depth(n.e);
    case "bin": return 1 + Math.max(depth(n.l), depth(n.r));
  }
}
