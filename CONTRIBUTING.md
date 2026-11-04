# Adding to the ladder

Every step is `steps/NN-topic/` and every step has the same five parts:

```
steps/NN-topic/
├── README.md     why this step exists, what the next one assumes
├── exercises/    stubs + tests
├── hints/        one .md per exercise, graded tiers
├── solutions/    one per exercise
└── project/      README.md, HINTS.md, scaffolding, tests. NO solution
```

## Where an exercise lives

**TypeScript** — two flat files: `exercises/NN_name.ts` (the stub) and
`exercises/NN_name.test.ts` (the test, importing `./NN_name.ts`). The hint is
`hints/NN_name.md`, the solution is `solutions/NN_name.ts`. Exercises in the
same step may import each other; the verifier copies all solutions into one
directory, so that works.

Run with `node --experimental-strip-types --test NN_name.test.ts`. Node's
type stripping is **strip-only**: no enums, no namespaces, and no constructor
parameter properties (`constructor(private x: number) {}`). Write the fields
out explicitly.

**Go** — one package per directory: `exercises/NN_name/name.go` plus
`name_test.go`. The step has a single `go.mod` at its root; the solution is a
mirrored package at `solutions/NN_name/`.

**Rust** — one file, `exercises/NN_name.rs`, with its `#[cfg(test)] mod tests`
inline, compiled standalone with `rustc --edition 2021 --test`.

## Four rules the runner depends on

1. **The stub must fail**, and ideally at compile time, with an error that
   teaches something. `./learn test` means nothing if an untouched exercise
   passes. Check with `./learn run <id>` before committing.
2. **Hints are split on `## ` headings**, in increasing order of how much they
   give away: nudge, shape, near-code, then optionally a stretch goal. The
   runner shows one at a time and remembers where the reader got to.
3. **Every exercise ships a solution. No project does.** A project solution
   is just the finished thing; put the key code in the last hint tier.
4. **No dependencies.** Not one `npm install`, not one crate, not one Go
   module requirement. Everything must work offline, today and in five years.

## Writing a TODO

The TODO comment is the exercise. A good one has three parts:

```ts
/**
 * TODO: what to build, in one sentence.
 *
 *   The trap: what you will probably do first, and why it is wrong.
 *   The error: what the compiler or the test will say when you hit it.
 */
```

Name the trap. An exercise whose TODO only restates the function signature is
a typing drill, not a lesson.
