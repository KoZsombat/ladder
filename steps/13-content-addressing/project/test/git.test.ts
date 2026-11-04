import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  wrap, objectId, writeObject, readObject, encodeTree, encodeCommit,
  updateRef, readRef, log,
} from "../src/objects.ts";

function sandbox(): string {
  const dir = mkdtempSync(join(tmpdir(), "ladder-git-"));
  execFileSync("git", ["init", "-q", "-b", "main"], { cwd: dir });
  return dir;
}
const git = (dir: string, ...args: string[]) =>
  execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();

test("KNOWN ANSWERS: your hashes match real git's", () => {
  assert.equal(objectId("blob", Buffer.alloc(0)), "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391");
  assert.equal(objectId("blob", Buffer.from("hello")), "b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0");
});

test("git itself can read a blob you wrote", () => {
  const dir = sandbox();
  const id = writeObject(join(dir, ".git"), "blob", Buffer.from("hello from my own code\n"));
  assert.equal(git(dir, "cat-file", "-t", id), "blob");
  assert.equal(git(dir, "cat-file", "-p", id), "hello from my own code");
});

test("you can read your own objects back", () => {
  const dir = sandbox();
  const gitDir = join(dir, ".git");
  const id = writeObject(gitDir, "blob", Buffer.from("round trip"));
  assert.deepEqual(readObject(gitDir, id), { type: "blob", content: Buffer.from("round trip") });
});

test("git itself can read a TREE you wrote", () => {
  const dir = sandbox();
  const gitDir = join(dir, ".git");
  const blob = writeObject(gitDir, "blob", Buffer.from("content\n"));
  const tree = writeObject(gitDir, "tree", encodeTree([
    { mode: "100644", name: "hello.txt", id: blob },
  ]));
  const out = git(dir, "cat-file", "-p", tree);
  assert.match(out, /^100644 blob [0-9a-f]{40}\thello\.txt$/,
    "if this fails you probably wrote hex into the tree instead of 20 raw bytes");
});

test("a full commit, and git log sees it", () => {
  const dir = sandbox();
  const gitDir = join(dir, ".git");
  const blob = writeObject(gitDir, "blob", Buffer.from("v1\n"));
  const tree = writeObject(gitDir, "tree", encodeTree([{ mode: "100644", name: "f.txt", id: blob }]));
  const commit = writeObject(gitDir, "commit", encodeCommit({
    tree, parents: [], who: "Test <t@example.com>",
    when: 1700000000, tz: "+0100", message: "first commit",
  }));
  updateRef(gitDir, "refs/heads/main", commit);

  assert.equal(readRef(gitDir, "refs/heads/main"), commit);
  assert.match(git(dir, "log", "--oneline"), /first commit/);
  assert.equal(git(dir, "rev-parse", "HEAD"), commit);
});

test("THE ONE THAT MATTERS: git fsck is clean", () => {
  const dir = sandbox();
  const gitDir = join(dir, ".git");
  const blob = writeObject(gitDir, "blob", Buffer.from("v1\n"));
  const tree = writeObject(gitDir, "tree", encodeTree([{ mode: "100644", name: "f.txt", id: blob }]));
  const commit = writeObject(gitDir, "commit", encodeCommit({
    tree, parents: [], who: "Test <t@example.com>",
    when: 1700000000, tz: "+0100", message: "first",
  }));
  updateRef(gitDir, "refs/heads/main", commit);

  const out = execFileSync("git", ["fsck", "--strict"], { cwd: dir, encoding: "utf8" });
  assert.equal(out.trim(), "", `git fsck complained:\n${out}`);
});

test("history is a linked list", () => {
  const dir = sandbox();
  const gitDir = join(dir, ".git");
  const mk = (text: string, parents: string[]) => {
    const b = writeObject(gitDir, "blob", Buffer.from(text));
    const t = writeObject(gitDir, "tree", encodeTree([{ mode: "100644", name: "f.txt", id: b }]));
    return writeObject(gitDir, "commit", encodeCommit({
      tree: t, parents, who: "Test <t@example.com>",
      when: 1700000000, tz: "+0100", message: text.trim(),
    }));
  };
  const c1 = mk("one\n", []);
  const c2 = mk("two\n", [c1]);
  updateRef(gitDir, "refs/heads/main", c2);

  assert.deepEqual(log(gitDir, c2), [c2, c1]);
  assert.equal(git(dir, "rev-list", "--count", "HEAD"), "2");
});

test("entries must be sorted, or fsck notices", () => {
  const dir = sandbox();
  const gitDir = join(dir, ".git");
  const b = writeObject(gitDir, "blob", Buffer.from("x"));
  const tree = writeObject(gitDir, "tree", encodeTree([
    { mode: "100644", name: "zebra", id: b },
    { mode: "100644", name: "apple", id: b },
  ]));
  const out = git(dir, "cat-file", "-p", tree);
  assert.ok(out.indexOf("apple") < out.indexOf("zebra"), "encodeTree must sort by name");
});
