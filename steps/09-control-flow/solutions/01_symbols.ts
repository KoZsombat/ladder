export class Scopes {
  private frames: Map<string, number>[] = [new Map()];
  private next = 0;

  push(): void {
    this.frames.push(new Map());
  }

  pop(): void {
    if (this.frames.length === 1) throw new Error("cannot pop the global scope");
    this.frames.pop();
  }

  declare(name: string): number {
    const top = this.frames[this.frames.length - 1];
    const existing = top.get(name);
    if (existing !== undefined) return existing;
    const slot = this.next++;
    top.set(name, slot);
    return slot;
  }

  lookup(name: string): number | undefined {
    for (let i = this.frames.length - 1; i >= 0; i--) {
      const slot = this.frames[i].get(name);
      if (slot !== undefined) return slot;
    }
    return undefined;
  }

  slotCount(): number {
    return this.next;
  }
}
