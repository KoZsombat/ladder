import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, show, depth, type Node } from "./03_trees.ts";

const num = (v: number): Node => ({ n: "num", v });
const bin = (op: "+" | "-" | "*" | "/", l: Node, r: Node): Node => ({ n: "bin", op, l, r });

// 1 + 2 * 3
const tree: Node = bin("+", num(1), bin("*", num(2), num(3)));

test("evaluate", () => {
  assert.equal(evaluate(tree), 7);
  assert.equal(evaluate(num(42)), 42);
  assert.equal(evaluate({ n: "neg", e: num(5) }), -5);
  assert.equal(evaluate(bin("-", num(10), bin("-", num(3), num(2)))), 9);
});

test("show makes the shape visible", () => {
  assert.equal(show(tree), "(1 + (2 * 3))");
  assert.equal(show(num(5)), "5");
  assert.equal(show({ n: "neg", e: num(3) }), "(-3)");
});

test("the SHAPE is the precedence", () => {
  // same operators, same numbers, different tree, different answer
  const left = bin("*", bin("+", num(1), num(2)), num(3));  // (1 + 2) * 3
  assert.equal(evaluate(left), 9);
  assert.equal(evaluate(tree), 7);
});

test("depth", () => {
  assert.equal(depth(num(1)), 1);
  assert.equal(depth(tree), 3);
  assert.equal(depth({ n: "neg", e: num(1) }), 2);
});
