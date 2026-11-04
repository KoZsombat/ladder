import { test } from "node:test";
import assert from "node:assert/strict";
import { canMake, greedyTake } from "./01_continuations.ts";

const done: (r: number) => boolean = (r) => r === 0;

test("canMake", () => {
  assert.equal(canMake(6, [3, 4, 1], done), true);
  assert.equal(canMake(6, [4, 3], done), true, "3 + 3");
  assert.equal(canMake(7, [5, 10, 20], done), false);
  assert.equal(canMake(0, [5], done), true);
});

test("canMake backtracks past a bad first choice", () => {
  // taking the 5 first leads nowhere; it must come back and take 3 + 3
  assert.equal(canMake(6, [5, 3], done), true);
});

test("greedyTake takes the maximum when that works", () => {
  assert.equal(greedyTake(10, 5, done), 2);
  assert.equal(greedyTake(9, 5, done), null, "1 left over, cont fails every way");
});

test("THE GIVE-BACK: it backs off when the maximum fails", () => {
  // take some 4s, and the remainder must be divisible by 3
  const restIsThrees = (r: number) => r % 3 === 0;
  assert.equal(greedyTake(12, 4, restIsThrees), 3, "12 = 4+4+4, remainder 0");
  assert.equal(greedyTake(10, 4, restIsThrees), 1, "two 4s leave 2 (bad); one 4 leaves 6 (good)");
  assert.equal(greedyTake(7, 4, restIsThrees), 1, "one 4 leaves 3, which is divisible by 3");
  assert.equal(greedyTake(5, 4, restIsThrees), null, "neither one 4 (leaves 1) nor zero (leaves 5) works");
});

test("it really does try every count downward", () => {
  const tried: number[] = [];
  greedyTake(20, 5, (r) => { tried.push(r); return false; });
  assert.deepEqual(tried, [0, 5, 10, 15, 20], "from the most taken to the fewest");
});
