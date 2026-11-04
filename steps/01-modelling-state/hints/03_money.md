# 03_money

## Hint 1
`formatFt` is a regex or a manual chunking loop. `greedyChange` is one loop.
`fewestCoins` is a table you fill from 0 upward.

## Hint 2
```ts
export function formatFt(amount: number): string {
  const s = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${s} Ft`;
}

export function greedyChange(amount: number, coins: number[]): number[] | null {
  const out: number[] = [];
  let left = amount;
  for (const c of coins) {
    while (left >= c) { out.push(c); left -= c; }
  }
  return left === 0 ? out : null;
}
```

## Hint 3
```ts
export function fewestCoins(amount: number, coins: number[]): number | null {
  const INF = Number.POSITIVE_INFINITY;
  const best = new Array<number>(amount + 1).fill(INF);
  best[0] = 0;
  for (let n = 1; n <= amount; n++) {
    for (const c of coins) {
      if (c <= n && best[n - c] + 1 < best[n]) best[n] = best[n - c] + 1;
    }
  }
  return best[amount] === INF ? null : best[amount];
}
```

## Hint 4 — what to carry into the project
The vending machine's float is LIMITED — a finite number of each coin — so
its `makeChange` is greedy plus an availability check, and it can fail even
for an amount greedy could otherwise make. That failure has to refuse the
whole sale and refund, which is the most interesting branch in the project.
