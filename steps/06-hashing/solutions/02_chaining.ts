export type Entry = { key: string; value: number; next: Entry | null };

export function chainSet(head: Entry | null, key: string, value: number): [Entry, boolean] {
  for (let e = head; e; e = e.next) {
    if (e.key === key) { e.value = value; return [head!, false]; }
  }
  return [{ key, value, next: head }, true];
}

export function chainGet(head: Entry | null, key: string): number | undefined {
  for (let e = head; e; e = e.next) if (e.key === key) return e.value;
  return undefined;
}

export function chainDelete(head: Entry | null, key: string): [Entry | null, boolean] {
  let removed = false;
  const keep: Entry[] = [];
  for (let e = head; e; e = e.next) {
    if (e.key === key && !removed) { removed = true; continue; }
    keep.push(e);
  }
  let out: Entry | null = null;
  for (let i = keep.length - 1; i >= 0; i--) out = { ...keep[i], next: out };
  return [out, removed];
}

export function rehash(
  buckets: (Entry | null)[],
  newSize: number,
  hash: (k: string) => number,
): (Entry | null)[] {
  const out: (Entry | null)[] = new Array(newSize).fill(null);
  for (const head of buckets) {
    for (let e = head; e; ) {
      const next = e.next;
      const i = hash(e.key) % newSize;
      e.next = out[i];
      out[i] = e;
      e = next;
    }
  }
  return out;
}
