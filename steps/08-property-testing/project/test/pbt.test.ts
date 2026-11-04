import { test } from "node:test";
import assert from "node:assert/strict";
import { rng, int, array, forAll, shrinkLoop, PropertyFailure } from "../src/pbt.ts";

test("rng is deterministic for a seed", () => {
  const a = rng(42), b = rng(42);
  for (let i = 0; i < 10; i++) assert.equal(a(), b());
  const c = rng(43);
  assert.notEqual(rng(42)(), c());
});

test("int hits the edge values", () => {
  const r = rng(7);
  const g = int(100);
  const seen = new Set<number>();
  for (let i = 0; i < 500; i++) seen.add(g.gen(r));
  assert.ok(seen.has(0), "0 should come up");
  assert.ok(seen.has(1) || seen.has(-1), "1 or -1 should come up");
});

test("a true property passes 1000 runs", () => {
  forAll(array(int()), (xs) => {
    const sorted = [...xs].sort((a, b) => a - b);
    assert.equal(sorted.length, xs.length);
  }, 1000, 1);
});

test("a false property fails AND shrinks", () => {
  // deliberately wrong: claims every array has at most 3 elements
  let caught: PropertyFailure | undefined;
  try {
    forAll(array(int(), 20), (xs) => { assert.ok(xs.length <= 3); }, 500, 123);
  } catch (e) {
    caught = e as PropertyFailure;
  }
  assert.ok(caught instanceof PropertyFailure, "should throw PropertyFailure");
  const ex = caught!.counterexample as number[];
  assert.ok(Array.isArray(ex));
  assert.equal(ex.length, 4, `should shrink to exactly 4 elements, got ${ex.length}`);
  assert.ok(typeof caught!.seed === "number", "must report the seed");
});

test("shrinkLoop reduces an int toward zero", () => {
  const g = int(1000);
  const prop = (v: number) => { assert.ok(v < 10); };
  assert.equal(shrinkLoop(g, 874, prop), 10, "the minimal failing int is 10");
});

test("the same seed reproduces the same failure", () => {
  const get = () => {
    try {
      forAll(array(int(), 10), (xs) => { assert.ok(xs.length === 0); }, 200, 999);
    } catch (e) {
      return JSON.stringify((e as PropertyFailure).counterexample);
    }
    return "no failure";
  };
  assert.equal(get(), get());
});
