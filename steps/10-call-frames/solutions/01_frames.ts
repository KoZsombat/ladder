export type Frame = { ret: number; base: number; argc: number };

export class Machine {
  stack: number[] = [];
  locals: number[] = [];
  frames: Frame[] = [{ ret: -1, base: 0, argc: 0 }];
  maxDepth = 200;

  frame(): Frame {
    return this.frames[this.frames.length - 1];
  }

  call(target: number, argc: number, returnTo: number): number {
    const base = this.locals.length;
    const args = this.stack.splice(this.stack.length - argc, argc);
    this.locals.push(...args);
    this.frames.push({ ret: returnTo, base, argc });
    if (this.frames.length > this.maxDepth) throw new Error("stack overflow");
    return target;
  }

  ret(): number | null {
    const f = this.frames.pop()!;
    this.locals.length = f.base;
    if (f.ret === -1) { this.frames.push(f); return null; }
    return f.ret;
  }

  load(slot: number): number {
    return this.locals[this.frame().base + slot] ?? 0;
  }

  store(slot: number, v: number): void {
    this.locals[this.frame().base + slot] = v;
  }

  trace(): number[] {
    return this.frames.map((f) => f.ret);
  }
}
