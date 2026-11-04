# Step 10 — Call frames and closures

**Exercises:** 2 (~45 min) · **Project:** functions in your language (~3 h)

The step that makes every stack trace you ever read legible — a stack trace
is literally a dump of the frames in the call stack, and you are about to
build one.

Then closures: a function that outlives the frame it was created in still
needs the variables it captured. You will implement capture by value, and
in doing so finally understand why a JavaScript loop variable captured in a
closure behaved the way it did before `let`.
