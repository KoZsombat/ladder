export type Cursor<T> = {
  peek: () => T | undefined;
  next: () => T | undefined;
  eat: (want: T) => boolean;
  expect: (want: T) => T;
  done: () => boolean;
  pos: () => number;
};

export function cursor<T>(items: T[]): Cursor<T> {
  let i = 0;
  return {
    peek: () => items[i],
    next: () => items[i++],
    pos: () => i,
    done: () => i >= items.length,
    eat(want) {
      if (items[i] === want) { i++; return true; }
      return false;
    },
    expect(want) {
      if (items[i] !== want) {
        throw new Error(`expected ${String(want)}, found ${String(items[i])} at ${i}`);
      }
      return items[i++];
    },
  };
}

export function takeWhile<T>(c: Cursor<T>, pred: (x: T) => boolean): T[] {
  const out: T[] = [];
  while (!c.done() && pred(c.peek()!)) out.push(c.next()!);
  return out;
}
