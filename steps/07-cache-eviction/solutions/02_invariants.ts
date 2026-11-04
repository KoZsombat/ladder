export type Pair = { key: string; value: number };

export class Toy {
  map = new Map<string, number>();
  order: string[] = [];

  put(key: string, value: number, capacity: number): void {
    if (!this.map.has(key)) this.order.unshift(key);
    else this.order = [key, ...this.order.filter((k) => k !== key)];
    this.map.set(key, value);
    while (this.map.size > capacity) {
      const victim = this.order.pop()!;
      this.map.delete(victim);
    }
  }
}

export function checkToy(t: Toy): void {
  const seen = new Set<string>();
  for (const k of t.order) {
    if (seen.has(k)) throw new Error(`duplicate key in the list: ${k}`);
    seen.add(k);
  }
  for (const k of seen) {
    if (!t.map.has(k)) throw new Error(`key ${k} is in the list but not the map`);
  }
  for (const k of t.map.keys()) {
    if (!seen.has(k)) throw new Error(`key ${k} is in the map but not the list`);
  }
  if (seen.size !== t.map.size) {
    throw new Error(`list has ${seen.size} keys, map has ${t.map.size}`);
  }
}

export function firstBreak(ops: Pair[], capacity: number): number {
  const t = new Toy();
  for (let i = 0; i < ops.length; i++) {
    t.put(ops[i].key, ops[i].value, capacity);
    try { checkToy(t); } catch { return i; }
  }
  return -1;
}
