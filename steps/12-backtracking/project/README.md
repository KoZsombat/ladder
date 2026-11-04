# 03 — Backtracking regex engine

**Builds on:** 01. **Time:** ~2 hours. **Done when:** `/a*a/` matches `"aaa"`.

Parser plus matcher, two separate programs. The one test that matters is
`a*a` against `aaa`: if it fails, your star is not giving characters back.

The payoff at the end — running `/(a+)+b/` against 26 a's and watching it hang
— is ReDoS, and after this you will spot it in a code review.

Run: `node --experimental-strip-types --test test/*.test.ts`
