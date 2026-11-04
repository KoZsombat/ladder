import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyList, unlink, toFront, keys, type N } from "./01_linked_list.ts";

const node = (key: string) => ({ key }) as N;

test("empty list", () => {
  const l = emptyList();
  assert.deepEqual(keys(l), []);
  assert.equal(l.head.next, l.tail);
  assert.equal(l.tail.prev, l.head);
});

test("toFront builds most-recent-first", () => {
  const l = emptyList();
  for (const k of ["a", "b", "c"]) toFront(l, node(k));
  assert.deepEqual(keys(l), ["c", "b", "a"]);
});

test("unlink from the middle", () => {
  const l = emptyList();
  const a = node("a"), b = node("b"), c = node("c");
  toFront(l, a); toFront(l, b); toFront(l, c);   // c b a
  unlink(b);
  assert.deepEqual(keys(l), ["c", "a"]);
});

test("unlink the only node", () => {
  const l = emptyList();
  const a = node("a");
  toFront(l, a);
  unlink(a);
  assert.deepEqual(keys(l), [], "sentinels make this case need no special handling");
});

test("unlink then toFront is a move", () => {
  const l = emptyList();
  const a = node("a"), b = node("b"), c = node("c");
  toFront(l, a); toFront(l, b); toFront(l, c);   // c b a
  unlink(a); toFront(l, a);
  assert.deepEqual(keys(l), ["a", "c", "b"]);
});

test("the last real node is reachable from the tail", () => {
  const l = emptyList();
  const a = node("a"), b = node("b");
  toFront(l, a); toFront(l, b);                  // b a
  assert.equal(l.tail.prev.key, "a", "tail.prev is the eviction victim");
});
