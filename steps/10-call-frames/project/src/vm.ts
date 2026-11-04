export const OP = {
  PUSH: 1, POP: 2, ADD: 3, SUB: 4, MUL: 5, DIV: 6, PRINT: 7, HALT: 8,
  JMP: 9, JZ: 10, LOAD: 11, STORE: 12,
  CALL: 13, RET: 14, MAKE_CLOSURE: 15, LOAD_CAPTURED: 16, CALL_VALUE: 17,
} as const;

export const NAME: Record<number, string> = Object.fromEntries(
  Object.entries(OP).map(([k, v]) => [v, k]),
);

export type Frame = {
  ret: number;   // where to come back to
  base: number;  // where this frame's locals start
  argc: number;
  closure: number; // index into heap, or -1
};

export type Closure = { addr: number; captured: number[] };

export const MAX_DEPTH = 10_000;

/**
 * TODO: implement the new cases.
 *
 * THE FIRST RULE: keep TWO stacks. The operand stack holds arithmetic;
 * the call stack holds frames. Never put a return address on the operand
 * stack — one day an addition eats it and the jump goes somewhere absurd.
 *
 * Your calling convention (write it in NOTES.md and then obey it):
 *   - the caller pushes arguments left to right
 *   - CALL addr, argc  -> pops argc values into the new frame's locals,
 *                         pushes a frame, jumps to addr
 *   - RET              -> pops the frame, truncates locals back to
 *                         frame.base, jumps to frame.ret.
 *                         The return value is left on the OPERAND stack.
 *   - LOAD/STORE slot  -> locals[frame.base + slot]
 *
 * Almost every bug in this project is the caller and the callee disagreeing
 * about that list. That disagreement is exactly what an ABI is.
 *
 * Truncating locals on RET is why recursion works: each activation gets its
 * own copies and they vanish on the way out.
 *
 * Guard the depth and throw a clean "stack overflow" — do not let a runaway
 * recursion take the host process down.
 */
export function run(program: number[], trace = false) {
  const stack: number[] = [];
  const output: number[] = [];
  const locals: number[] = [];
  const frames: Frame[] = [{ ret: -1, base: 0, argc: 0, closure: -1 }];
  const heap: Closure[] = [];
  let ip = 0;

  const frame = () => frames[frames.length - 1];

  for (let steps = 0; ; steps++) {
    if (steps > 50_000_000) throw new Error("ran too long");
    const op = program[ip];
    if (trace) console.error(`ip=${ip} ${NAME[op] ?? op} stack=[${stack}] depth=${frames.length}`);

    switch (op) {
      case OP.PUSH: stack.push(program[ip + 1]); ip += 2; break;
      case OP.POP: stack.pop(); ip += 1; break;
      case OP.ADD: { const b = stack.pop()!, a = stack.pop()!; stack.push(a + b); ip += 1; break; }
      case OP.SUB: { const b = stack.pop()!, a = stack.pop()!; stack.push(a - b); ip += 1; break; }
      case OP.MUL: { const b = stack.pop()!, a = stack.pop()!; stack.push(a * b); ip += 1; break; }
      case OP.DIV: { const b = stack.pop()!, a = stack.pop()!; stack.push((a / b) | 0); ip += 1; break; }
      case OP.PRINT: output.push(stack.pop()!); ip += 1; break;
      case OP.JMP: ip = program[ip + 1]; break;
      case OP.JZ: { const v = stack.pop()!; ip = v === 0 ? program[ip + 1] : ip + 2; break; }

      case OP.LOAD: stack.push(locals[frame().base + program[ip + 1]] ?? 0); ip += 2; break;
      case OP.STORE: {
        const slot = frame().base + program[ip + 1];
        locals[slot] = stack.pop()!;
        ip += 2;
        break;
      }

      case OP.CALL: {
        // TODO: target = program[ip+1], argc = program[ip+2]
        //       base = locals.length
        //       splice argc values off the operand stack into locals
        //       push a frame { ret: ip + 3, base, argc, closure: -1 }
        //       check frames.length > MAX_DEPTH and throw "stack overflow"
        //       ip = target
        throw new Error("TODO: CALL");
      }

      case OP.RET: {
        // TODO: pop the frame, locals.length = f.base, ip = f.ret
        //       (if f.ret === -1 you have returned from the top: HALT)
        throw new Error("TODO: RET");
      }

      case OP.MAKE_CLOSURE: {
        // TODO: addr = program[ip+1], n = program[ip+2]
        //       take n values off the operand stack — these are the captured
        //       values, copied BY VALUE
        //       heap.push({ addr, captured }) and push heap.length - 1
        //       ip += 3
        throw new Error("TODO: MAKE_CLOSURE");
      }

      case OP.LOAD_CAPTURED: {
        // TODO: push heap[frame().closure].captured[program[ip+1]]
        throw new Error("TODO: LOAD_CAPTURED");
      }

      case OP.CALL_VALUE: {
        // TODO: like CALL, but the target is a CLOSURE INDEX popped from the
        //       operand stack (below the argc arguments), and the new frame
        //       records which closure it is running so LOAD_CAPTURED works.
        throw new Error("TODO: CALL_VALUE");
      }

      case OP.HALT: return { output, stack, locals, frames, heap };
      default: throw new Error(`unknown opcode ${op} at ip=${ip}`);
    }
  }
}
