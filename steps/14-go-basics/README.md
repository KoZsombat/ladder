# Step 14 — Go basics

**Exercises:** 7 (~5 h) · **Project:** word-frequency CLI (~1 h)
**Language:** Go

The gate. You have no Go on your GitHub, and going straight to the storage
engine means debugging the language and the system at the same time — you
will blame the wrong one.

The seven exercises are your TypeScript instincts, exactly where they are
wrong: no implicit numeric conversion, slices that alias, a missing map key
that reads as zero, value versus pointer receivers, implicitly satisfied
interfaces, and errors as values with `%w` wrapping.

Then a small CLI that uses all of them at once.

    go test ./exercises/...
