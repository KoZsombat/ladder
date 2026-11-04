export type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number }
  | { kind: "point" };

export function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r * s.r;
    case "rect": return s.w * s.h;
    case "point": return 0;
  }
}

export function name(s: Shape): string {
  switch (s.kind) {
    case "circle": return "circle";
    case "rect": return "rect";
    case "point": return "point";
  }
  const _exhaustive: never = s;
  throw new Error(`unhandled: ${JSON.stringify(_exhaustive)}`);
}

export function radius(s: Shape): number | undefined {
  if (s.kind === "circle") return s.r;
  return undefined;
}
