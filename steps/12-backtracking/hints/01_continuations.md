# 01_continuations

## Hint 1
```ts
export function canMake(amount: number, coins: number[], cont: Cont): boolean {
  if (amount === 0) return cont(0);
  if (amount < 0) return false;
  for (const c of coins) {
    if (canMake(amount - c, coins, cont)) return true;   // first success wins
  }
  return false;
}
```

## Hint 2
```ts
export function greedyTake(amount, coin, cont): number | null {
  let n = Math.floor(amount / coin);
  // n is the MOST you can take; count downward
}
```

## Hint 3
```ts
  for (; n >= 0; n--) {
    if (cont(amount - n * coin)) return n;
  }
  return null;
```

## Hint 4 — the shape to carry forward
In the project, `star` is this loop written recursively:
```ts
const try_ = (p: number): number | null => {
  const more = m(node.x, s, p, (q) => (q === p ? null : try_(q)));
  return more !== null ? more : cont(p);
};
```
`more !== null ? more : cont(p)` IS the give-back: try one more repetition,
and if the rest of the pattern cannot finish down that path, settle for
stopping here. The `q === p` guard stops an infinite loop when the body
matches the empty string.
