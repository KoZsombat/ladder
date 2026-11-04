# Structure

Every step in this repo has the same shape:

```
a few small exercises, each with an explanation and a TODO
          ↓
one bigger project that uses all of them at once
```

The exercises exist so that the project is never the place where you meet an
idea for the first time. By the time you open `project/`, each piece has
already been written once, in isolation, with tests that told you when it was
right. The project is where you find out that assembling pieces is its own
skill.

- **Exercises** are 10–30 minutes each. A stub throws or does not compile, a
  TODO comment explains exactly what to do and names the trap, and a test
  file defines "done". A solution ships for every one.
- **Projects** are 1–8 hours. Scaffolding and tests are given; the core is a
  TODO. **No solution ships** — the last hint tier has the key code instead,
  because a project solution would just be the finished thing and reading it
  is how you learn nothing.
- **Hints are graded.** Tier 1 is a nudge, tier 2 is the shape, tier 3 is
  near-code, tier 4 (where it exists) is a stretch goal. `./learn hint <id>`
  gives you one tier at a time and remembers where you were.

---

## Top level

```
ladder/
├── learn                 the runner — list, next, run, hint, solution, test
├── README.md             start here: what this is, how to use it, the order
├── STRUCTURE.md          this file
├── CONTRIBUTING.md       how to add a step, if you want to
├── .gitignore
├── .learn-progress       created on first use; which hint tier you are on
├── steps/                the ladder, in order. 01 → 20
└── later/                the fork. Pick ONE branch after step 20
```

Nothing is installed. Nothing is downloaded. Three toolchains, all from
stock:

| Language   | How tests run                                            |
|------------|----------------------------------------------------------|
| TypeScript | `node --experimental-strip-types --test` (Node 22+)      |
| Go         | `go test -race ./...`                                    |
| Rust       | `rustc --edition 2021 --test file.rs && ./file`           |

---

## The shape of one step

Every step directory is laid out identically, so you never have to look
around:

```
steps/NN-topic/
├── README.md              what this step teaches, and why it is here
├── exercises/             the small ones. Stubs + tests. EDIT THESE
├── hints/                 one .md per exercise, split into graded tiers
├── solutions/             the answers. One per exercise
└── project/
    ├── README.md          the spec, the input/output, what "done" means
    ├── HINTS.md           graded tiers for the project
    ├── src/ (or pkg dirs) scaffolding, with the core left as a TODO
    └── test/ (or _test.go) the tests that define done
```

Two details worth knowing:

- **TypeScript exercises are flat files.** `exercises/01_cursor.ts` is the
  stub, `exercises/01_cursor.test.ts` is the test. The test imports
  `./01_cursor.ts`. Later exercises in the same step sometimes import earlier
  ones, on purpose.
- **Go exercises are one package per directory**, because Go requires it:
  `exercises/01_values/values.go` plus `values_test.go`. The step has a
  single `go.mod` at its root.

---

## steps/ — the ladder

### Phase 1 · TypeScript, no language tax (steps 01–08, ~13 h)

```
steps/
├── 01-modelling-state/              Exercises: 3 (~1 h) · Project: vending machine (~2 h)
│   ├── exercises/
│   │   ├── 01_unions.ts             discriminated unions; make the compiler prove exhaustiveness
│   │   ├── 02_transitions.ts        a transition function: (state, event) -> state. No mutation
│   │   └── 03_money.ts              integer cents, and the greedy change algorithm
│   ├── hints/{01_unions,02_transitions,03_money}.md
│   ├── solutions/{01_unions,02_transitions,03_money}.ts
│   └── project/
│       ├── src/machine.ts           the vending machine. One pure reducer
│       └── test/machine.test.ts
│
├── 02-parsing/                      Exercises: 3 (~1 h) · Project: expression calculator (~2 h)
│   ├── exercises/
│   │   ├── 01_cursor.ts             peek / next / eat / expect. THE keystone: six later steps reuse it
│   │   ├── 02_scanner.ts            characters -> tokens, and why that is a separate pass
│   │   └── 03_trees.ts              recursion over a tree; precedence as nesting
│   └── project/
│       ├── src/lexer.ts  src/cursor.ts  src/parser.ts  src/eval.ts
│       └── test/calc.test.ts        precedence, associativity, parens, unary minus
│
├── 03-virtual-machine/              Exercises: 2 (~30 min) · Project: stack VM (~45 min)
│   ├── exercises/
│   │   ├── 01_stack.ts              push/pop as the whole calling convention
│   │   └── 02_fetch_decode.ts       the loop every CPU is: fetch, decode, execute, advance
│   └── project/src/vm.ts            ~60 lines. The cheapest demystification in the repo
│
├── 04-two-pass-assembly/            Exercises: 2 (~40 min) · Project: assembler (~1 h)
│   ├── exercises/
│   │   ├── 01_cleaning.ts           comments, blank lines, labels. Boring on purpose
│   │   └── 02_two_passes.ts         why you cannot resolve a forward jump in one pass
│   └── project/
│       ├── src/asm.ts               text -> the bytecode your step-03 VM runs
│       └── src/vm.ts                your step-03 VM, carried forward
│
├── 05-code-generation/              Exercises: 2 (~40 min) · Project: compiler (~1 h)
│   ├── exercises/
│   │   ├── 01_post_order.ts         why post-order traversal IS stack-machine code
│   │   └── 02_folding.ts            constant folding: your first optimisation
│   └── project/
│       ├── src/lexer.ts  src/parser.ts  src/compile.ts  src/vm.ts
│       └── test/compile.test.ts     steps 02+03+04 become a pipeline, in ~40 lines
│
├── 06-hashing/                      Exercises: 2 (~45 min) · Project: hash table (~2 h)
│   ├── exercises/
│   │   ├── 01_hashing.ts            FNV-1a, and MEASURING uniformity with chi-squared
│   │   └── 02_chaining.ts           collisions, buckets, load factor
│   └── project/src/hashmap.ts       get/set/delete/rehash, with distribution assertions
│
├── 07-cache-eviction/               Exercises: 2 (~40 min) · Project: LRU cache (~1.5 h)
│   ├── exercises/
│   │   ├── 01_linked_list.ts        doubly linked list with sentinels; O(1) unlink
│   │   └── 02_invariants.ts         an executable invariant checker, called after every op
│   └── project/src/lru.ts           map + list, one invariant, O(1) everything
│
└── 08-property-testing/             Exercises: 2 (~45 min) · Project: your own QuickCheck (~2 h)
    ├── exercises/
    │   ├── 01_generators.ts         a seeded PRNG, and generators biased toward edges
    │   └── 02_shrinking.ts          shrinking that PRESERVES the failure reason
    └── project/src/pbt.ts           aim it at step 02 and step 06. It will find something
```

### Phase 2 · Harder TypeScript (steps 09–13, ~14 h)

```
├── 09-control-flow/                 Exercises: 2 (~40 min) · Project: if/while (~2 h)
│   ├── exercises/
│   │   ├── 01_symbols.ts            a symbol table with scopes; shadowing
│   │   └── 02_backpatching.ts       emit a jump to an unknown address, then fix it
│   └── project/
│       ├── src/lexer.ts  src/parser.ts  src/ast.ts  src/compiler.ts  src/vm.ts
│       └── test/control.test.ts     your language gets if, while and variables
│
├── 10-call-frames/                  Exercises: 2 (~45 min) · Project: functions (~3 h)
│   ├── exercises/
│   │   ├── 01_frames.ts             a frame stack; locals as offsets from a base pointer
│   │   └── 02_closures.ts           capture by value vs by reference — the JS `var`-in-a-loop bug
│   └── project/src/vm.ts            call, return, recursion, closures. The hardest in phase 2
│
├── 11-spec-conformance/             Exercises: 2 (~45 min) · Project: JSON parser + suite (2 h + 2 h)
│   ├── exercises/
│   │   ├── 01_number_grammar.ts     the actual JSON number grammar. `01`, `.5`, `1.` are invalid
│   │   └── 02_surrogates.ts         😀 is ONE character. Lone surrogates are not
│   └── project/
│       ├── src/json.ts              parse + stringify, strictly
│       └── test/suite.ts            ~40 nasty cases. It will reject your parser repeatedly
│
├── 12-backtracking/                 Exercises: 2 (~40 min) · Project: regex engine (~2 h)
│   ├── exercises/
│   │   ├── 01_continuations.ts      "try, and if the rest fails, try less" as a function
│   │   └── 02_glob.ts               `*` and `?` first — regex with the hard parts removed
│   └── project/
│       ├── src/parse.ts  src/match.ts
│       └── test/regex.test.ts       includes the ReDoS case you will then spot at work
│
└── 13-content-addressing/           Exercises: 2 (~45 min) · Project: a commit real git reads (~3 h)
    ├── exercises/
    │   ├── 01_content_address.ts    `<type> <len>\0<content>`, SHA-1'd. Known-answer tests
    │   └── 02_tree_format.ts        20 RAW bytes per entry, name-sorted. Not hex
    └── project/
        ├── src/objects.ts  src/cli.ts
        └── test/git.test.ts         shells out to REAL git: cat-file, log, fsck --strict
```

### Phase 3 · The Go gate (steps 14–15, ~14 h)

Two steps that are mostly exercises, because a language is learned in small
pieces and not in one large project.

```
├── 14-go-basics/                    Exercises: 7 (~5 h) · Project: word-frequency CLI (~1 h)
│   ├── go.mod
│   ├── exercises/
│   │   ├── 01_values/               no truthiness, no implicit conversion, zero values
│   │   ├── 02_slices/               the append aliasing trap. len vs cap
│   │   ├── 03_maps/                 the comma-ok idiom; iteration order is RANDOM
│   │   ├── 04_structs/              value vs pointer receivers, and when it bites
│   │   ├── 05_interfaces/           implicit satisfaction; stub fails AT COMPILE TIME
│   │   ├── 06_errors/               errors are values. wrapping, errors.Is, errors.As
│   │   └── 07_generics/             type parameters and constraints
│   └── project/
│       ├── cmd/wordfreq/main.go     flags, stdin-or-files, exit codes
│       └── wordfreq/{count,files}.go
│
└── 15-go-concurrency/               Exercises: 7 (~6 h) · Project: link checker (~2 h)
    ├── go.mod
    ├── exercises/
    │   ├── 01_goroutines/           wg.Add BEFORE `go`. The loop-variable capture bug
    │   ├── 02_channels/             direction, buffering, and who closes
    │   ├── 03_select/               timeout, default, and the nil-channel trick
    │   ├── 04_context/              cancellation that propagates. Never store a Context
    │   ├── 05_mutex/                run it with -race and watch it fail
    │   ├── 06_workerpool/           bounded fan-out, with per-job recover
    │   └── 07_io/                   io.Reader/Writer, and short reads
    └── project/
        ├── cmd/linkcheck/main.go
        └── checker/{checker,pool}.go  bounded concurrency over real HTTP
```

### Phase 4 · Go systems (steps 16–20, ~25 h)

```
├── 16-durable-storage/              Exercises: 2 (~1 h) · Project: key-value store (~4 h)
│   ├── exercises/
│   │   ├── 01_records/              CRC-framed binary records; ErrShort vs ErrCorrupt
│   │   └── 02_durability/           fsync the DIRECTORY too. Atomic temp-file + rename
│   └── project/store/{record,replay,compact,store}.go
│
├── 17-queues-and-retries/           Exercises: 2 (~50 min) · Project: job queue (~3 h)
│   ├── exercises/
│   │   ├── 01_atomic_claim/         claim-or-skip, so two workers never take one job
│   │   └── 02_backoff/              exponential backoff WITH jitter, and why jitter
│   └── project/queue/{queue,pool}.go
│
├── 18-framing/                      Exercises: 2 (~45 min) · Project: socket bridge (~2 h)
│   ├── exercises/
│   │   ├── 01_delimiter/            TCP is a byte stream. Keep the remainder. Copy the slice
│   │   └── 02_correlation/          request ids + BUFFERED reply channels, or you deadlock
│   └── project/
│       ├── bridge/{bridge,frame}.go
│       └── child/server.py          a deliberately awkward peer to talk to
│
├── 19-services/                     Exercises: 2 (~50 min) · Project: health-check service (6–8 h)
│   ├── exercises/
│   │   ├── 01_http_client/          no default timeout; MaxIdleConnsPerHost is 2; DRAIN the body
│   │   └── 02_shutdown/             shutdown ORDER, and context.WithoutCancel for the last flush
│   └── project/
│       ├── cmd/pinger/main.go
│       └── internal/{checker,scheduler,store,api}/   the flagship. Everything above, at once
│
└── 20-shipping/                     Exercises: none · Project: containerise, instrument, profile (8–10 h)
    └── project/
        ├── README.md                the checklist, and where the bottleneck usually is
        ├── HINTS.md                 how to find the knee; all four pprof profiles
        └── NOTES-template.md        the deliverable: one measured bottleneck, fixed
```

Step 20 has no exercises deliberately: the deliverable is not code, it is a
write-up with a before number and an after number.

---

## later/ — the fork

After step 20, pick **one**. All three are a month or more of work, and
finishing one beats sampling three.

```
later/
├── rust-on-ramp/                    14 exercises, rustlings-style. The gate for the systems branch
│   ├── exercises/
│   │   ├── 01_variables.rs          immutable by default; shadowing
│   │   ├── 02_ownership.rs          moves. The stub FAILS TO COMPILE, and that is the lesson
│   │   ├── 03_borrowing.rs          shared XOR mutable
│   │   ├── 04_strings.rs            String vs &str, and why both exist
│   │   ├── 05_structs.rs            impl blocks, &self vs self
│   │   ├── 06_enums.rs              enums with data; exhaustive match
│   │   ├── 07_option.rs             no null. map, and_then, unwrap_or
│   │   ├── 08_result.rs             `?`, and From for error conversion
│   │   ├── 09_traits.rs             static vs dynamic dispatch
│   │   ├── 10_generics.rs           monomorphisation
│   │   ├── 11_lifetimes.rs          what `'a` actually says
│   │   ├── 12_collections.rs        Vec, HashMap, and the entry API
│   │   ├── 13_box.rs                recursive types need indirection
│   │   └── 14_iterators.rs          Fn vs FnMut vs FnOnce
│   ├── hints/*.md
│   └── solutions/*.rs
│
├── 09-ocaml-calc/README.md          languages branch: the calculator again, in OCaml
├── 23-idl-codegen/README.md         languages branch: a schema language + a code generator
├── 24-babel-plugin/README.md        languages branch: an AST transform on real JavaScript
│
├── 19-market-data/README.md         quant branch: a real-time market data pipeline
├── 20-backtester/README.md          quant branch: event-driven, with the look-ahead traps
│
├── 21-allocator/README.md           systems branch: malloc/free. Needs the Rust on-ramp (or C)
└── 22-raytracer/README.md           systems branch: the best-looking thing in the repo
```

Each `later/` README is a spec, not a scaffold: by then you should want the
blank page.

---

## Using it

```bash
./learn list                  every item, and what is already passing
./learn next                  run the first unfinished one
./learn run  02/01_cursor     one item. Step number can be 2 or 02
./learn hint 02/01_cursor     the NEXT tier. Call it again for the next
./learn hint 02/01_cursor all all tiers at once
./learn solution 02/01_cursor the answer (exercises only)
./learn test                  everything
./learn run  02/project       projects are items too
```

`./learn list` marks an item **done** when its tests pass, **todo** when they
do not, and **manual** when there is nothing to run automatically (step 20).

The honest order of operations for each step:

1. Read `steps/NN-*/README.md`. Two minutes.
2. `./learn next`, and read the failure. The error message is part of the
   exercise.
3. Open the stub, read the TODO, write the code.
4. Stuck for more than ten minutes → `./learn hint <id>`. One tier. Not all.
5. Passing → read `solutions/<id>.ts` anyway, and diff it mentally against
   yours. This is where most of the learning happens.
6. All exercises green → `project/README.md`, and build the thing.
7. Write `NOTES.md` in the project folder: what surprised you, what you got
   wrong first, what you measured. **This is the part that makes the project
   worth having done.**
