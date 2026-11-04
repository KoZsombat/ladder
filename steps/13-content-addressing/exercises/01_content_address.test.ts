import { test } from "node:test";
import assert from "node:assert/strict";
import { wrap, objectId, unwrap, Store } from "./01_content_address.ts";

test("wrap builds the git header", () => {
  const w = wrap("blob", Buffer.from("hello"));
  assert.equal(w.toString(), "blob 5\u0000hello");
});

test("the length is in BYTES, not characters", () => {
  const w = wrap("blob", Buffer.from("héllo"));
  assert.ok(w.toString().startsWith("blob 6\u0000"), `got ${JSON.stringify(w.toString())}`);
});

test("THE KNOWN ANSWER: git's hash of an empty blob", () => {
  // this is the real, famous hash — if yours matches, your format is right
  assert.equal(objectId("blob", Buffer.alloc(0)), "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391");
});

test("another known answer", () => {
  // `printf 'hello' | git hash-object --stdin`
  assert.equal(objectId("blob", Buffer.from("hello")), "b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0");
});

test("the hash covers the header, so the type matters", () => {
  const c = Buffer.from("same bytes");
  assert.notEqual(objectId("blob", c), objectId("tree", c));
});

test("identical content is stored once", () => {
  const s = new Store();
  const a = s.put("blob", Buffer.from("x"));
  const b = s.put("blob", Buffer.from("x"));
  assert.equal(a, b);
  assert.equal(s.size(), 1, "content addressing deduplicates for free");
});

test("round trip through the store", () => {
  const s = new Store();
  const id = s.put("blob", Buffer.from("content here"));
  const got = s.get(id);
  assert.ok(got);
  assert.deepEqual(unwrap(got!), { type: "blob", content: Buffer.from("content here") });
  assert.equal(s.get("0".repeat(40)), undefined);
});

test("unwrap rejects a corrupt object", () => {
  assert.throws(() => unwrap(Buffer.from("blob 99\u0000short")));
  assert.throws(() => unwrap(Buffer.from("no null byte here")));
});
