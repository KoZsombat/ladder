# Project — a commit real git can read

**Done when:** `git log` shows your commit, `git cat-file -p` prints your
objects, and `git fsck` reports no errors.

Real git validating objects you wrote by hand is the moment this pays off.

```
mkdir -p /tmp/sandbox && cd /tmp/sandbox && git init
cd -                      # back here
node --experimental-strip-types src/cli.ts /tmp/sandbox
cd /tmp/sandbox && git log && git fsck
```

Build order: a blob, then a tree containing it, then a commit pointing at
the tree, then write the hash into `.git/refs/heads/main`. Then a second
commit with the first as its parent, and you have seen that history is a
linked list.
