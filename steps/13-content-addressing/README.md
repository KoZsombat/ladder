# Step 13 — Content addressing

**Exercises:** 2 (~45 min) · **Project:** write a commit real git can read (~3 h)

The best value-per-hour step in the repo, because it permanently removes a
category of superstition from your working life.

Git is a content-addressed key-value store. The key of any object is the
SHA-1 of its contents. A repository is a folder of compressed blobs named
after their own hashes, plus a few text files holding branch names.

Node has `zlib` and `crypto` built in, so this stays in TypeScript — one
more finished project before the language switch.
