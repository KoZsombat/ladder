import { test } from "node:test";
import assert from "node:assert/strict";
import { Machine } from "./01_frames.ts";

test("call moves arguments into locals, in order", () => {
  const m = new Machine();
  m.stack.push(10, 20, 30);
  m.call(100, 2, 7);
  assert.equal(m.stack.length, 1, "the two arguments left the operand stack");
  assert.equal(m.stack[0], 10);
  assert.equal(m.load(0), 20, "first argument is slot 0");
  assert.equal(m.load(1), 30, "second argument is slot 1 — not reversed");
});

test("call returns the target and records where to resume", () => {
  const m = new Machine();
  m.stack.push(1);
  assert.equal(m.call(42, 1, 9), 42);
  assert.equal(m.ret(), 9);
});

test("locals are frame-relative, so recursion does not trample", () => {
  const m = new Machine();
  m.stack.push(1);
  m.call(0, 1, 0);
  m.store(1, 111);
  m.stack.push(2);
  m.call(0, 1, 0);
  m.store(1, 222);
  assert.equal(m.load(0), 2, "inner frame sees its own argument");
  assert.equal(m.load(1), 222);
  m.ret();
  assert.equal(m.load(0), 1, "outer frame's argument is intact");
  assert.equal(m.load(1), 111, "and so is its local");
});

test("ret truncates the locals", () => {
  const m = new Machine();
  m.stack.push(5);
  m.call(0, 1, 0);
  m.store(3, 99);
  const before = m.locals.length;
  m.ret();
  assert.ok(m.locals.length < before, "locals must shrink on return");
});

test("the return value stays on the operand stack", () => {
  const m = new Machine();
  m.stack.push(5);
  m.call(0, 1, 0);
  m.stack.push(777);          // the callee's result
  m.ret();
  assert.deepEqual(m.stack, [777]);
});

test("returning from the outermost frame gives null", () => {
  const m = new Machine();
  assert.equal(m.ret(), null);
});

test("runaway recursion is a clean error, not a host crash", () => {
  const m = new Machine();
  assert.throws(() => {
    for (let i = 0; i < 1000; i++) { m.stack.push(1); m.call(0, 1, 0); }
  }, /stack overflow/i);
});

test("trace reports one entry per live frame", () => {
  const m = new Machine();
  m.stack.push(1); m.call(0, 1, 11);
  m.stack.push(1); m.call(0, 1, 22);
  assert.deepEqual(m.trace(), [-1, 11, 22]);
});
