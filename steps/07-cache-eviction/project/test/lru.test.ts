import { test } from "node:test";
import assert from "node:assert/strict";
import { LRU } from "../src/lru.ts";

test("THE trace: capacity 2", () => {
  const c = new LRU<number>(2);
  c.put("1", 1); c.checkInvariant();
  c.put("2", 2); c.checkInvariant();
  assert.equal(c.get("1"), 1);          // 1 is now the most recent
  c.put("3", 3); c.checkInvariant();
  assert.equal(c.get("2"), undefined, "2 should have been evicted, not 1");
  assert.equal(c.get("1"), 1);
  c.put("2", 4); c.checkInvariant();
  assert.equal(c.get("1"), undefined, "1 should now be evicted (3 is newer)");
  assert.equal(c.get("2"), 4);
});

test("a hit moves the entry to the front", () => {
  const c = new LRU<number>(3);
  c.put("a", 1); c.put("b", 2); c.put("c", 3);
  c.get("a");
  assert.deepEqual(c.keysMRU(), ["a", "c", "b"]);
});

test("updating an existing key also moves it", () => {
  const c = new LRU<number>(3);
  c.put("a", 1); c.put("b", 2); c.put("c", 3);
  c.put("a", 9);
  assert.deepEqual(c.keysMRU(), ["a", "c", "b"]);
  assert.equal(c.size, 3);
});

test("capacity 1", () => {
  const c = new LRU<number>(1);
  c.put("a", 1); c.put("b", 2);
  assert.equal(c.get("a"), undefined);
  assert.equal(c.get("b"), 2);
  assert.equal(c.size, 1);
});

test("capacity 0 stores nothing", () => {
  const c = new LRU<number>(0);
  c.put("a", 1);
  assert.equal(c.get("a"), undefined);
  assert.equal(c.size, 0);
});

test("eviction removes the key from the map too", () => {
  const c = new LRU<number>(10);
  for (let i = 0; i < 1000; i++) c.put(`k${i}`, i);
  assert.equal(c.size, 10, "map is leaking evicted keys");
  c.checkInvariant();
});

test("a million operations stay linear and consistent", () => {
  const c = new LRU<number>(100);
  const t0 = Date.now();
  for (let i = 0; i < 1_000_000; i++) {
    c.put(`k${i % 500}`, i);
    if (i % 3 === 0) c.get(`k${i % 500}`);
  }
  c.checkInvariant();
  assert.ok(Date.now() - t0 < 10_000, "too slow — something is O(n)");
});
