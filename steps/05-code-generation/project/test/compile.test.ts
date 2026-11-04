import { test } from "node:test";
import assert from "node:assert/strict";
import { parse, evaluate } from "../src/parser.ts";
import { compile } from "../src/compile.ts";
import { run } from "../src/vm.ts";

const CASES = ["2 + 3 * 4", "(2 + 3) * 4", "10 - 3 - 2", "-3 + 5", "2 * (3 + (4 - 1))", "100 / 5 / 2"];

test("THE differential test: both paths agree", () => {
  for (const src of CASES) {
    const ast = parse(src);
    const viaInterpreter = evaluate(ast);
    const viaCompiler = run(compile(ast)).output[0];
    assert.equal(viaCompiler, viaInterpreter, `disagreement on: ${src}`);
  }
});

test("emits a stack-balanced program", () => {
  for (const src of CASES) {
    assert.equal(run(compile(parse(src))).stack.length, 0, `leftover stack: ${src}`);
  }
});

test("left operand is compiled first", () => {
  // if you emit right-then-left this gives -7
  assert.equal(run(compile(parse("10 - 3"))).output[0], 7);
});

test("says clearly what it cannot compile", () => {
  assert.throws(() => compile(parse("2 ** 3")), /\*\*/);
});
