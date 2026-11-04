# 06 — Compiler

**Builds on:** 01, 04, 05. **Time:** ~1 hour.
**Done when:** `evaluate(ast) === run(compile(ast))` for every project-01 case.

Forty lines, and the highest insight-per-line item on the whole ladder.
An evaluator computes a value NOW; a compiler writes down an instruction to
compute it LATER. Same tree walk, different body. That is the entire
difference between an interpreter and a compiler, and you are about to look
at it side by side.

`vm.ts` and `lexer.ts` are reference copies of your earlier work.
