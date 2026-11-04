export type Gen<T> = {
  gen: (r: () => number) => T;
  shrink: (v: T) => T[];
};

export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export function int(max = 100): Gen<number> {
  return {
    gen: (r) => {
      if (r() < 0.2) return [0, 1, -1, max, -max][Math.floor(r() * 5)];
      return Math.floor(r() * (2 * max + 1)) - max;
    },
    shrink: (v) => (v === 0 ? [] : [0, Math.trunc(v / 2), v > 0 ? v - 1 : v + 1]),
  };
}

export function array<T>(el: Gen<T>, maxLen = 20): Gen<T[]> {
  return {
    gen: (r) => Array.from({ length: Math.floor(r() * (maxLen + 1)) }, () => el.gen(r)),
    shrink: (v) => [
      [],
      v.slice(0, Math.floor(v.length / 2)),
      ...v.map((_, i) => [...v.slice(0, i), ...v.slice(i + 1)]),
    ],
  };
}
