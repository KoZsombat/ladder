# 13 — Append-only key-value store

**Builds on:** 10, 12. **Language:** Go. **Time:** ~4 hours.
**Done when:** `kill -9` mid-write loses at most the last record and never
corrupts the rest.

Bitcask-style: an append-only log on disk, an in-memory index of key to file
offset. This is the architecture of Riak's storage engine and conceptually
the front half of LevelDB and RocksDB.

Go from here on, because `fsync`, binary headers and crash behaviour are all
more honest in it than in Node — and because it warms you up for 15-17.

Run: `go test ./...`  ·  Crash test: `go test -run TestCrash -v ./...`
