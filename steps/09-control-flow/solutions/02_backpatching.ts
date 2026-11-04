export const OP = { PUSH: 1, JZ: 2, JMP: 3, PRINT: 4, HALT: 5, POP: 6 } as const;

export class Emitter {
  out: number[] = [];

  emit(...xs: number[]): void {
    this.out.push(...xs);
  }

  emitJump(op: number): number {
    this.emit(op, 0);
    return this.out.length - 1;
  }

  patch(site: number): void {
    this.out[site] = this.out.length;
  }

  here(): number {
    return this.out.length;
  }
}

export function compileIf(e: Emitter, cond: () => void, thenBody: () => void): void {
  cond();
  const site = e.emitJump(OP.JZ);
  thenBody();
  e.patch(site);
}

export function compileWhile(e: Emitter, cond: () => void, body: () => void): void {
  const top = e.here();
  cond();
  const exit = e.emitJump(OP.JZ);
  body();
  e.emit(OP.JMP, top);
  e.patch(exit);
}
