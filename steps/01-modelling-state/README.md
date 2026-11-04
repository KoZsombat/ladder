# Step 01 — Modelling state

**Exercises:** 3 (~1 h) · **Project:** vending machine (~2 h)
**Language:** TypeScript

The shape every step in this repo follows: a few small exercises that teach
one idea each, then a project that makes you assemble them.

Here the idea is that **state is a value, not a pile of flags**, and the three
exercises are precisely the three things the vending machine needs: a
discriminated union the compiler checks exhaustively, a pure transition
function that returns effects instead of performing them, and integer money.

    ./learn next
