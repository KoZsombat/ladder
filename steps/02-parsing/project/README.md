# 01 — Expression calculator

**Teaches:** tokenizer, cursor, AST, precedence, associativity, Pratt parsing.
**Time:** ~2 hours. **Done when:** all six acceptance lines evaluate correctly.

The keystone of the whole ladder. Every later text-reading project is a
variation on the cursor you write here: the JSON parser is this with different
tokens, the regex engine is this with a different tree, the IDL is this with
ten lines of grammar.

Run: `node --experimental-strip-types --test test/*.test.ts`
