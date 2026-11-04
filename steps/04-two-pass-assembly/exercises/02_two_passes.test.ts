import { test } from "node:test";
import assert from "node:assert/strict";
import { clean } from "./01_cleaning.ts";
import { firstPass, secondPass, OPCODE } from "./02_two_passes.ts";

const asm = (src: string) => {
  const lines = clean(src);
  return secondPass(lines, firstPass(lines));
};

test("labels record SLOT addresses, not line numbers", () => {
  const labels = firstPass(clean("push 1\npush 2\nhere:\nadd\nhalt"));
  assert.equal(labels.get("here"), 4, "two pushes are four slots");
});

test("a label consumes no address", () => {
  const labels = firstPass(clean("a:\nb:\nhalt"));
  assert.equal(labels.get("a"), 0);
  assert.equal(labels.get("b"), 0);
});

test("FORWARD reference: a label defined later", () => {
  const prog = asm("jmp done\npush 99\nprint\ndone:\nhalt");
  assert.deepEqual(prog, [
    OPCODE.jmp, 5, OPCODE.push, 99, OPCODE.print, OPCODE.halt,
  ]);
});

test("backward reference", () => {
  const prog = asm("top:\npush 1\njmp top");
  assert.deepEqual(prog, [OPCODE.push, 1, OPCODE.jmp, 0]);
});

test("numeric operands pass through", () => {
  assert.deepEqual(asm("push 42\nhalt"), [OPCODE.push, 42, OPCODE.halt]);
});

test("an undefined label throws, naming it", () => {
  assert.throws(() => asm("jmp nowhere\nhalt"), /nowhere/);
});

test("an unknown instruction throws, naming it", () => {
  assert.throws(() => asm("frobnicate\nhalt"), /frobnicate/);
});
