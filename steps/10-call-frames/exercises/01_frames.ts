// 01 — the call stack
//
// A frame is one ACTIVATION of a function: its return address, its
// arguments, its locals. Frames are pushed on call and popped on return,
// which is why locals vanish and why recursion works at all — each
// activation gets its own copies.
//
// THE FIRST RULE: keep two stacks. The operand stack holds arithmetic; the
// call stack holds frames. Put a return address on the operand stack and
// one day an addition eats it and the jump goes somewhere absurd.

export type Frame = {
  ret: number;   // where to resume
  base: number;  // where this frame's locals start in the locals array
  argc: number;
};

export class Machine {
  stack: number[] = [];       // operands
  locals: number[] = [];      // all frames' locals, contiguously
  frames: Frame[] = [{ ret: -1, base: 0, argc: 0 }];
  maxDepth = 200;

  frame(): Frame {
    return this.frames[this.frames.length - 1];
  }

  /**
   * Performs a call: takes argc values off the operand stack into a new
   * frame's locals, pushes the frame, and returns the new instruction
   * pointer.
   *
   * TODO: implement this.
   *
   *   base = locals.length
   *   splice argc values off the END of the operand stack and push them
   *   into locals — they become slots 0..argc-1 of the new frame
   *   push { ret: returnTo, base, argc }
   *   throw "stack overflow" past maxDepth
   *   return target
   *
   *   Note the arguments come off in order because splice takes a RANGE,
   *   not because you popped them one at a time. Popping gives you them
   *   reversed, which is a real and very confusing bug.
   */
  call(target: number, argc: number, returnTo: number): number {
    throw new Error("TODO: call");
  }

  /**
   * Returns from the current frame. Gives back the instruction pointer, or
   * null when the outermost frame returns.
   *
   * TODO: implement this.
   *
   *   pop the frame, then `locals.length = f.base`.
   *
   *   THAT TRUNCATION is the whole thing. It is why locals disappear, why
   *   recursion does not trample itself, and why a stack overflow is a
   *   resource limit rather than corruption.
   *
   *   The return VALUE stays on the operand stack and you touch nothing
   *   there.
   */
  ret(): number | null {
    throw new Error("TODO: ret");
  }

  /** TODO: implement. Read local `slot` of the CURRENT frame (0 if unset). */
  load(slot: number): number {
    throw new Error("TODO: load");
  }

  /** TODO: implement. Write local `slot` of the current frame. */
  store(slot: number, v: number): void {
    throw new Error("TODO: store");
  }

  /** A stack trace: the return address of each frame, outermost first. */
  trace(): number[] {
    return this.frames.map((f) => f.ret);
  }
}
