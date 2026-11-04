# 01_unions

## Hint 1
All three are a `switch (s.kind)` or a single `if`. The lesson is what you
put *after* the switch, not inside it.

## Hint 2
```ts
export function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r * s.r;
    case "rect": return s.w * s.h;
    case "point": return 0;
  }
}
```
Note there is no `default` and no `return` at the end — TypeScript can see
every case returns.

## Hint 3
```ts
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
```

## Hint 4 — try this before moving on
Add a fourth variant to `Shape`:
```ts
| { kind: "triangle"; base: number; height: number }
```
Rebuild. `name` fails to compile and tells you exactly where. `area` fails
too. If you had written `default:` in either, they would have compiled and
quietly returned the wrong answer.
