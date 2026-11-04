# 05 — Assembler

**Builds on:** 04. **Time:** ~1 hour.
**Done when:** a program using a label defined LATER in the file assembles
and runs.

The easy rung on purpose: it is the first time two things you built click
together. The one real idea is the forward reference, and two passes solve
it — which is why linkers exist, why C has header files, and why your
bundler resolves modules before it emits.

`src/vm.ts` is your project-04 VM, provided working so this project runs on
its own. Replace it with your own if you prefer.
