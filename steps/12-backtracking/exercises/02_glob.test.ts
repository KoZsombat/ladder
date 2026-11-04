import { test } from "node:test";
import assert from "node:assert/strict";
import { matches, matchCost } from "./02_glob.ts";

test("literals", () => {
  assert.equal(matches("abc", "abc"), true);
  assert.equal(matches("abc", "abd"), false);
  assert.equal(matches("abc", "ab"), false);
  assert.equal(matches("", ""), true);
  assert.equal(matches("", "a"), false);
});

test("question mark", () => {
  assert.equal(matches("a?c", "abc"), true);
  assert.equal(matches("a?c", "ac"), false, "? must consume exactly one");
  assert.equal(matches("???", "abc"), true);
});

test("star", () => {
  assert.equal(matches("a*", "a"), true);
  assert.equal(matches("a*", "abcdef"), true);
  assert.equal(matches("*", ""), true);
  assert.equal(matches("*c", "abc"), true);
});

test("THE GIVE-BACK: the star must hand characters back", () => {
  assert.equal(matches("*a", "aaa"), true, "the star cannot eat all three");
  assert.equal(matches("a*a", "aaa"), true);
  assert.equal(matches("*a*b", "xaybzb"), true);
  assert.equal(matches("a*b*c", "abbbbc"), true);
});

test("failures", () => {
  assert.equal(matches("a*b", "acd"), false);
  assert.equal(matches("*x", "abc"), false);
});

test("THE BLOW-UP: adjacent stars multiply the work", () => {
  const cheap = matchCost("*a", "a".repeat(14) + "b");
  const dear = matchCost("*a*a*a*a", "a".repeat(14) + "b");
  assert.ok(dear > cheap * 20, `${dear} vs ${cheap}: nested backtracking should explode`);
  // In the project this becomes /(a+)+b/ and goes from "slow" to "hangs".
  // That is ReDoS, and it has taken down production systems.
});
