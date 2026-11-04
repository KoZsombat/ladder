# 01_hashing

## Hint 1
```ts
export function fnv1a(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
```

## Hint 2
```ts
export function distribution(keys, buckets, hash) {
  const counts = new Array(buckets).fill(0);
  for (const k of keys) counts[hash(k) % buckets]++;
  return counts;
}
```

## Hint 3
```ts
export function chiSquared(counts: number[]): number {
  const n = counts.reduce((a, b) => a + b, 0);
  const expected = n / counts.length;
  return counts.reduce((acc, o) => acc + (o - expected) ** 2 / expected, 0);
}
```

## Hint 4 — try breaking it
Replace `Math.imul(h, 0x01000193)` with `h * 0x01000193` and run the test
again. It still returns numbers, it still looks like a hash, and the
chi-squared score goes through the roof. That is why the measurement exists.
