export type Re =
  | { n: "char"; c: string }
  | { n: "any" }
  | { n: "class"; neg: boolean; ranges: [string, string][] }
  | { n: "concat"; xs: Re[] }
  | { n: "alt"; xs: Re[] }
  | { n: "star"; x: Re }
  | { n: "plus"; x: Re }
  | { n: "opt"; x: Re };

export type Cur = { peek: () => string | undefined; next: () => string | undefined };

export function cur(s: string): Cur {
  let i = 0;
  return { peek: () => s[i], next: () => s[i++] };
}

/**
 * Four precedence levels, four mutually recursive functions:
 *
 *   alternation (loosest) -> concatenation -> repetition -> atom (tightest)
 *
 * This is the classic recursive-descent shape. Worth writing once even
 * though project 01 showed you the Pratt alternative — real grammars use
 * both and you should recognise each on sight.
 */

/**
 * TODO: implement this.
 *   Parse a concat, then while the next char is "|", consume it and parse
 *   another. One child means no wrapper node.
 */
export function alt(c: Cur): Re {
  throw new Error("TODO: alt");
}

/**
 * TODO: implement this.
 *   Collect repeats until the input ends or the next char is "|" or ")".
 */
export function concat(c: Cur): Re {
  throw new Error("TODO: concat");
}

/**
 * TODO: implement this.
 *   Parse one atom, then wrap it in star/plus/opt for each following
 *   postfix character. The postfix applies to that ONE atom or group —
 *   `ab*` is `a` then zero-or-more `b`, not zero-or-more `ab`.
 */
export function repeat(c: Cur): Re {
  throw new Error("TODO: repeat");
}

/**
 * TODO: implement this.
 *   "." -> any
 *   "(" -> a full alternation, then MUST consume ")"
 *   "[" -> a character class: optional leading "^" for negation, then
 *          single chars or a-z ranges, until "]"
 *   "\\" -> the next character, literally
 *   anything else -> a literal char
 */
export function atom(c: Cur): Re {
  throw new Error("TODO: atom");
}

export function re(pattern: string): Re {
  return alt(cur(pattern));
}
