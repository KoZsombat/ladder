import { evaluate, type Node } from "./01_post_order.ts";

export function fold(n: Node): Node {
  if (n.n === "num") return n;
  const l = fold(n.l);
  const r = fold(n.r);
  if (l.n === "num" && r.n === "num") {
    if (n.op === "/" && r.v === 0) return { n: "bin", op: n.op, l, r };
    return { n: "num", v: evaluate({ n: "bin", op: n.op, l, r }) };
  }
  return { n: "bin", op: n.op, l, r };
}

export function size(n: Node): number {
  return n.n === "num" ? 1 : 1 + size(n.l) + size(n.r);
}
