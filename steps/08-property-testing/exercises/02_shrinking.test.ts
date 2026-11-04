import { test } from "node:test";
import assert from "node:assert/strict";
import { int, array } from "./01_generators.ts";
import { shrink, roundTrip, idempotent, oracle } from "./02_shrinking.ts";

test("shrinks an int to the minimal failing value", () => {
  const prop = (v: number) => { if (v >= 10) throw new Error("too big"); };
  assert.equal(shrink(int(1000), 874, prop), 10);
});

test("shrinks an array to the minimal failing length", () => {
  const prop = (xs: number[]) => { if (xs.length > 3) throw new Error("too long"); };
  const out = shrink(array(int(), 20), [9, 8, 7, 6, 5, 4, 3, 2, 1], prop);
  assert.equal(out.length, 4);
});

test("a candidate that fails DIFFERENTLY is rejected", () => {
  // fails with "big" for v >= 10, and with "odd" for odd values
  const prop = (v: number) => {
    if (v % 2 !== 0) throw new Error("odd");
    if (v >= 10) throw new Error("big");
  };
  // starting from 80 (fails "big"), shrinking must not wander into an odd value
  const out = shrink(int(1000), 80, prop);
  assert.equal(out % 2, 0, `shrunk to ${out}, which fails for a different reason`);
  assert.ok(out >= 10);
});

test("already-minimal input is returned unchanged", () => {
  const prop = (v: number) => { if (v !== 0) return; throw new Error("zero"); };
  assert.equal(shrink(int(), 0, prop), 0);
});

test("roundTrip", () => {
  const good = roundTrip<number[], string>(JSON.stringify, JSON.parse);
  assert.doesNotThrow(() => good([1, 2, 3]));

  const lossy = roundTrip<number[], string>((a) => a.join(","), (s) => s.split(",").map(Number));
  assert.throws(() => lossy([]), "empty array does not survive join/split");
});

test("idempotent", () => {
  const sorted = idempotent<number[]>((xs) => [...xs].sort((a, b) => a - b));
  assert.doesNotThrow(() => sorted([3, 1, 2]));

  const notIdem = idempotent<number[]>((xs) => [...xs, 0]);
  assert.throws(() => notIdem([1]));
});

test("oracle", () => {
  const agree = oracle<number[], number>(
    (xs) => xs.reduce((a, b) => a + b, 0),
    (xs) => xs.length === 0 ? 0 : xs[0] + xs.slice(1).reduce((a, b) => a + b, 0),
  );
  assert.doesNotThrow(() => agree([1, 2, 3]));

  const disagree = oracle<number[], number>((xs) => xs.length, (xs) => xs.length + 1);
  assert.throws(() => disagree([1]));
});
