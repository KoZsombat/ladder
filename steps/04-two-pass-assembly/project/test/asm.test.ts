import { test } from "node:test";
import assert from "node:assert/strict";
import { assemble } from "../src/asm.ts";
import { OP, run } from "../src/vm.ts";

const { PUSH, ADD, SUB, MUL, PRINT, HALT, JMP } = OP;

test("byte-identical to the hand-typed project-04 arrays", () => {
  assert.deepEqual(assemble("push 2\npush 3\nadd\nprint\nhalt"),
    [PUSH, 2, PUSH, 3, ADD, PRINT, HALT]);
  assert.deepEqual(assemble("push 10\npush 3\nsub\nprint\nhalt"),
    [PUSH, 10, PUSH, 3, SUB, PRINT, HALT]);
  assert.deepEqual(assemble("push 2\npush 3\nadd\npush 4\nmul\nprint\nhalt"),
    [PUSH, 2, PUSH, 3, ADD, PUSH, 4, MUL, PRINT, HALT]);
});

test("and they still run correctly", () => {
  assert.deepEqual(run(assemble("push 2\npush 3\nadd\nprint\nhalt")).output, [5]);
});

test("comments and blank lines are stripped", () => {
  const prog = assemble(`
    ; a comment on its own line
    push 2      ; and a trailing one

    push 3
    add
    print
    halt
  `);
  assert.deepEqual(run(prog).output, [5]);
});

test("FORWARD reference: a label defined later in the file", () => {
  const prog = assemble(`
        jmp done
        push 99
        print
    done:
        push 1
        print
        halt
  `);
  assert.deepEqual(run(prog).output, [1], "the 99 must be jumped over");
});

test("backward reference works too", () => {
  const prog = assemble("start:\n  push 7\n  print\n  halt\n  jmp start");
  assert.deepEqual(run(prog).output, [7]);
});

test("a label consumes no address", () => {
  // the label sits between two instructions and must not shift anything
  assert.deepEqual(assemble("push 1\nhere:\npush 2\nadd\nhalt"),
    [PUSH, 1, PUSH, 2, OP.ADD, HALT]);
});

test("undefined label throws, naming it", () => {
  assert.throws(() => assemble("jmp nowhere\nhalt"), /nowhere/);
});

test("unknown mnemonic throws, naming it", () => {
  assert.throws(() => assemble("frobnicate 1\nhalt"), /frobnicate/);
});
