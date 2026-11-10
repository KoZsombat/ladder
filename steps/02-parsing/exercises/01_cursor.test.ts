import { test } from "node:test";
import assert from "node:assert/strict";
import { cursor, takeWhile } from "./01_cursor.ts";

test("peek does not advance, next does", () => {
  const c = cursor([1, 2, 3]);
  assert.equal(c.peek(), 1);
  assert.equal(c.peek(), 1);
  assert.equal(c.next(), 1);
  assert.equal(c.peek(), 2);
  assert.equal(c.pos(), 1);
});

test("past the end is undefined, not a throw", () => {
  const c = cursor<number>([]);
  assert.equal(c.peek(), undefined);
  assert.equal(c.next(), undefined);
  assert.equal(c.eof(), true);
});

test("eat only advances on a match", () => {
  const c = cursor(["a", "b"]);
  assert.equal(c.eat("z"), false);
  assert.equal(c.pos(), 0, "a failed eat must not consume");
  assert.equal(c.eat("a"), true);
  assert.equal(c.pos(), 1);
});

test("expect throws a message naming both sides", () => {
  const c = cursor(["a"]);
  assert.throws(() => c.expect("b"), /b/);
  assert.throws(() => c.expect("b"), /a/);
  assert.equal(c.expect("a"), "a");
});

test("takeWhile", () => {
  const c = cursor([..."123abc"]);
  assert.deepEqual(takeWhile(c, (ch) => ch >= "0" && ch <= "9"), ["1", "2", "3"]);
  assert.equal(c.peek(), "a", "it must stop before the first non-match");
  assert.deepEqual(takeWhile(c, () => false), []);
});
