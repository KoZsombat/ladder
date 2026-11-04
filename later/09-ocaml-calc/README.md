# 09 — OCaml: the calculator, functionally

**Builds on:** 01, 07, 08. **Language:** OCaml 5.x. **Time:** a weekend.

Not scaffolded here, because `dune init project calc` already does exactly
that job and doing the setup yourself is part of the exercise.

    brew install opam        # or: sudo apt install opam
    opam init && eval $(opam env)
    opam switch create 5.4.0 && eval $(opam env)
    opam install dune ocaml-lsp-server ocamlformat utop
    dune init project calc && cd calc && touch .ocamlformat
    dune build -w            # leave this running in a split terminal

Four files, each a pure function from one data shape to another:
`lib/lexer.ml`, `lib/ast.ml` + `lib/parser.ml`, `lib/eval.ml`, `bin/main.ml`.

The code walkthrough, the syntax primer and the full list of
TypeScript-reflexes-that-break is in the code companion artifact, section 09.

**Done when:** the REPL evaluates `let x = 10` then `x * x`, and reports
`1 / 0` as an error VALUE rather than an exception.

**Two stretches worth doing:** change `Num of int` to `Num of float` and let
the compiler walk you through every break; then add functions to the language,
which forces `value` to gain a `VClosure of string * expr * env` case.
