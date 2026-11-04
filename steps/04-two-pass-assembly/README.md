# Step 04 — Forward references

**Exercises:** 2 (~40 min) · **Project:** assembler (~1 h)

One idea: you cannot emit a jump to a label you have not seen yet, so you
walk the input twice. First pass records addresses, second pass emits.

This is not an assembler trick. It is why linkers exist, why C has header
files, why your bundler resolves modules before it emits, and why
TypeScript lets you reference a class declared below.
