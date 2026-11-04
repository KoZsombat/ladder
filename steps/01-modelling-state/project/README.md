# 00 — Vending machine

**Teaches:** explicit state machines, total case handling, modelling with types.
**Time:** ~2 hours. **Done when:** the five acceptance tests pass.

A vending machine that takes coins, dispenses, gives change and refuses
sensibly. It sounds like a toy, and it is — the point is that it is the
smallest honest excuse to write a state machine, and state machines are the
shape under the parsers, the job queue and the order book later on.

The one idea: **state is a value, not a pile of flags.** Three booleans
describe eight combinations, of which maybe four are legal and nothing stops
the other four. One union of four states makes the illegal ones
unrepresentable.

Run: `node --experimental-strip-types --test test/*.test.ts`
