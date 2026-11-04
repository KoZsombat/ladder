export function fnv1a(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function distribution(keys: string[], buckets: number, hash: (k: string) => number): number[] {
  const counts = new Array<number>(buckets).fill(0);
  for (const k of keys) counts[hash(k) % buckets]++;
  return counts;
}

export function chiSquared(counts: number[]): number {
  const n = counts.reduce((a, b) => a + b, 0);
  const expected = n / counts.length;
  return counts.reduce((acc, o) => acc + (o - expected) ** 2 / expected, 0);
}
