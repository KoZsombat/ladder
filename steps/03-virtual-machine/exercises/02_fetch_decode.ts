// 02 — fetch, decode, execute
//
// A CPU does three things forever: read the instruction at the current
// address, work out what it means, do it, advance. That is the whole model
// your laptop uses.
//
// The instruction pointer is just an integer index. "Jumping" means
// assigning a different number to it. Every if, loop, function call and
// exception you have ever written bottoms out in that assignment.

export const OP = { PUSH: 1, ADD: 2, PRINT: 3, JMP: 4, HALT: 5 } as const;

/** Instructions that carry an operand in the slot after them. */
export const HAS_OPERAND = new Set<number>([OP.PUSH, OP.JMP]);

/**
 * Returns the address of every instruction in the program, in order.
 * For [PUSH, 2, ADD, HALT] that is [0, 2, 3].
 *
 * TODO: implement this.
 *
 *   Walk an address forward, advancing by 2 for an instruction with an
 *   operand and 1 otherwise. THIS IS THE WHOLE EXERCISE, and the bug it is
 *   inoculating you against is the single most common one in the project:
 *   advancing by 1 after a PUSH makes the machine execute its own operand
 *   as an instruction, and something baffling happens.
 *
 *   You will need exactly this walk again in step 04, where an assembler
 *   has to count SLOTS rather than lines to work out label addresses.
 */
export function instructionAddresses(program: number[]): number[] {
  throw new Error("TODO: instructionAddresses");
}

/**
 * Disassembles a program into readable lines like "0: PUSH 2".
 *
 * TODO: implement this.
 *
 *   Reuse instructionAddresses. Look the opcode's name up from OP.
 *   Write this now: it is your --trace flag in disguise, and you will lean
 *   on it in steps 04, 05, 09 and 10 when a jump target is one off.
 */
export function disassemble(program: number[]): string[] {
  throw new Error("TODO: disassemble");
}
