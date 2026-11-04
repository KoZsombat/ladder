# 01_cursor

## Hint 1
One `let i = 0` and a returned object literal. No class.

## Hint 2
```ts
export function cursor<T>(items: T[]): Cursor<T> {
  let i = 0;
  return {
    peek: () => items[i],
    next: () => items[i++],
    pos: () => i,
    done: () => i >= items.length,
    eat(want) {
      if (items[i] === want) { i++; return true; }
      return false;          // NOT advancing here is the whole point
    },
    expect(want) {
      if (items[i] !== want) {
        throw new Error(`expected ${String(want)}, found ${String(items[i])} at ${i}`);
      }
      return items[i++];
    },
  };
}
```

## Hint 3
```ts
export function takeWhile<T>(c: Cursor<T>, pred: (x: T) => boolean): T[] {
  const out: T[] = [];
  while (!c.done() && pred(c.peek()!)) out.push(c.next()!);
  return out;
}
```
