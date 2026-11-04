import { test } from "node:test";
import assert from "node:assert/strict";
import { instructionAddresses, disassemble, OP } from "./02_fetch_decode.ts";

const { PUSH, ADD, PRINT, JMP, HALT } = OP;

test("addresses skip over operands", () => {
  assert.deepEqual(instructionAddresses([PUSH, 2, ADD, HALT]), [0, 2, 3]);
  assert.deepEqual(instructionAddresses([PUSH, 2, PUSH, 3, ADD, PRINT, HALT]), [0, 2, 4, 5, 6]);
  assert.deepEqual(instructionAddresses([HALT]), [0]);
  assert.deepEqual(instructionAddresses([]), []);
});

test("jumps have operands too", () => {
  assert.deepEqual(instructionAddresses([JMP, 4, PUSH, 1, HALT]), [0, 2, 4]);
});

test("disassemble", () => {
  assert.deepEqual(disassemble([PUSH, 2, PUSH, 3, ADD, HALT]), [
    "0: PUSH 2",
    "2: PUSH 3",
    "4: ADD",
    "5: HALT",
  ]);
});
