# 05 — Hints

## Tier 1
Write `clean` and print its output for a labelled program before touching
`assemble`. If `clean` is right, `assemble` is twenty lines.

## Tier 2
```ts
export function clean(src: string): Line[] {
  return src.split("\n")
    .map((l) => l.replace(/;.*$/, "").trim())
    .filter((l) => l.length > 0)
    .map((l) => {
      if (l.endsWith(":")) return { label: l.slice(0, -1) };
      const [m, arg] = l.split(/\s+/);
      const op = MNEMONIC[m.toLowerCase()];
      if (op === undefined) throw new Error(`unknown instruction: ${m}`);
      return { op, arg };
    });
}
```

## Tier 3
```ts
export function assemble(src: string): number[] {
  const lines = clean(src);

  // pass one: addresses only
  const labels = new Map<string, number>();
  let addr = 0;
  for (const l of lines) {
    if ("label" in l) { labels.set(l.label, addr); continue; }
    addr += HAS_OPERAND.has(l.op) ? 2 : 1;
  }

  // pass two: emit
  const out: number[] = [];
  for (const l of lines) {
    if ("label" in l) continue;
    out.push(l.op);
    if (!HAS_OPERAND.has(l.op)) continue;
    if (l.arg === undefined) throw new Error(`${l.op} needs an operand`);
    if (/^-?\d+$/.test(l.arg)) { out.push(Number(l.arg)); continue; }
    const target = labels.get(l.arg);
    if (target === undefined) throw new Error(`undefined label: ${l.arg}`);
    out.push(target);
  }
  return out;
}
```

## Tier 4
You cannot use labels meaningfully until project 07 adds jumps to the
language. Write the machinery now anyway, so it is already there.
