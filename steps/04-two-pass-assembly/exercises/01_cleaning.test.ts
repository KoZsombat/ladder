import { test } from "node:test";
import assert from "node:assert/strict";
import { clean } from "./01_cleaning.ts";

test("comments, blanks and indentation", () => {
  assert.deepEqual(
    clean("  ; a whole-line comment\n  push 10   ; trailing\n\n  halt\n"),
    [
      { kind: "instr", op: "push", arg: "10" },
      { kind: "instr", op: "halt", arg: undefined },
    ],
  );
});

test("labels", () => {
  assert.deepEqual(clean("start:\n  jmp start"), [
    { kind: "label", name: "start" },
    { kind: "instr", op: "jmp", arg: "start" },
  ]);
});

test("case is normalised", () => {
  assert.deepEqual(clean("PUSH 1"), [{ kind: "instr", op: "push", arg: "1" }]);
});

test("empty input", () => {
  assert.deepEqual(clean(""), []);
  assert.deepEqual(clean("\n\n  \n; nothing\n"), []);
});
