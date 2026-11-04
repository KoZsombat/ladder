// 02 — the tree format, and THE trap
//
// A git tree is a directory listing, and it is BINARY, not text. Entries
// are concatenated with no separator and no newline:
//
//     <mode> <name>\0<20 RAW BYTES of the child's SHA>
//
// Those twenty raw bytes are the trap everybody hits. The hash you have in
// hand is 40 hex CHARACTERS; what goes into the tree is the 20 bytes those
// characters describe. Write the hex and `git fsck` rejects your tree.
//
// Modes, and note the odd one:
//     100644  a normal file
//     100755  an executable file
//     40000   a subdirectory — FIVE digits, no leading zero
//     120000  a symlink

export type TreeEntry = { mode: string; name: string; id: string };

/**
 * TODO: implement this.
 *
 *   Sort the entries BY NAME first — git requires it and fsck complains
 *   otherwise. Then for each one, concatenate
 *   `${mode} ${name}\0` followed by the 20 raw bytes of the id.
 *
 *   Buffer.from(hex, "hex") is the conversion. Check the id is 40 hex
 *   characters first and throw if not; a typo here produces a tree that
 *   looks fine and fails validation much later.
 */
export function encodeTree(entries: TreeEntry[]): Buffer {
  throw new Error("TODO: encodeTree");
}

/**
 * TODO: implement this — the inverse, so you can read trees back.
 *
 *   Walk the buffer: read up to the space for the mode, up to the zero
 *   byte for the name, then exactly 20 bytes for the id (back to hex).
 *   Repeat until the buffer is exhausted.
 *
 *   Writing the decoder is how you find out whether your encoder is right,
 *   because a round-trip test catches what eyeballing does not.
 */
export function decodeTree(buf: Buffer): TreeEntry[] {
  throw new Error("TODO: decodeTree");
}

/**
 * Builds the text of a commit object.
 *
 * TODO: implement this. Commits ARE text, unlike trees:
 *
 *     tree <40 hex>\n
 *     parent <40 hex>\n        (zero or more; two means a merge)
 *     author <who> <unix seconds> <tz>\n
 *     committer <who> <unix seconds> <tz>\n
 *     \n
 *     <message>\n
 *
 *   The blank line before the message is required. `who` looks like
 *   "Name <email>", and the timezone like "+0100".
 */
export function encodeCommit(opts: {
  tree: string;
  parents: string[];
  who: string;
  when: number;
  tz: string;
  message: string;
}): Buffer {
  throw new Error("TODO: encodeCommit");
}
