import { test } from "node:test";
import assert from "node:assert/strict";
import { fnv1a, distribution, chiSquared } from "./01_hashing.ts";

const words = Array.from({ length: 2000 }, (_, i) => `key${i}`);

test("deterministic and unsigned", () => {
  assert.equal(fnv1a("hello"), fnv1a("hello"));
  assert.notEqual(fnv1a("hello"), fnv1a("world"));
  for (const s of ["", "a", "zzzzzzzzzzzzzzzzzzzz", "Ω", "key1999"]) {
    const h = fnv1a(s);
    assert.ok(Number.isInteger(h) && h >= 0 && h < 2 ** 32, `${s} -> ${h}`);
  }
});

test("one-character changes scatter the result", () => {
  // avalanche: adjacent keys must not produce adjacent hashes
  const a = fnv1a("key1"), b = fnv1a("key2");
  assert.ok(Math.abs(a - b) > 1000, "adjacent keys hashed to adjacent values");
});

test("distribution", () => {
  const counts = distribution(words, 16, fnv1a);
  assert.equal(counts.length, 16);
  assert.equal(counts.reduce((a, b) => a + b, 0), 2000);
});

test("MEASURED uniformity, not eyeballed", () => {
  const counts = distribution(words, 64, fnv1a);
  const chi = chiSquared(counts);
  // a good hash over 64 buckets scores around 64; anything over ~120 is lumpy
  assert.ok(chi < 120, `chi-squared = ${chi.toFixed(1)}, too lumpy`);
});

test("and a BAD hash fails that same measurement", () => {
  const bad = (k: string) => k.length;          // every key5xx collides
  const chi = chiSquared(distribution(words, 64, bad));
  assert.ok(chi > 500, `a length-based hash should score terribly, got ${chi.toFixed(1)}`);
});
