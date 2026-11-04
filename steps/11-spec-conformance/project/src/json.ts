/**
 * A cursor over characters, carrying line and column so errors can say WHERE.
 * Twenty extra minutes, and the difference between a toy and something usable.
 */
export class P {
  i = 0;
  line = 1;
  col = 1;
  readonly s: string;
  constructor(s: string) {
    this.s = s;
  }

  peek(): string | undefined {
    return this.s[this.i];
  }
  next(): string | undefined {
    const c = this.s[this.i++];
    if (c === "\n") {
      this.line++;
      this.col = 1;
    } else this.col++;
    return c;
  }
  eat(c: string): void {
    if (this.peek() !== c) this.die(`expected '${c}'`);
    this.next();
  }
  ws(): void {
    while (this.peek() !== undefined && " \t\n\r".includes(this.peek()!)) this.next();
  }
  die(msg: string): never {
    throw new SyntaxError(`${msg} at ${this.line}:${this.col}`);
  }
}

const ESC: Record<string, string> = {
  '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t",
};

/**
 * TODO: implement this. Read exactly four hex digits and return the code unit.
 *   Reject anything that is not hex — `parseInt` returning NaN is your signal.
 */
function hex4(p: P): number {
  throw new Error("TODO: hex4");
}

/**
 * TODO: implement this. The hard part of JSON — budget an hour.
 *
 *   - eat the opening quote
 *   - loop reading characters until the closing quote
 *   - a raw control character (below 0x20) is ILLEGAL unescaped; reject it
 *   - on "\\": look up the simple escapes in ESC, else expect "u"
 *   - on "\u": read hex4. If it is a HIGH surrogate (0xD800..0xDBFF) you must
 *     read the NEXT escape too, check it is a LOW surrogate (0xDC00..0xDFFF),
 *     and combine:
 *         cp = 0x10000 + ((hi - 0xD800) << 10) + (lo - 0xDC00)
 *     A lone surrogate with no partner is where half your suite failures will
 *     come from. Decide what you do with it, write it down, and be consistent.
 */
function string(p: P): string {
  throw new Error("TODO: string");
}

/**
 * JSON's number grammar:  -?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?
 *
 * TODO: implement this.
 *
 *   Match that shape yourself FIRST, then hand the matched text to Number().
 *   Your language's parser is far more permissive than the spec: it accepts
 *   Infinity, hex, a leading +, a bare .5 and a trailing 1. — all of which
 *   JSON forbids. Validating the shape is the whole job.
 */
function number(p: P): number {
  throw new Error("TODO: number");
}

/** TODO: implement. Expect each character of `word`, then return. */
function lit(p: P, word: string): void {
  throw new Error("TODO: lit");
}

/**
 * TODO: implement this.
 *
 *   eat "{", skip whitespace, handle the empty object, then loop:
 *     a key (which must be a STRING), ws, ":", a value, ws
 *     then either "," and go again, or "}" and return.
 *
 *   No trailing comma. Your fingers will want to allow it.
 */
function object(p: P, depth: number): Record<string, unknown> {
  throw new Error("TODO: object");
}

/** TODO: implement. Same shape as object, without the keys. */
function array(p: P, depth: number): unknown[] {
  throw new Error("TODO: array");
}

/**
 * TODO: implement this. Peek one character and dispatch.
 *
 *   Enforce the depth limit: without one, a 100k-deep array does not give
 *   you an error, it takes the process down with a stack overflow.
 */
function value(p: P, depth: number): unknown {
  if (depth > 200) p.die("too deep");
  throw new Error("TODO: value");
}

/**
 * TODO: finish this.
 *
 *   After the top-level value, skip trailing whitespace and assert you are
 *   at the end of the input. Without that check, `{} garbage` "parses
 *   successfully", which is the single most common hole in a hand-written
 *   parser.
 */
export function parse(src: string): unknown {
  const p = new P(src);
  const v = value(p, 0);
  // TODO: trailing whitespace + end-of-input check
  return v;
}
