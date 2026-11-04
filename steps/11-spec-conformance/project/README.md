# 02 — JSON parser, then the conformance suite

**Builds on:** 01. **Time:** 2 hours, then a separate 2 hours.
**Done when:** you can state your pass rate on JSONTestSuite and explain every
remaining failure.

Two sittings on purpose. The first is smug; the second is humbling, and the
second is the one that matters. A specification is a surface with edges, and
"it works on my input" is not the same as correct.

Run: `node --experimental-strip-types --test test/*.test.ts`
Suite: `git clone https://github.com/nst/JSONTestSuite` then
`node --experimental-strip-types test/suite.ts <path-to>/JSONTestSuite/test_parsing`
