export type N = { key: string; prev: N; next: N };
export type List = { head: N; tail: N };

export function emptyList(): List {
  const head = {} as N;
  const tail = {} as N;
  head.next = tail;
  tail.prev = head;
  return { head, tail };
}

export function unlink(n: N): void {
  n.prev.next = n.next;
  n.next.prev = n.prev;
}

export function toFront(list: List, n: N): void {
  n.next = list.head.next;
  n.prev = list.head;
  list.head.next.prev = n;
  list.head.next = n;
}

export function keys(list: List): string[] {
  const out: string[] = [];
  for (let p = list.head.next; p !== list.tail; p = p.next) out.push(p.key);
  return out;
}
