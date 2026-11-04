# 01_linked_list

## Hint 1
```ts
export function emptyList(): List {
  const head = {} as N;
  const tail = {} as N;
  head.next = tail;
  tail.prev = head;
  return { head, tail };
}
```

## Hint 2
```ts
export function unlink(n: N): void {
  n.prev.next = n.next;
  n.next.prev = n.prev;
}
```

## Hint 3
```ts
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
```

## Hint 4
Note `keys` stops at `list.tail`, not at `null`. With sentinels there is no
null anywhere in the traversal — that is the whole trick.
