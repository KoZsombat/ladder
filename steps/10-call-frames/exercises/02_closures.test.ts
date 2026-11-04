import { test } from "node:test";
import assert from "node:assert/strict";
import { captureByValue, captureByRef, callClosure, makeCounters, type Cell } from "./02_closures.ts";

test("by value: an adder", () => {
  const add5 = captureByValue([5], (args, cap) => args[0] + cap[0]);
  assert.equal(callClosure(add5, [10]), 15);
});

test("by value does not alias the caller's array", () => {
  const vals = [5];
  const c = captureByValue(vals, (args, cap) => cap[0]);
  vals[0] = 999;
  assert.equal(callClosure(c, []), 5, "a later write must not be visible");
});

test("by reference shares the cell", () => {
  const cell: Cell = { v: 1 };
  const c = captureByRef([cell], (args, cells) => cells[0].v);
  assert.equal(callClosure(c, []), 1);
  cell.v = 42;
  assert.equal(callClosure(c, []), 42, "the closure sees the write");
});

test("two by-reference closures see each other", () => {
  const cell: Cell = { v: 0 };
  const inc = captureByRef([cell], (_a, cells) => ++cells[0].v);
  const read = captureByRef([cell], (_a, cells) => cells[0].v);
  callClosure(inc, []);
  callClosure(inc, []);
  assert.equal(callClosure(read, []), 2);
});

test("THE CLASSIC: by value gives 0,1,2", () => {
  const cs = makeCounters("value");
  assert.deepEqual(cs.map((c) => callClosure(c, [])), [0, 1, 2]);
});

test("THE CLASSIC: by reference gives 3,3,3", () => {
  const cs = makeCounters("ref");
  assert.deepEqual(
    cs.map((c) => callClosure(c, [])),
    [3, 3, 3],
    "this is pre-let JavaScript, reproduced on purpose",
  );
});
