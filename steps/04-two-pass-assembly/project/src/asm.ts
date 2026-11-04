import { OP, HAS_OPERAND } from "./vm.ts";

export const MNEMONIC: Record<string, number> = {
  push: OP.PUSH, pop: OP.POP, add: OP.ADD, sub: OP.SUB, mul: OP.MUL,
  div: OP.DIV, print: OP.PRINT, halt: OP.HALT,
  jmp: OP.JMP, jz: OP.JZ, load: OP.LOAD, store: OP.STORE,
};

export type Line = { label: string } | { op: number; arg?: string };

/**
 * TODO: implement this.
 *
 *   For each source line: strip the comment (everything after ";"), trim,
 *   drop empties. A line ending in ":" is a label. Otherwise split on
 *   whitespace into a mnemonic and an optional argument, and look the
 *   mnemonic up — throwing with its text if it is unknown.
 *
 *   Decide now whether PUSH and push are the same thing, write it in
 *   NOTES.md, and apply it in BOTH passes.
 */
export function clean(src: string): Line[] {
  throw new Error("TODO: clean");
}

/**
 * Two passes, because of forward references.
 *
 * TODO: implement this.
 *
 *   PASS ONE: walk the lines counting SLOTS, not lines. A label consumes
 *   zero slots and records labels[name] = currentAddress. An instruction
 *   consumes 2 if it takes an operand, otherwise 1. Emit nothing.
 *
 *   PASS TWO: walk again and emit. For each instruction push the opcode,
 *   then, if it takes an operand, push either the number or the resolved
 *   label address. An unknown label must throw an error that NAMES it —
 *   not silently emit undefined.
 *
 *   Counting lines instead of slots is the classic bug here: a `push` takes
 *   two slots and a label takes zero, so line numbers and addresses drift
 *   apart the moment you have one of either.
 */
export function assemble(src: string): number[] {
  throw new Error("TODO: assemble");
}
