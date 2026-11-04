import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenize } from "./02_scanner.ts";

test("numbers, words and symbols", () => {
  assert.deepEqual(tokenize("12 + ab3"), [
    { t: "num", v: 12 },
    { t: "sym", v: "+" },
    { t: "word", v: "ab3" },
    { t: "eof" },
  ]);
});

test("whitespace is irrelevant", () => {
  assert.deepEqual(tokenize("  1   -  2 "), tokenize("1-2"));
});

test("THE TRAP: longest symbol first", () => {
  assert.deepEqual(tokenize("a <= b"), [
    { t: "word", v: "a" },
    { t: "sym", v: "<=" },
    { t: "word", v: "b" },
    { t: "eof" },
  ]);
  assert.deepEqual(tokenize("a < b"), [
    { t: "word", v: "a" },
    { t: "sym", v: "<" },
    { t: "word", v: "b" },
    { t: "eof" },
  ]);
});

test("empty input is just eof", () => {
  assert.deepEqual(tokenize(""), [{ t: "eof" }]);
});

test("an unknown character throws, naming it and its position", () => {
  assert.throws(() => tokenize("1 $ 2"), /\$/);
  assert.throws(() => tokenize("1 $ 2"), /2/);
});
