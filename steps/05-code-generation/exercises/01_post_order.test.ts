import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, compile, runFlat, type Node } from "./01_post_order.ts";

const num = (v: number): Node => ({ n: "num", v });
const bin = (op: "+" | "-" | "*" | "/", l: Node, r: Node): Node => ({ n: "bin", op, l, r });

const trees: Node[] = [
  bin("+", num(2), bin("*", num(3), num(4))),      // 2 + 3 * 4
  bin("*", bin("+", num(2), num(3)), num(4)),      // (2 + 3) * 4
  bin("-", bin("-", num(10), num(3)), num(2)),     // 10 - 3 - 2
  bin("/", num(100), bin("/", num(10), num(2))),   // 100 / (10 / 2)
  num(7),
];

test("emits in post-order", () => {
  const out: (number | string)[] = [];
  compile(trees[0], out);
  assert.deepEqual(out, [2, 3, 4, "*", "+"]);
});

test("left child is emitted first", () => {
  const out: (number | string)[] = [];
  compile(bin("-", num(10), num(3)), out);
  assert.deepEqual(out, [10, 3, "-"], "right-then-left gives you -7");
});

test("THE DIFFERENTIAL TEST: both paths agree", () => {
  for (const t of trees) {
    const out: (number | string)[] = [];
    compile(t, out);
    assert.equal(runFlat(out), evaluate(t), `disagreement on ${JSON.stringify(t)}`);
  }
});
