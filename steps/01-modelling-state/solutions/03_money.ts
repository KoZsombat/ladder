export type Coin = 5 | 10 | 20 | 50 | 100 | 200;
export const FORINT: Coin[] = [200, 100, 50, 20, 10, 5];

export function formatFt(amount: number): string {
  const s = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${s} Ft`;
}

export function greedyChange(amount: number, coins: number[]): number[] | null {
  const out: number[] = [];
  let left = amount;
  for (const c of coins) {
    while (left >= c) {
      out.push(c);
      left -= c;
    }
  }
  return left === 0 ? out : null;
}

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
