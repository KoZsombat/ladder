import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProgram } from "../src/parser.ts";
import { compile } from "../src/compiler.ts";
import { run } from "../src/vm.ts";

const exec = (src: string) => run(compile(parseProgram(src)));

test("assignment and print", () => {
  assert.deepEqual(exec("x = 7; print x").output, [7]);
});

test("arithmetic with variables", () => {
  assert.deepEqual(exec("x = 10; y = 4; print x - y").output, [6]);
});

test("THE countdown: while prints 10 down to 1", () => {
  const out = exec("x = 10\nwhile x { print x; x = x - 1 }").output;
  assert.deepEqual(out, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
});

test("if with a false condition skips its body and resumes after", () => {
  const out = exec("x = 5\nif x - 5 { print 99 }\nprint 42").output;
  assert.deepEqual(out, [42]);
});

test("if with a true condition runs its body", () => {
  const out = exec("x = 5\nif x { print 1 }\nprint 2").output;
  assert.deepEqual(out, [1, 2]);
});

test("nested while inside if", () => {
  const out = exec("n = 3\nif n { while n { print n; n = n - 1 } }\nprint 0").output;
  assert.deepEqual(out, [3, 2, 1, 0]);
});

test("the stack is empty at HALT", () => {
  const r = exec("x = 1; 2 + 2; print x");
  assert.equal(r.stack.length, 0, "an expression statement must be followed by POP");
});

test("two variables get two different slots", () => {
  assert.deepEqual(exec("a = 1; b = 2; print a; print b").output, [1, 2]);
});
