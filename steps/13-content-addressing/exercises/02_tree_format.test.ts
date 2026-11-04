import { test } from "node:test";
import assert from "node:assert/strict";
import { encodeTree, decodeTree, encodeCommit, type TreeEntry } from "./02_tree_format.ts";
import { objectId } from "./01_content_address.ts";

const ID_A = "a".repeat(40);
const ID_B = "b".repeat(40);

test("an entry is mode, space, name, NUL, then 20 RAW bytes", () => {
  const buf = encodeTree([{ mode: "100644", name: "a.txt", id: ID_A }]);
  assert.equal(buf.subarray(0, 13).toString(), "100644 a.txt\u0000");
  assert.equal(buf.length, 13 + 20, "the id must be 20 bytes, not 40 hex characters");
  assert.deepEqual(buf.subarray(13), Buffer.from(ID_A, "hex"));
});

test("entries are sorted by name", () => {
  const buf = encodeTree([
    { mode: "100644", name: "z.txt", id: ID_A },
    { mode: "100644", name: "a.txt", id: ID_B },
  ]);
  assert.ok(buf.toString("latin1").indexOf("a.txt") < buf.toString("latin1").indexOf("z.txt"));
});

test("no separator between entries", () => {
  const buf = encodeTree([
    { mode: "100644", name: "a", id: ID_A },
    { mode: "100644", name: "b", id: ID_B },
  ]);
  assert.equal(buf.length, (9 + 20) * 2, "nothing between them, not even a newline");
});

test("round trip", () => {
  const entries: TreeEntry[] = [
    { mode: "100644", name: "readme.md", id: ID_A },
    { mode: "40000", name: "src", id: ID_B },
    { mode: "100755", name: "build.sh", id: ID_A },
  ];
  const back = decodeTree(encodeTree(entries));
  assert.deepEqual(back, [...entries].sort((x, y) => (x.name < y.name ? -1 : 1)));
});

test("a bad id is rejected early", () => {
  assert.throws(() => encodeTree([{ mode: "100644", name: "a", id: "nothex" }]));
  assert.throws(() => encodeTree([{ mode: "100644", name: "a", id: "ab" }]));
});

test("a tree hashes as a tree", () => {
  const buf = encodeTree([{ mode: "100644", name: "a.txt", id: ID_A }]);
  const id = objectId("tree", buf);
  assert.match(id, /^[0-9a-f]{40}$/);
});

test("commit text", () => {
  const buf = encodeCommit({
    tree: ID_A, parents: [], who: "Zsombor <z@example.com>",
    when: 1700000000, tz: "+0100", message: "first",
  });
  assert.equal(
    buf.toString(),
    `tree ${ID_A}\n` +
    `author Zsombor <z@example.com> 1700000000 +0100\n` +
    `committer Zsombor <z@example.com> 1700000000 +0100\n` +
    `\nfirst\n`,
  );
});

test("a merge commit has two parents", () => {
  const buf = encodeCommit({
    tree: ID_A, parents: [ID_A, ID_B], who: "x <x@x>",
    when: 1, tz: "+0000", message: "merge",
  });
  const lines = buf.toString().split("\n");
  assert.equal(lines[1], `parent ${ID_A}`);
  assert.equal(lines[2], `parent ${ID_B}`);
});
