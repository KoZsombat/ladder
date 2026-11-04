import { test } from "node:test";
import assert from "node:assert/strict";
import { evalStack, isBalanced, type Op } from "./01_stack.ts";

test("basic arithmetic", () => {
  assert.deepEqual(evalStack([2, 3, "+"]), [5]);
  assert.deepEqual(evalStack([2, 3, "+", 4, "*"]), [20]);
});

test("THE ORDER: second operand pops first", () => {
  assert.deepEqual(evalStack([10, 3, "-"]), [7], "a - b, not b - a");
  assert.deepEqual(evalStack([20, 4, "/"]), [5]);
});

test("leftovers stay on the stack", () => {
  assert.deepEqual(evalStack([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(evalStack([]), []);
});

test("underflow throws something readable", () => {
  assert.throws(() => evalStack([1, "+"]), /\+/);
});

test("isBalanced does not evaluate", () => {
  assert.equal(isBalanced([2, 3, "+"]), true);
  assert.equal(isBalanced([2, 3, "+", 4, "*"]), true);
  assert.equal(isBalanced([1, "+"]), false, "underflow");
  assert.equal(isBalanced([1, 2]), false, "two values left");
  assert.equal(isBalanced([]), false, "no value left");
  assert.equal(isBalanced([1, 0, "/"]), true, "balance is not about the values");
});
