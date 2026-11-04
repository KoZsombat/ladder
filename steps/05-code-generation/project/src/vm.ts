// Reference copy of the project-04 VM, so this project runs standalone.
export const OP = {
  PUSH: 1, POP: 2, ADD: 3, SUB: 4, MUL: 5, DIV: 6, PRINT: 7, HALT: 8,
  JMP: 9, JZ: 10, LOAD: 11, STORE: 12,
} as const;

export const NAME: Record<number, string> = Object.fromEntries(
  Object.entries(OP).map(([k, v]) => [v, k]),
);

export const HAS_OPERAND = new Set<number>([OP.PUSH, OP.JMP, OP.JZ, OP.LOAD, OP.STORE]);

export function run(program: number[], trace = false) {
  const stack: number[] = [];
  const output: number[] = [];
  const slots: number[] = [];
  let ip = 0;
  for (let steps = 0; ; steps++) {
    if (steps > 1_000_000) throw new Error("ran too long — infinite loop?");
    const op = program[ip];
    if (trace) console.error(`ip=${ip} ${NAME[op] ?? op} stack=[${stack}]`);
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
      case OP.LOAD: stack.push(slots[program[ip + 1]] ?? 0); ip += 2; break;
      case OP.STORE: slots[program[ip + 1]] = stack.pop()!; ip += 2; break;
      case OP.HALT: return { output, stack, slots };
      default: throw new Error(`unknown opcode ${op} at ip=${ip}`);
    }
  }
}
