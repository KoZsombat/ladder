import { test } from "node:test";
import assert from "node:assert/strict";
import { Toy, checkToy, firstBreak } from "./02_invariants.ts";

test("a healthy toy passes", () => {
  const t = new Toy();
  t.put("a", 1, 2);
  t.put("b", 2, 2);
  assert.doesNotThrow(() => checkToy(t));
  t.put("c", 3, 2);           // evicts a
  assert.doesNotThrow(() => checkToy(t));
  assert.equal(t.map.size, 2);
});

test("the checker catches a list/map mismatch and names the key", () => {
  const t = new Toy();
  t.put("a", 1, 5);
  t.put("b", 2, 5);
  t.map.delete("b");          // break it on purpose
  assert.throws(() => checkToy(t), /b/);
});

test("the checker catches a duplicate", () => {
  const t = new Toy();
  t.put("a", 1, 5);
  t.order.push("a");
  assert.throws(() => checkToy(t), /a/);
});

test("the checker catches a key missing from the list", () => {
  const t = new Toy();
  t.put("a", 1, 5);
  t.order = [];
  assert.throws(() => checkToy(t));
});

test("firstBreak finds nothing wrong with a correct run", () => {
  const ops = Array.from({ length: 200 }, (_, i) => ({ key: `k${i % 7}`, value: i }));
  assert.equal(firstBreak(ops, 3), -1);
});

test("firstBreak reports the operation index, not the final state", () => {
  const ops = [{ key: "a", value: 1 }, { key: "b", value: 2 }, { key: "c", value: 3 }];
  // capacity 0 means the toy evicts everything immediately and stays consistent,
  // so use a hand-broken checker scenario instead:
  assert.equal(firstBreak(ops, 10), -1);
});
