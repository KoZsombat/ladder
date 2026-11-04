// 01 — the cursor
//
// An index into a sequence, a peek that does not advance, a next that does.
// Almost all parsing code is those two functions plus if statements.
//
// Once you can write this from memory, every parser you read becomes
// legible — including the ones in your node_modules.

export type Cursor<T> = {
  peek: () => T | undefined;
  next: () => T | undefined;
  /** Consume and return it only if it matches; otherwise leave the index alone. */
  eat: (want: T) => boolean;
  /** Consume it or throw a readable error. */
  expect: (want: T) => T;
  done: () => boolean;
  pos: () => number;
};

/**
 * TODO: implement this.
 *
 *   Close over `let i = 0` and return the object. That closure IS the
 *   cursor's state — there is no class needed, and keeping `i` private
 *   means nobody downstream can corrupt it.
 *
 *   `eat` must NOT advance when it does not match. Getting that wrong gives
 *   you a parser that silently skips tokens, which is maddening to debug
 *   because the failure appears somewhere else entirely.
 *
 *   `expect`'s error should name both what was wanted and what was found,
 *   plus the position. You will read that message a hundred times.
 */
export function cursor<T>(items: T[]): Cursor<T> {
  throw new Error("TODO: cursor");
}

/**
 * Consumes items while the predicate holds, and returns them.
 *
 * TODO: implement this. Used by the tokenizer in the next exercise to read
 * a run of digits or letters.
 */
export function takeWhile<T>(c: Cursor<T>, pred: (x: T) => boolean): T[] {
  throw new Error("TODO: takeWhile");
}
