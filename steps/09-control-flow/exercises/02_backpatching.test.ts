import { test } from "node:test";
import assert from "node:assert/strict";
import { Emitter, compileIf, compileWhile, OP } from "./02_backpatching.ts";

const { PUSH, JZ, JMP, PRINT, HALT } = OP;

/** A tiny interpreter so the tests can check behaviour, not just bytes. */
function run(prog: number[], counterStart = 0): number[] {
  const out: number[] = [];
  const st: number[] = [];
  let counter = counterStart;
  let ip = 0;
  for (let steps = 0; steps < 10_000; steps++) {
    switch (prog[ip]) {
      case PUSH: st.push(prog[ip + 1] === -1 ? counter : prog[ip + 1]); ip += 2; break;
      case JZ: { const v = st.pop()!; ip = v === 0 ? prog[ip + 1] : ip + 2; break; }
      case JMP: ip = prog[ip + 1]; break;
      case PRINT: out.push(st.pop()!); counter--; ip += 1; break;
      case OP.POP: st.pop(); ip += 1; break;
      case HALT: return out;
      default: throw new Error(`bad opcode ${prog[ip]} at ${ip}`);
    }
  }
  throw new Error("ran too long — infinite loop");
}

test("emitJump returns the OPERAND index", () => {
  const e = new Emitter();
  e.emit(PUSH, 1);
  const site = e.emitJump(JZ);
  assert.equal(site, 3, "opcode at 2, operand at 3");
  assert.equal(e.out[2], JZ);
});

test("patch writes the next address into the hole", () => {
  const e = new Emitter();
  const site = e.emitJump(JZ);
  e.emit(PUSH, 9);
  e.patch(site);
  // out is [JZ, hole, PUSH, 9] so the next instruction lands at address 4
  assert.equal(e.out[site], 4);
});

test("if with a FALSE condition skips the body", () => {
  const e = new Emitter();
  compileIf(e, () => e.emit(PUSH, 0), () => e.emit(PUSH, 99, PRINT));
  e.emit(PUSH, 42, PRINT, HALT);
  assert.deepEqual(run(e.out), [42]);
});

test("if with a TRUE condition runs the body and resumes after", () => {
  const e = new Emitter();
  compileIf(e, () => e.emit(PUSH, 1), () => e.emit(PUSH, 99, PRINT));
  e.emit(PUSH, 42, PRINT, HALT);
  assert.deepEqual(run(e.out), [99, 42]);
});

test("THE COUNTDOWN: while re-tests its condition", () => {
  const e = new Emitter();
  // PUSH -1 is "push the counter" in the toy interpreter; PRINT decrements it
  compileWhile(e, () => e.emit(PUSH, -1), () => e.emit(PUSH, -1, PRINT));
  e.emit(HALT);
  assert.deepEqual(run(e.out, 5), [5, 4, 3, 2, 1]);
});

test("a while whose condition is false at once runs zero times", () => {
  const e = new Emitter();
  compileWhile(e, () => e.emit(PUSH, 0), () => e.emit(PUSH, 99, PRINT));
  e.emit(PUSH, 7, PRINT, HALT);
  assert.deepEqual(run(e.out), [7]);
});
