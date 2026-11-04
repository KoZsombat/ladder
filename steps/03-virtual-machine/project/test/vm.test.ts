import { test } from "node:test";
import assert from "node:assert/strict";
import { OP, run } from "../src/vm.ts";

const { PUSH, ADD, SUB, MUL, DIV, PRINT, HALT, POP } = OP;

test("2 + 3 = 5", () => {
  assert.deepEqual(run([PUSH, 2, PUSH, 3, ADD, PRINT, HALT]).output, [5]);
});

test("10 - 3 = 7, not -7", () => {
  assert.deepEqual(run([PUSH, 10, PUSH, 3, SUB, PRINT, HALT]).output, [7]);
});

test("(2 + 3) * 4 = 20", () => {
  assert.deepEqual(
    run([PUSH, 2, PUSH, 3, ADD, PUSH, 4, MUL, PRINT, HALT]).output,
    [20],
  );
});

test("20 / 4 = 5, not 4 / 20", () => {
  assert.deepEqual(run([PUSH, 20, PUSH, 4, DIV, PRINT, HALT]).output, [5]);
});

test("stack is empty at HALT for a balanced program", () => {
  assert.equal(run([PUSH, 1, PUSH, 2, ADD, POP, HALT]).stack.length, 0);
});

test("unknown opcode throws, naming the address", () => {
  assert.throws(() => run([99, HALT]), /99/);
});

test("trace does not change the result", () => {
  const a = run([PUSH, 2, PUSH, 3, ADD, PRINT, HALT], false);
  const b = run([PUSH, 2, PUSH, 3, ADD, PRINT, HALT], true);
  assert.deepEqual(a.output, b.output);
});
