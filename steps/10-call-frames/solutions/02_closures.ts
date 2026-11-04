export type Cell = { v: number };
export type ByValue = { kind: "value"; captured: number[]; body: (args: number[], cap: number[]) => number };
export type ByRef = { kind: "ref"; cells: Cell[]; body: (args: number[], cells: Cell[]) => number };

export function captureByValue(
  values: number[],
  body: (args: number[], cap: number[]) => number,
): ByValue {
  return { kind: "value", captured: [...values], body };
}

export function captureByRef(
  cells: Cell[],
  body: (args: number[], cells: Cell[]) => number,
): ByRef {
  return { kind: "ref", cells, body };
}

export function callClosure(c: ByValue | ByRef, args: number[]): number {
  return c.kind === "value" ? c.body(args, c.captured) : c.body(args, c.cells);
}

export function makeCounters(mode: "value" | "ref"): (ByValue | ByRef)[] {
  const out: (ByValue | ByRef)[] = [];
  if (mode === "value") {
    for (let i = 0; i < 3; i++) out.push(captureByValue([i], (_a, cap) => cap[0]));
    return out;
  }
  const shared: Cell = { v: 0 };
  for (let i = 0; i < 3; i++) {
    out.push(captureByRef([shared], (_a, cells) => cells[0].v));
    shared.v++;
  }
  return out;
}
