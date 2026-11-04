import { test as it } from "node:test";
import assert from "node:assert/strict";
import { re } from "../src/parse.ts";
import { test } from "../src/match.ts";

it("star", () => {
  assert.equal(test(re("a*b"), "aaab"), true);
  assert.equal(test(re("a*b"), "b"), true);
  assert.equal(test(re("a*b"), "ccc"), false);
});

it("THE test: a*a matches aaa — proves backtracking", () => {
  assert.equal(test(re("a*a"), "aaa"), true);
});

it("plus and groups", () => {
  assert.equal(test(re("(ab)+c"), "ababc"), true);
  assert.equal(test(re("(ab)+c"), "abac"), false);
});

it("alternation", () => {
  assert.equal(test(re("a|bc"), "a"), true);
  assert.equal(test(re("a|bc"), "bc"), true);
  assert.equal(test(re("^(a|bc)$".slice(1, -1)), "a"), true);
});

it("character classes", () => {
  assert.equal(test(re("[a-z]+"), "hello"), true);
  assert.equal(test(re("[0-9]"), "abc"), false);
  assert.equal(test(re("[^0-9]"), "a"), true);
});

it("dot", () => {
  assert.equal(test(re("a.c"), "abc"), true);
  assert.equal(test(re("a.c"), "axc"), true);
  assert.equal(test(re("a.c"), "ac"), false);
});

it("optional", () => {
  assert.equal(test(re("ab?c"), "ac"), true);
  assert.equal(test(re("ab?c"), "abc"), true);
});

it("postfix binds to one atom", () => {
  // ab* is a then zero-or-more b, NOT zero-or-more ab
  assert.equal(test(re("^ab*$".slice(1, -1)), "a"), true);
});
