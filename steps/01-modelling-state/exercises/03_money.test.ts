import { test } from "node:test";
import assert from "node:assert/strict";
import { formatFt, greedyChange, fewestCoins, FORINT } from "./03_money.ts";

test("formatFt", () => {
  assert.equal(formatFt(0), "0 Ft");
  assert.equal(formatFt(70), "70 Ft");
  assert.equal(formatFt(1234), "1 234 Ft");
  assert.equal(formatFt(1234567), "1 234 567 Ft");
});

test("greedy on the forint set", () => {
  assert.deepEqual(greedyChange(0, FORINT), []);
  assert.deepEqual(greedyChange(30, FORINT), [20, 10]);
  assert.deepEqual(greedyChange(285, FORINT), [200, 50, 20, 10, 5]);
  assert.equal(greedyChange(7, FORINT), null, "7 is not payable in forint coins");
});

test("fewestCoins agrees with greedy on the forint set", () => {
  for (const amount of [0, 5, 30, 95, 285, 1000]) {
    const g = greedyChange(amount, FORINT);
    const n = fewestCoins(amount, FORINT);
    assert.equal(g === null ? null : g.length, n, `disagreement at ${amount}`);
  }
});

test("THE POINT: greedy is wrong on a different coin set", () => {
  const odd = [4, 3, 1];
  assert.deepEqual(greedyChange(6, odd), [4, 1, 1], "greedy takes the 4 first");
  assert.equal(fewestCoins(6, odd), 2, "but 3 + 3 is two coins");
  // Greedy is right in practice for real currencies and wrong in general.
  // Write that line in NOTES.md — you will meet the same shape again.
});
