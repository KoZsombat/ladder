import type { Token } from "./lexer.ts";

export type Cursor = {
  peek: () => Token;
  next: () => Token;
  expect: (t: Token["t"]) => Token;
};

/**
 * The three functions every parser in this repo is built on.
 *
 * TODO: implement this.
 *
 *   An index, a peek that does not advance, a next that does, and an expect
 *   that throws a readable error when the token is not what was required.
 *
 *   Once you have internalised this shape, every parser you ever read
 *   becomes legible. It is worth being able to write it from memory.
 */
export function cursor(tokens: Token[]): Cursor {
  throw new Error("TODO: cursor");
}
