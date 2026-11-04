export const OP = { PUSH: 1, ADD: 2, PRINT: 3, JMP: 4, HALT: 5 } as const;
export const HAS_OPERAND = new Set<number>([OP.PUSH, OP.JMP]);

const NAME: Record<number, string> = Object.fromEntries(
  Object.entries(OP).map(([k, v]) => [v, k]),
);

export function instructionAddresses(program: number[]): number[] {
  const out: number[] = [];
  let addr = 0;
  while (addr < program.length) {
    out.push(addr);
    addr += HAS_OPERAND.has(program[addr]) ? 2 : 1;
  }
  return out;
}

export function disassemble(program: number[]): string[] {
  return instructionAddresses(program).map((a) => {
    const op = program[a];
    const n = NAME[op] ?? `?${op}`;
    return HAS_OPERAND.has(op) ? `${a}: ${n} ${program[a + 1]}` : `${a}: ${n}`;
  });
}
