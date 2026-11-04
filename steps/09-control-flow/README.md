# Step 09 — Control flow and backpatching

**Exercises:** 2 (~40 min) · **Project:** if/while in your language (~2 h)

Step 04 solved forward references with a second pass. Here you solve the
same problem the other way: emit a placeholder, remember where the hole is,
and fill it in once the address is known. That is backpatching, and both
techniques are in every real compiler.

Plus symbol tables — a compile-time map from names to numbered slots, which
is the seed of every scoping system you have ever used.
