import { test } from "node:test";
import assert from "node:assert/strict";
import { isHighSurrogate, isLowSurrogate, combine, decodeStringBody } from "./02_surrogates.ts";

test("surrogate ranges", () => {
  assert.equal(isHighSurrogate(0xd800), true);
  assert.equal(isHighSurrogate(0xdbff), true);
  assert.equal(isHighSurrogate(0xdc00), false);
  assert.equal(isLowSurrogate(0xdc00), true);
  assert.equal(isLowSurrogate(0xdfff), true);
  assert.equal(isLowSurrogate(0xd800), false);
  assert.equal(isHighSurrogate(0x41), false);
});

test("combine", () => {
  assert.equal(combine(0xd83d, 0xde00), 0x1f600); // the grinning face
  assert.equal(combine(0xd800, 0xdc00), 0x10000); // the first non-BMP point
});

test("simple escapes", () => {
  assert.equal(decodeStringBody("a\\nb"), "a\nb");
  assert.equal(decodeStringBody("\\\\"), "\\");
  assert.equal(decodeStringBody('\\"'), '"');
  assert.equal(decodeStringBody("\\t\\r\\b\\f\\/"), "\t\r\b\f/");
  assert.equal(decodeStringBody("plain"), "plain");
  assert.equal(decodeStringBody(""), "");
});

test("BMP unicode escapes", () => {
  assert.equal(decodeStringBody("\\u0041"), "A");
  assert.equal(decodeStringBody("h\\u00e9llo"), "héllo");
});

test("THE ONE: a surrogate pair becomes one character", () => {
  const s = decodeStringBody("\\uD83D\\uDE00");
  assert.equal(s, "\u{1F600}");
  assert.equal([...s].length, 1, "one CHARACTER");
  assert.equal(s.length, 2, "but two code units");
});

test("a lone high surrogate is rejected", () => {
  assert.throws(() => decodeStringBody("\\uD83D"));
  assert.throws(() => decodeStringBody("\\uD83Dx"));
  assert.throws(() => decodeStringBody("\\uD83D\\u0041"), "followed by a non-surrogate");
});

test("an unescaped control character is rejected", () => {
  assert.throws(() => decodeStringBody("a\u0001b"));
  assert.throws(() => decodeStringBody("a\nb"), "a literal newline is not allowed");
});

test("an unknown escape is rejected", () => {
  assert.throws(() => decodeStringBody("\\x41"));
});
