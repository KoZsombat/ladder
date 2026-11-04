import type { Line } from "./01_cleaning.ts";

export const WIDTH: Record<string, number> = {
  push: 2, jmp: 2, jz: 2,
  add: 1, sub: 1, print: 1, halt: 1,
};

export const OPCODE: Record<string, number> = {
  push: 1, add: 2, sub: 3, print: 4, halt: 5, jmp: 6, jz: 7,
};

export function firstPass(lines: Line[]): Map<string, number> {
  const labels = new Map<string, number>();
  let addr = 0;
  for (const l of lines) {
    if (l.kind === "label") { labels.set(l.name, addr); continue; }
    const w = WIDTH[l.op];
    if (w === undefined) throw new Error(`unknown instruction: ${l.op}`);
    addr += w;
  }
  return labels;
}

export function secondPass(lines: Line[], labels: Map<string, number>): number[] {
  const out: number[] = [];
  for (const l of lines) {
    if (l.kind === "label") continue;
    const code = OPCODE[l.op];
    if (code === undefined) throw new Error(`unknown instruction: ${l.op}`);
    out.push(code);
    if (WIDTH[l.op] === 1) continue;
    if (l.arg === undefined) throw new Error(`${l.op} needs an operand`);
    if (/^-?\d+$/.test(l.arg)) { out.push(Number(l.arg)); continue; }
    const target = labels.get(l.arg);
    if (target === undefined) throw new Error(`undefined label: ${l.arg}`);
    out.push(target);
  }
  return out;
}
