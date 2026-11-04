import assert from "node:assert/strict";
import type { Gen } from "./01_generators.ts";

export function shrink<T>(g: Gen<T>, bad: T, prop: (v: T) => void): T {
  const why = (v: T): string | null => {
    try { prop(v); return null; } catch (e) { return String((e as Error).message); }
  };
  const original = why(bad);
  if (original === null) return bad;

  let best = bad;
  for (;;) {
    let improved = false;
    for (const cand of g.shrink(best)) {
      if (why(cand) === original) { best = cand; improved = true; break; }
    }
    if (!improved) return best;
  }
}

export function roundTrip<A, B>(encode: (a: A) => B, decode: (b: B) => A): (a: A) => void {
  return (a: A) => { assert.deepEqual(decode(encode(a)), a); };
}

export function idempotent<A>(f: (a: A) => A): (a: A) => void {
  return (a: A) => { assert.deepEqual(f(f(a)), f(a)); };
}

export function oracle<A, B>(mine: (a: A) => B, theirs: (a: A) => B): (a: A) => void {
  return (a: A) => { assert.deepEqual(mine(a), theirs(a)); };
}
