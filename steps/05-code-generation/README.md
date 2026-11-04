# Step 05 — Code generation

**Exercises:** 2 (~40 min) · **Project:** compiler (~1 h)

The highest insight-per-line step in the repo. An evaluator computes a value
NOW; a compiler writes down an instruction to compute it LATER. Same tree
walk, different body.

The exercises make you write both walks side by side and then check they
agree — which is a differential test, the cheapest correctness check there is.
