// A tiny driver: builds a two-commit history in the repo you point it at.
//
// TODO: finish this once objects.ts works.
//
//   1. write a blob for some content
//   2. build a tree containing it (mode 100644)
//   3. write a commit pointing at the tree, with no parent
//   4. updateRef(gitDir, "refs/heads/main", commitId)
//   5. change the content, and do it again with the first commit as parent
//
// Then: cd into the repo and run `git log`, `git cat-file -p <hash>`,
// `git status` and `git fsck`.
import { join } from "node:path";
import { writeObject, encodeTree, encodeCommit, updateRef, log } from "./objects.ts";

const repo = process.argv[2];
if (!repo) {
  console.error("usage: cli.ts <path-to-a-git-repo>");
  process.exit(1);
}
const gitDir = join(repo, ".git");

throw new Error("TODO: build the history");
