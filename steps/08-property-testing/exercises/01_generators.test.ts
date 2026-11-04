import { test } from "node:test";
import assert from "node:assert/strict";
import { rng, int, array } from "./01_generators.ts";

test("the same seed gives the same sequence", () => {
  const a = rng(42), b = rng(42), c = rng(43);
  const seqA = Array.from({ length: 20 }, () => a());
  const seqB = Array.from({ length: 20 }, () => b());
  assert.deepEqual(seqA, seqB);
  assert.notDeepEqual(seqA, Array.from({ length: 20 }, () => c()));
});

test("rng stays in [0,1)", () => {
  const r = rng(7);
  for (let i = 0; i < 1000; i++) {
    const v = r();
    assert.ok(v >= 0 && v < 1, `out of range: ${v}`);
  }
});

test("int hits the edges far more than chance would", () => {
  const r = rng(11);
  const g = int(1000);
  let edges = 0;
  for (let i = 0; i < 1000; i++) {
    const v = g.gen(r);
    if (v === 0 || v === 1 || v === -1 || v === 1000 || v === -1000) edges++;
  }
  assert.ok(edges > 50, `only ${edges}/1000 edge values — uniform random finds nothing`);
});

test("int shrinks toward zero and terminates", () => {
  const g = int();
  assert.deepEqual(g.shrink(0), []);
  const s = g.shrink(80);
  assert.ok(s.includes(0));
  assert.ok(s.every((x) => Math.abs(x) <= 80));
});

test("array generator respects maxLen", () => {
  const r = rng(3);
  const g = array(int(), 5);
  for (let i = 0; i < 200; i++) assert.ok(g.gen(r).length <= 5);
});

test("array shrinks by emptying, halving and removing", () => {
  const g = array(int());
  const s = g.shrink([1, 2, 3]);
  assert.ok(s.some((x) => x.length === 0), "must offer the empty array");
  assert.ok(s.some((x) => x.length === 1), "must offer the first half");
  assert.ok(s.some((x) => JSON.stringify(x) === "[1,3]"), "must offer one-removed");
});
