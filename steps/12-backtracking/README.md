# Step 12 — Backtracking

**Exercises:** 2 (~40 min) · **Project:** regex engine (~2 h)

One idea, and it is slippery until you have written it: a greedy repetition
must be able to GIVE CHARACTERS BACK when the rest of the pattern fails.

The exercises build the mechanism on something smaller than a regex, so the
project can be about the grammar. Then the project ends by running
`(a+)+b` against 26 a's and hanging — which is ReDoS, and after that you
will spot it in a code review.
