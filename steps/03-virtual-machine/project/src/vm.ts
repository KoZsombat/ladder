export const OP = {
  PUSH: 1, POP: 2, ADD: 3, SUB: 4, MUL: 5, DIV: 6, PRINT: 7, HALT: 8,
} as const;

export const NAME: Record<number, string> = Object.fromEntries(
  Object.entries(OP).map(([k, v]) => [v, k]),
);

/** Which opcodes carry an operand in the following slot. */
export const HAS_OPERAND = new Set<number>([OP.PUSH]);

export type RunResult = { output: number[]; stack: number[] };

/**
 * A CPU does three things forever: fetch the instruction at the current
 * address, decode it, execute it, advance. That is the whole model your
 * laptop uses, and this loop is it.
 *
 * TODO: implement this.
 *
 *   let ip = 0 and a stack array, then loop:
 *     read program[ip]
 *     if trace, log the ip, the opcode NAME and the stack
 *     switch on it:
 *       PUSH  -> push program[ip + 1];  ip += 2    <- the 2 is the whole trap
 *       ADD   -> b = pop(), a = pop(), push(a + b); ip += 1
 *       SUB   -> same shape, a - b. The SECOND operand comes off FIRST.
 *                It does not matter for +, it matters enormously for - and /.
 *       PRINT -> push the popped value onto `output`
 *       HALT  -> return
 *       default -> throw, naming the opcode and the ip
 *
 *   Advancing by 1 after a PUSH makes the VM execute its own operand as an
 *   instruction, and something baffling happens. That is the bug to meet now
 *   rather than in project 07.
 *
 *   At HALT, if the stack is not empty, that is worth noticing — project 07
 *   turns it into an assertion.
 */
export function run(program: number[], trace = false): RunResult {
  throw new Error("TODO: run");
}
