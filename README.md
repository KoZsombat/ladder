# The ladder

Twenty steps, in order, each one the same shape:

```
a few small exercises, each with an explanation and a TODO
          ↓
one bigger project that uses all of them at once
```

The exercises exist so that the project is never where you meet an idea for
the first time. Everything is already started; the part you are meant to
learn is missing, replaced by a `TODO` comment that says exactly what to
write, which mistake you are likely to make, and often what the error message
will look like when you make it. Tests define "done". Hints come one tier at
a time.

By step 05 you have built a working compiler. By step 20 you have built,
instrumented and profiled a real service. **`STRUCTURE.md` has the full file
tree** with a line on what each exercise teaches.

```
./learn list                  every item, and what is already passing
./learn next                  run the first unfinished one
./learn run  02/01_cursor     one item (step number can be 2 or 02)
./learn hint 02/01_cursor     the NEXT hint tier — ask again for the next
./learn hint 02/01_cursor all all tiers at once
./learn solution 02/01_cursor the full solution (exercises only)
./learn run  02/project       projects are items too
./learn test                  everything
```

## The order

| | Step | Exercises teach | Project |
|---|---|---|---|
| **Phase 1** | | **TypeScript, no language tax — ~13 h** | |
| 01 | modelling state | unions, exhaustiveness, transitions, integer money | vending machine |
| 02 | parsing | a cursor, a scanner, recursion over trees | expression calculator |
| 03 | virtual machine | a stack; fetch-decode-execute | stack VM |
| 04 | two-pass assembly | cleaning input; why one pass cannot work | assembler |
| 05 | code generation | post-order emission; constant folding | **a compiler** |
| 06 | hashing | FNV-1a, and measuring uniformity | hash table |
| 07 | cache eviction | linked lists with sentinels; executable invariants | LRU cache |
| 08 | property testing | seeded generators; shrinking | your own QuickCheck |
| **Phase 2** | | **Harder TypeScript — ~14 h** | |
| 09 | control flow | symbol tables; backpatching | if / while |
| 10 | call frames | frames and locals; closure capture | functions and recursion |
| 11 | spec conformance | the real JSON number grammar; surrogate pairs | JSON parser + suite |
| 12 | backtracking | continuations; glob before regex | regex engine |
| 13 | content addressing | `<type> <len>\0<body>` hashing; the tree format | a commit real git reads |
| **Phase 3** | | **The Go gate — ~14 h** | |
| 14 | go basics | 7 exercises: values, slices, maps, structs, interfaces, errors, generics | word-frequency CLI |
| 15 | go concurrency | 7 exercises: goroutines, channels, select, context, mutexes, pools, io | concurrent link checker |
| **Phase 4** | | **Go systems — ~25 h** | |
| 16 | durable storage | CRC-framed records; what fsync does and does not promise | append-only KV store |
| 17 | queues and retries | atomic claim; backoff with jitter | job queue with workers |
| 18 | framing | delimiters over a byte stream; request correlation | socket bridge |
| 19 | services | HTTP client defaults that bite; shutdown order | HTTP health-check service |
| 20 | shipping | — | containerise, load, profile, **write it up** |

Then `later/` forks three ways — quant, languages, or systems. Pick **one**.
The Rust on-ramp (14 exercises, rustlings-style) lives there and gates the
systems branch.

## Requirements

Nothing to install beyond the toolchains, and **no package dependencies at
all** — not one `npm install`, not one crate, not one Go module requirement.

- **Node 22+** for all of phase 1 and 2, run with the built-in type stripping
  and the built-in test runner
- **Go 1.22+** for steps 14–20
- **Rust 1.70+** for `later/rust-on-ramp` (compiled file by file with
  `rustc --test`, exactly like rustlings — no Cargo project needed)
- **Python 3** for the deliberately awkward peer process in step 18
- **git** itself for step 13, whose tests check your output with real
  `git cat-file`, `git log` and `git fsck --strict`

## How to work through one step

**1. Read the step README.** Two minutes. It says why this step is here and
what the next one assumes you now know.

**2. Do the exercises first, in order.** They are 10–30 minutes each. Read the
TODO before reaching for a hint: it names the trap, and often the exact
compiler error. That error is the teaching mechanism — meeting it is the
exercise, not a failure.

**3. Ask for one hint tier at a time.** `./learn hint <id>` remembers where
you got to. Tier 1 is a nudge, tier 2 is the shape, tier 3 is close to the
code, and a tier 4 is usually a stretch goal rather than more help.

**4. Read the solution even when you passed.** `./learn solution <id>`, then
diff it mentally against yours. This is where a surprising amount of the
learning is.

**5. Then open `project/README.md`.** It gives the input, the output, and the
line where you are allowed to stop.

**6. Type the code. Do not paste it.** The compiler's complaints are the whole
point and you only get them by making the mistakes yourself. That is also why
exercises ship with solutions and projects do not: a project solution would
just be the finished thing.

**7. Keep a `NOTES.md` per project.** One line per surprise: "I assumed X, it
was actually Y." Re-reading six of those beats re-reading the code. For steps
19 and 20, the notes **are** the deliverable.

## If a stub does not compile, that is correct

Several exercises fail at compile time rather than at an assertion, because
the compiler error is the lesson:

```
Circle does not implement Shape (missing method Area)
*ValidationError does not implement error (missing method Error)
recursive type `Expr` has infinite size
*Memory does not implement Store (missing method Close)
cannot borrow `v` as mutable more than once at a time
```

Read those before reaching for a hint.

## A word on finishing

Phase 1 is thirteen hours and ends with you having built a working compiler.
If you do only that, it was worth doing. Most people stall somewhere in phase
2 — so treat phase 1 as the commitment and everything after it as a bonus.
Six projects you can discuss in depth, mistakes and measurements included,
beat twenty you skimmed.
