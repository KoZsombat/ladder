import { createHash } from "node:crypto";
import { deflateSync, inflateSync } from "node:zlib";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type TreeEntry = { mode: string; name: string; id: string };

/**
 * TODO: bring these two over from the exercises.
 *   wrap(type, content) -> "<type> <len>\0<content>"
 *   objectId(type, content) -> sha1 of the WRAPPED bytes, as hex
 */
export function wrap(type: string, content: Buffer): Buffer {
  throw new Error("TODO: wrap");
}

export function objectId(type: string, content: Buffer): string {
  throw new Error("TODO: objectId");
}

/**
 * Writes an object into a real .git directory and returns its id.
 *
 * TODO: implement this.
 *
 *   path:    <gitDir>/objects/<first 2 hex>/<remaining 38>
 *   content: the WRAPPED bytes, zlib-DEFLATED (deflateSync, not gzip)
 *
 *   Create the two-character directory with mkdirSync({ recursive: true }).
 *   If the file already exists, do nothing and return the id — objects are
 *   immutable, so rewriting one is at best wasted work.
 *
 *   Git writes them read-only (mode 0o444). Not required, but it documents
 *   the immutability, and doing it will stop you from ever being tempted to
 *   edit one.
 */
export function writeObject(gitDir: string, type: string, content: Buffer): string {
  throw new Error("TODO: writeObject");
}

/**
 * TODO: implement the read side, so you can write your own `cat-file`.
 *
 *   Read the file, inflateSync it, then split on the first zero byte.
 *   Verify the length in the header matches what followed it.
 */
export function readObject(gitDir: string, id: string): { type: string; content: Buffer } {
  throw new Error("TODO: readObject");
}

/**
 * TODO: bring the tree encoder over from exercise 02.
 *
 *   Sorted by name. `${mode} ${name}\0` then the TWENTY RAW BYTES of the id.
 *   Buffer.from(id, "hex") — not the hex string itself.
 */
export function encodeTree(entries: TreeEntry[]): Buffer {
  throw new Error("TODO: encodeTree");
}

/** TODO: bring the commit encoder over from exercise 02. */
export function encodeCommit(o: {
  tree: string; parents: string[]; who: string; when: number; tz: string; message: string;
}): Buffer {
  throw new Error("TODO: encodeCommit");
}

/**
 * Points a branch at a commit.
 *
 * TODO: implement this.
 *
 *   Write "<40 hex>\n" into <gitDir>/<ref>, creating the directories.
 *   `ref` looks like "refs/heads/main".
 *
 *   That is ALL a branch is: a text file with a hash in it. Advancing a
 *   branch means writing a different hash. Once you have done this by hand,
 *   `git reset`, `cherry-pick` and detached HEAD stop being rituals.
 */
export function updateRef(gitDir: string, ref: string, id: string): void {
  throw new Error("TODO: updateRef");
}

/** TODO: implement. Read a ref back, trimmed. Return undefined if absent. */
export function readRef(gitDir: string, ref: string): string | undefined {
  throw new Error("TODO: readRef");
}

/**
 * Walks the parent chain from a commit, newest first.
 *
 * TODO: implement this — your own `git log`.
 *
 *   Read the commit, pull out its "parent" line(s), and keep going. Take
 *   the FIRST parent only; following all of them is how you turn a merge
 *   into an exponential walk.
 *
 *   History is a DAG, and `git log` is a traversal of it. Nothing is ever
 *   modified — which is why the reflog can get you back.
 */
export function log(gitDir: string, startId: string): string[] {
  throw new Error("TODO: log");
}
