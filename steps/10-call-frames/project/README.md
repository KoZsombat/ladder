# 08 — Functions, call frames and closures

**Builds on:** 07. **Time:** ~3 hours.
**Done when:** a recursive `fib(20)` returns 6765 and a returned closure still
sees its captured variable.

The capstone of the tier and the point where your toy becomes a real language.
This is the project that makes every stack trace you ever read legible: a
stack trace is literally a dump of the frames in the call stack, and after
this you will have built one.

The VM here is yours to extend — `src/vm.ts` already has the CALL/RET/
closure opcodes declared but their cases are TODO.
