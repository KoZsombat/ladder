# Step 06 — Hashing

**Exercises:** 2 (~45 min) · **Project:** hash table (~2 h)

Two ideas: a hash function that spreads, and chaining with resize. The
measurement at the end of the project — swap in a terrible hash and watch
lookups go quadratic — is what a hash-flooding denial of service does to a
server, and why every language runtime seeds its hasher randomly.
