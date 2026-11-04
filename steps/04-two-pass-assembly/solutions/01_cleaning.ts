export type Line =
  | { kind: "label"; name: string }
  | { kind: "instr"; op: string; arg?: string };

export function clean(src: string): Line[] {
  return src
    .split("\n")
    .map((l) => l.replace(/;.*$/, "").trim())
    .filter((l) => l.length > 0)
    .map((l): Line => {
      if (l.endsWith(":")) return { kind: "label", name: l.slice(0, -1) };
      const [op, arg] = l.split(/\s+/);
      return { kind: "instr", op: op.toLowerCase(), arg };
    });
}
