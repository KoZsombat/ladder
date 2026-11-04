import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.ts";
import { evaluate, show } from "../src/eval.ts";

const ev = (s: string) => evaluate(parse(s));

test("precedence", () => assert.equal(ev("2 + 3 * 4"), 14));
test("grouping", () => assert.equal(ev("(2 + 3) * 4"), 20));
test("left associativity, not 9", () => assert.equal(ev("10 - 3 - 2"), 5));
test("right associativity, not 64", () => assert.equal(ev("2 ** 3 ** 2"), 512));
test("unary minus", () => assert.equal(ev("-3 + 5"), 2));
test("clear error, not a crash", () => assert.throws(() => ev("2 +")));

test("tree shape is visible", () => {
  assert.equal(show(parse("1 + 2 * 3 - 4")), "((1 + (2 * 3)) - 4)");
});

test("nested parens", () => assert.equal(ev("2 * (3 + (4 - 1))"), 12));
test("whitespace is irrelevant", () => assert.equal(ev("  2+3  *  4 "), 14));
