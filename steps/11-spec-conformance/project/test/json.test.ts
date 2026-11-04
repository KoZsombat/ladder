import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/json.ts";

test("literals and numbers", () => {
  assert.equal(parse("true"), true);
  assert.equal(parse("null"), null);
  assert.equal(parse("-1.5e2"), -150);
  assert.equal(parse("0"), 0);
});

test("structures", () => {
  assert.deepEqual(parse('{"a":[1,2,{"b":null}]}'), { a: [1, 2, { b: null }] });
  assert.deepEqual(parse("[]"), []);
  assert.deepEqual(parse("{}"), {});
});

test("strings and escapes", () => {
  assert.equal(parse('"a\\nb"'), "a\nb");
  assert.equal(parse('"\\u0041"'), "A");
  assert.equal(parse('"\\uD83D\\uDE00"'), "\u{1F600}", "surrogate pair");
});

test("round-trips against the built-in parser", () => {
  const src = JSON.stringify({
    name: "pkg", version: "1.0.0", deps: { a: "^1", b: "~2" },
    arr: [1, 2.5, -3e2, true, false, null], nested: { deep: { deeper: [[]] } },
    unicode: "héllo \u{1F600}",
  });
  assert.deepEqual(parse(src), JSON.parse(src));
});

test("rejects what the spec rejects", () => {
  const bad = [
    "", "{", "[1,]", '{"a":}', '{"a" 1}', "01", "+1", ".5", "1.",
    "Infinity", "NaN", "0x10", "'single'", "{} garbage", '"\u0001"', "[1 2]",
  ];
  for (const s of bad) {
    assert.throws(() => parse(s), `should reject: ${JSON.stringify(s)}`);
  }
});

test("depth limit instead of a stack overflow", () => {
  assert.throws(() => parse("[".repeat(100000) + "]".repeat(100000)));
});
