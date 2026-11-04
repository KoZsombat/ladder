// 02 — the forward reference, and two passes
//
// A program can say `jmp end` before `end:` has appeared. When you reach
// the jmp you do not yet know what address `end` has, so you cannot emit
// the instruction.
//
// Two passes solve it: walk once counting addresses and recording where
// each label lands, emitting nothing; walk again and emit, looking up the
// labels in the table you just built.

import type { Line } from "./01_cleaning.ts";

export const WIDTH: Record<string, number> = {
  push: 2, jmp: 2, jz: 2,     // these carry an operand
  add: 1, sub: 1, print: 1, halt: 1,
};

/**
 * PASS ONE. Returns a map from label name to the address it refers to.
 *
 * TODO: implement this.
 *
 *   Walk the lines keeping a running address. A label records
 *   labels[name] = address and CONSUMES NO ADDRESS ITSELF. An instruction
 *   advances the address by WIDTH[op].
 *
 *   THE BUG TO AVOID: counting LINES instead of SLOTS. A `push` occupies
 *   two slots and a label occupies zero, so line numbers and addresses
 *   drift apart the moment you have one of either — and the jump lands in
 *   the middle of an instruction.
 *
 *   Throw on an unknown op, naming it.
 */
export function firstPass(lines: Line[]): Map<string, number> {
  throw new Error("TODO: firstPass");
}

/**
 * PASS TWO. Emits the numbers.
 *
 * TODO: implement this.
 *
 *   For each instruction: push its opcode number (use OPCODE below), then,
 *   if it has an operand, push either the parsed number or the resolved
 *   label address.
 *
 *   An unknown label must throw an error that NAMES it. Emitting
 *   `undefined` into the program is the failure mode here, and it surfaces
 *   much later as a jump to NaN.
 */
export const OPCODE: Record<string, number> = {
  push: 1, add: 2, sub: 3, print: 4, halt: 5, jmp: 6, jz: 7,
};

export function secondPass(lines: Line[], labels: Map<string, number>): number[] {
  throw new Error("TODO: secondPass");
}
