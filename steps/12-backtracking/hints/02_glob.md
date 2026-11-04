# 02_glob

## Hint 1
```ts
export function matchFrom(pat, pi, s, pos, cont): number | null {
  if (pi === pat.length) return cont(pos);
  const p = pat[pi];
  if (p === "?") {
    return pos < s.length ? matchFrom(pat, pi + 1, s, pos + 1, cont) : null;
  }
  // ...
}
```

## Hint 2
The star, greedy:
```ts
  if (p === "*") {
    for (let take = s.length - pos; take >= 0; take--) {
      const r = matchFrom(pat, pi + 1, s, pos + take, cont);
      if (r !== null) return r;
    }
    return null;
  }
```
Count DOWNWARD for greedy, upward for lazy.

## Hint 3
```ts
  return s[pos] === p ? matchFrom(pat, pi + 1, s, pos + 1, cont) : null;
```

## Hint 4
For `matchCost`, the simplest honest version is a module-level counter the
real function increments, reset at the start of `matchCost`:
```ts
let steps = 0;
export function matchCost(pat: string, s: string): number {
  steps = 0;
  matchFrom(pat, 0, s, 0, (p) => (p === s.length ? p : null));
  return steps;
}
```
with `steps++` as the first line of `matchFrom`.
