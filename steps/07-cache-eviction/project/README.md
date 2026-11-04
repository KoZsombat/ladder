# 12 — LRU cache

**Builds on:** 10. **Time:** ~1.5 hours.
**Done when:** every operation is O(1) and the invariant holds after each one.

The classic interview question, and genuinely worth building once: it is the
smallest example of a structure whose correctness lives in a RELATIONSHIP
between two structures rather than inside either one.

Neither alone can do it. A map gives O(1) lookup but no order; a list gives
order but O(n) lookup. The answer is both, kept in sync.
