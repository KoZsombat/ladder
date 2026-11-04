import { test } from "node:test";
import assert from "node:assert/strict";
import { chainSet, chainGet, chainDelete, rehash, type Entry } from "./02_chaining.ts";
import { fnv1a } from "./01_hashing.ts";

test("set and get along a chain", () => {
  let head: Entry | null = null;
  let added: boolean;
  [head, added] = chainSet(head, "a", 1);
  assert.equal(added, true);
  [head, added] = chainSet(head, "b", 2);
  assert.equal(added, true);
  assert.equal(chainGet(head, "a"), 1);
  assert.equal(chainGet(head, "b"), 2);
  assert.equal(chainGet(head, "zzz"), undefined);
});

test("overwrite reports added = false", () => {
  let [head, _] = chainSet(null, "k", 1);
  const [head2, added] = chainSet(head, "k", 2);
  assert.equal(added, false, "an overwrite must not count as a new entry");
  assert.equal(chainGet(head2, "k"), 2);
});

test("delete from the head and from the middle", () => {
  let head: Entry | null = null;
  for (const k of ["a", "b", "c"]) [head] = chainSet(head, k, 1);
  let removed: boolean;
  [head, removed] = chainDelete(head, "b");
  assert.equal(removed, true);
  assert.equal(chainGet(head, "b"), undefined);
  assert.equal(chainGet(head, "a"), 1);
  assert.equal(chainGet(head, "c"), 1);

  [head, removed] = chainDelete(head, "nope");
  assert.equal(removed, false);
});

test("rehash moves every entry and keeps them all findable", () => {
  const SIZE = 8;
  let buckets: (Entry | null)[] = new Array(SIZE).fill(null);
  const keys = Array.from({ length: 200 }, (_, i) => `k${i}`);
  for (const k of keys) {
    const i = fnv1a(k) % SIZE;
    [buckets[i]] = chainSet(buckets[i], k, Number(k.slice(1)));
  }

  const bigger = rehash(buckets, SIZE * 4, fnv1a);
  assert.equal(bigger.length, SIZE * 4);
  for (const k of keys) {
    const i = fnv1a(k) % bigger.length;
    assert.equal(chainGet(bigger[i], k), Number(k.slice(1)), `lost ${k} in the rehash`);
  }
});

test("rehash actually redistributes rather than copying", () => {
  const buckets: (Entry | null)[] = new Array(4).fill(null);
  for (const k of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
    const i = fnv1a(k) % 4;
    [buckets[i]] = chainSet(buckets[i], k, 1);
  }
  const bigger = rehash(buckets, 32, fnv1a);
  const used = bigger.filter((b) => b !== null).length;
  assert.ok(used > 2, `only ${used} buckets used after growing to 32 — did you copy instead of re-hash?`);
});
