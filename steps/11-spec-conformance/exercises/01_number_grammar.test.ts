import { test } from "node:test";
import assert from "node:assert/strict";
import { isJsonNumber, readNumber } from "./01_number_grammar.ts";

test("accepts what the grammar allows", () => {
  for (const s of ["0", "-0", "1", "-1", "1.5", "1e10", "1E+10", "1e-10", "-1.5e3", "12345", "0.5"]) {
    assert.equal(isJsonNumber(s), true, `should accept ${s}`);
  }
});

test("rejects what the grammar forbids", () => {
  for (const s of ["01", "+1", ".5", "1.", "1.e3", "Infinity", "NaN", "0x10", "", " 1", "1 ", "1_000", "--1", "1e", "1e+"]) {
    assert.equal(isJsonNumber(s), false, `should reject ${s}`);
  }
});

test("Number() would have accepted most of those", () => {
  // the reason this exercise exists
  assert.ok(!Number.isNaN(Number("0x10")));
  assert.ok(!Number.isNaN(Number(".5")));
  assert.ok(!Number.isNaN(Number("+1")));
  assert.ok(!Number.isNaN(Number("")));
  assert.ok(!Number.isNaN(Number("Infinity")));
});

test("readNumber returns the value and the new index", () => {
  assert.deepEqual(readNumber("123,", 0), [123, 3]);
  assert.deepEqual(readNumber("[-1.5e3]", 1), [-1500, 7]);
  assert.deepEqual(readNumber("0", 0), [0, 1]);
});

test("readNumber stops at the first non-number character", () => {
  assert.deepEqual(readNumber("12}", 0), [12, 2]);
  assert.deepEqual(readNumber("1 2", 0), [1, 1]);
});

test("readNumber throws on an illegal number", () => {
  assert.throws(() => readNumber("01", 0));
  assert.throws(() => readNumber("abc", 0));
});
