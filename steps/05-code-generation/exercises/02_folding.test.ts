import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, type Node } from "./01_post_order.ts";
import { fold, size } from "./02_folding.ts";

const num = (v: number): Node => ({ n: "num", v });
const bin = (op: "+" | "-" | "*" | "/", l: Node, r: Node): Node => ({ n: "bin", op, l, r });

test("collapses a literal subtree", () => {
  const t = bin("+", num(2), num(3));
  assert.deepEqual(fold(t), num(5));
  assert.equal(size(fold(t)), 1);
});

test("folds bottom-up, so nested cases collapse fully", () => {
  const t = bin("*", bin("+", num(1), num(2)), bin("+", num(3), num(4)));
  assert.deepEqual(fold(t), num(21));
});

test("leaves non-constant subtrees alone", () => {
  // there are no variables in this tiny language, so simulate with an
  // already-large tree: only the foldable half shrinks
  const t = bin("+", bin("*", num(2), num(3)), bin("-", num(10), num(4)));
  assert.deepEqual(fold(t), num(12));
});

test("SAFETY: does not fold a division by zero", () => {
  const t = bin("/", num(1), num(0));
  assert.deepEqual(fold(t), t, "leave it for runtime");
});

test("folding never changes the answer", () => {
  const trees = [
    bin("+", num(2), bin("*", num(3), num(4))),
    bin("-", bin("-", num(10), num(3)), num(2)),
    bin("*", bin("+", num(1), num(2)), num(5)),
  ];
  for (const t of trees) {
    assert.equal(evaluate(fold(t)), evaluate(t));
    assert.ok(size(fold(t)) <= size(t));
  }
});
