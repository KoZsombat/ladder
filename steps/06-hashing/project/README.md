# 10 — Hash table

**Builds on:** nothing. **Time:** ~2 hours.
**Done when:** 100k inserts and lookups are correct after at least three
resizes.

Build the data structure you reach for every day. No importing a Map — that
is the thing you are learning.

The measurement at the end (swap in a terrible hash and watch lookups go
quadratic) is what a hash-flooding denial-of-service does to a server, and
why language runtimes seed their hash functions randomly.
