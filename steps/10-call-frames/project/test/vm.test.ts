import { test } from "node:test";
import assert from "node:assert/strict";
import { OP, run } from "../src/vm.ts";

const { PUSH, ADD, SUB, MUL, PRINT, HALT, JMP, JZ, LOAD, STORE, CALL, RET,
        MAKE_CLOSURE, LOAD_CAPTURED, CALL_VALUE } = OP;

// These programs are hand-assembled, the way project 04 started.
// Addresses are written out so you can trace them by eye.

test("call and return", () => {
  //  0: PUSH 41        push the argument
  //  2: CALL 8, 1
  //  5: PRINT
  //  6: HALT
  //  7: (pad)
  //  8: LOAD 0         the function: arg + 1
  // 10: PUSH 1
  // 12: ADD
  // 13: RET
  const prog = [PUSH, 41, CALL, 8, 1, PRINT, HALT, 0, LOAD, 0, PUSH, 1, ADD, RET];
  assert.deepEqual(run(prog).output, [42]);
});

test("locals are frame-relative, so recursion works", () => {
  // fact(n): if n == 0 return 1 else n * fact(n-1)
  //  0: PUSH 5
  //  2: CALL 8, 1
  //  5: PRINT
  //  6: HALT
  //  7: pad
  //  8: LOAD 0          <- fact
  // 10: JZ 22           if n == 0 jump to base case
  // 12: LOAD 0
  // 14: LOAD 0
  // 16: PUSH 1
  // 18: SUB
  // 19: CALL 8, 1
  // 22? -- base case must come after; see layout below
  const prog = [
    /* 0*/ PUSH, 5,
    /* 2*/ CALL, 8, 1,
    /* 5*/ PRINT,
    /* 6*/ HALT,
    /* 7*/ 0,
    /* 8*/ LOAD, 0,
    /*10*/ JZ, 24,
    /*12*/ LOAD, 0,
    /*14*/ LOAD, 0,
    /*16*/ PUSH, 1,
    /*18*/ SUB,
    /*19*/ CALL, 8, 1,
    /*22*/ MUL,
    /*23*/ RET,
    /*24*/ PUSH, 1,
    /*26*/ RET,
  ];
  assert.deepEqual(run(prog).output, [120]);
});

test("deep recursion gives a clean error, not a host crash", () => {
  // f(n) = f(n+1), never terminates
  const prog = [
    /* 0*/ PUSH, 0,
    /* 2*/ CALL, 7, 1,
    /* 5*/ PRINT,
    /* 6*/ HALT,
    /* 7*/ LOAD, 0,
    /* 9*/ PUSH, 1,
    /*11*/ ADD,
    /*12*/ CALL, 7, 1,
    /*15*/ RET,
  ];
  assert.throws(() => run(prog), /stack overflow/i);
});

test("closures capture by value", () => {
  // make_adder(5) returns a closure; calling it with 10 gives 15
  //  0: PUSH 5
  //  2: CALL 9, 1          make_adder
  //  5: STORE 0            keep the closure
  //  7: PUSH 10
  //  9?... layout below
  const prog = [
    /* 0*/ PUSH, 5,
    /* 2*/ CALL, 9, 1,
    /* 5*/ STORE, 0,
    /* 7*/ JMP, 18,
    /* 9*/ LOAD, 0,                       // make_adder: push its arg
    /*11*/ MAKE_CLOSURE, 22, 1,           // capture 1 value, body at 22
    /*14*/ RET,
    /*15*/ 0, 0, 0,
    /*18*/ LOAD, 0,                       // the closure value
    /*20*/ PUSH, 10,
    /*22*/ 0,                             // placeholder, see below
  ];
  // The layout above is awkward by hand; build it programmatically instead.
  const p: number[] = [];
  const emit = (...xs: number[]) => p.push(...xs);
  //  make_adder at index 6
  emit(JMP, 0);                 // 0-1  patched below
  emit(LOAD, 0);                // 2-3  (make_adder body) push captured arg
  emit(MAKE_CLOSURE, 0, 1);     // 4-6  addr patched below
  emit(RET);                    // 7
  const innerAddr = p.length;
  emit(LOAD_CAPTURED, 0);       // the captured n
  emit(LOAD, 0);                // the argument x
  emit(ADD);
  emit(RET);
  p[5] = innerAddr;             // MAKE_CLOSURE operand
  const mainAddr = p.length;
  p[1] = mainAddr;              // JMP target
  emit(PUSH, 5);
  emit(CALL, 2, 1);             // make_adder(5) -> closure index
  emit(STORE, 0);
  emit(LOAD, 0);                // closure
  emit(PUSH, 10);               // argument
  emit(CALL_VALUE, 1);          // argc = 1
  emit(PRINT);
  emit(HALT);

  assert.deepEqual(run(p).output, [15]);
});

test("the operand stack is empty at HALT", () => {
  const prog = [PUSH, 1, CALL, 8, 1, PRINT, HALT, 0, LOAD, 0, RET];
  assert.equal(run(prog).stack.length, 0);
});
