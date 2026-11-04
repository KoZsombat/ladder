// 02 — backpatching
//
// To compile `if (cond) { body }` you emit the condition, then a jump to
// the instruction AFTER the body — except you do not know that address yet,
// because you have not compiled the body.
//
// So you emit a placeholder, remember the index of the hole, compile the
// body, and then go back and overwrite the hole.

export const OP = { PUSH: 1, JZ: 2, JMP: 3, PRINT: 4, HALT: 5, POP: 6 } as const;

export class Emitter {
  out: number[] = [];

  /** TODO: implement. Append the numbers. */
  emit(...xs: number[]): void {
    throw new Error("TODO: emit");
  }

  /**
   * Emits a jump with an unknown target and returns the index of the HOLE.
   *
   * TODO: implement this.
   *
   *   emit(op, 0) — the 0 is a placeholder — and return out.length - 1.
   *
   *   Minus ONE, not minus two: you want the index of the OPERAND, not the
   *   opcode. Patching the opcode is one of the two classic bugs here, and
   *   it turns your conditional jump into a push of an address.
   */
  emitJump(op: number): number {
    throw new Error("TODO: emitJump");
  }

  /**
   * Fills a hole with the address of the next instruction to be emitted.
   *
   * TODO: implement this. One line.
   *
   *   The other classic bug is calling this one instruction too early or
   *   too late. Everything after the patch site is already emitted, so
   *   out.length IS the address of whatever comes next.
   */
  patch(site: number): void {
    throw new Error("TODO: patch");
  }

  /** The current address — where the next instruction will land. */
  here(): number {
    return this.out.length;
  }
}

/**
 * Compiles `if (cond) { thenBody }` where cond and thenBody are callbacks
 * that emit into the emitter.
 *
 * TODO: implement this. FOUR lines, and they are the lesson:
 *
 *   cond()
 *   const site = e.emitJump(OP.JZ)
 *   thenBody()
 *   e.patch(site)
 */
export function compileIf(e: Emitter, cond: () => void, thenBody: () => void): void {
  throw new Error("TODO: compileIf");
}

/**
 * Compiles `while (cond) { body }`.
 *
 * TODO: implement this. The same, plus one BACKWARD jump:
 *
 *   const top = e.here()        <- we come back HERE: to the CONDITION
 *   cond()
 *   const exit = e.emitJump(OP.JZ)
 *   body()
 *   e.emit(OP.JMP, top)         <- a fixed address; nothing to patch
 *   e.patch(exit)               <- lands after the JMP
 *
 *   Jumping back to the BODY instead of the condition gives you a loop that
 *   never re-tests and therefore never ends. The order of the last two
 *   lines matters too: patch after the JMP is emitted, not before.
 */
export function compileWhile(e: Emitter, cond: () => void, body: () => void): void {
  throw new Error("TODO: compileWhile");
}
