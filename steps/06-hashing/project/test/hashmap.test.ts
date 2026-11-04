import { test } from "node:test";
import assert from "node:assert/strict";
import { HashMap, fnv1a } from "../src/hashmap.ts";

test("fnv1a is deterministic, unsigned, and spreads", () => {
  assert.equal(fnv1a("hello"), fnv1a("hello"));
  assert.notEqual(fnv1a("hello"), fnv1a("world"));
  for (const s of ["", "a", "zzzzzzzzzz", "Ω"]) {
    const h = fnv1a(s);
    assert.ok(Number.isInteger(h) && h >= 0, `${s} hashed to ${h}`);
  }
  // crude distribution check: 1000 words over 16 buckets should not be lumpy
  const counts = new Array(16).fill(0);
  for (let i = 0; i < 1000; i++) counts[fnv1a(`word${i}`) % 16]++;
  assert.ok(Math.max(...counts) < 120, `lumpy distribution: ${counts}`);
});

test("set, get, delete", () => {
  const m = new HashMap<number>();
  m.set("a", 1);
  m.set("b", 2);
  assert.equal(m.get("a"), 1);
  assert.equal(m.get("missing"), undefined);
  assert.equal(m.delete("a"), true);
  assert.equal(m.delete("a"), false);
  assert.equal(m.get("a"), undefined);
  assert.equal(m.size, 1);
});

test("overwrite does not grow the count", () => {
  const m = new HashMap<number>();
  m.set("k", 1);
  m.set("k", 2);
  assert.equal(m.size, 1);
  assert.equal(m.get("k"), 2);
});

test("100k round trip with several resizes", () => {
  const m = new HashMap<number>();
  const startCap = m.capacity;
  for (let i = 0; i < 100_000; i++) m.set(`k${i}`, i);
  assert.ok(m.capacity >= startCap * 8, "should have resized at least three times");
  for (let i = 0; i < 100_000; i++) assert.equal(m.get(`k${i}`), i, `lost k${i}`);
  for (let i = 0; i < 100_000; i += 2) m.delete(`k${i}`);
  assert.equal(m.size, 50_000);
  for (let i = 1; i < 100_000; i += 2) assert.equal(m.get(`k${i}`), i);
});

test("genuine collisions all survive", () => {
  // force collisions by using a tiny modulus indirectly: many keys, few buckets
  const m = new HashMap<string>();
  const keys: string[] = [];
  for (let i = 0; i < 200; i++) { keys.push(`c${i}`); m.set(`c${i}`, `v${i}`); }
  for (const k of keys) assert.equal(m.get(k), `v${k.slice(1)}`);
});

test("keys() yields every key exactly once", () => {
  const m = new HashMap<number>();
  for (let i = 0; i < 50; i++) m.set(`k${i}`, i);
  const seen = [...m.keys()].sort();
  assert.equal(seen.length, 50);
  assert.equal(new Set(seen).size, 50);
});
