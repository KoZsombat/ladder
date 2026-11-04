# 07 — Control flow and backpatching

**Builds on:** 06. **Time:** ~2 hours.
**Done when:** a `while` loop counts down from 10 to 1.

The first genuine step up in this tier — do not attempt it tired.

Two new ideas. A **symbol table** maps variable names to numbered slots at
compile time, so the VM only ever sees numbers; that map is the seed of every
scoping system you have used. And **backpatching**: to compile `if`, you emit
a jump to an address you do not know yet, remember where the hole is, compile
the body, and then fill the hole in.

Project 05 solved forward references with a second pass; here you solve them
by writing a hole and filling it. Both techniques are in every real compiler.
