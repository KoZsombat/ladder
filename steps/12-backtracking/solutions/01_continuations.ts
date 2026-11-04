export type Cont = (remaining: number) => boolean;

export function canMake(amount: number, coins: number[], cont: Cont): boolean {
  if (amount === 0) return cont(0);
  if (amount < 0) return false;
  for (const c of coins) {
    if (canMake(amount - c, coins, cont)) return true;
  }
  return false;
}

export function greedyTake(
  amount: number,
  coin: number,
  cont: (remaining: number) => boolean,
): number | null {
  for (let n = Math.floor(amount / coin); n >= 0; n--) {
    if (cont(amount - n * coin)) return n;
  }
  return null;
}
