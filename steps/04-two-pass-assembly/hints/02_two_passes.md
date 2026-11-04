# 02_two_passes

## Hint 1
Both passes are the same `for (const l of lines)` loop. The first one only
counts; the second one only emits.

## Hint 2
```ts
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
```

## Hint 3
```ts
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
```

## Hint 4
Step 09 solves the same forward-reference problem a completely different
way — emit a placeholder, remember the hole, fill it in later. That is
backpatching. Both techniques are in every real compiler, and knowing both
is why a linker's "relocation" error stops being frightening.
