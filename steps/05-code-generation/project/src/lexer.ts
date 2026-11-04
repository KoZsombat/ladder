// Reference copy from project 01, extended with the tokens projects 07-08 need.
export type Token =
  | { t: "num"; v: number }
  | { t: "ident"; v: string }
  | { t: "kw"; v: "if" | "while" | "print" | "fn" | "return" }
  | { t: "op"; v: string }
  | { t: "punct"; v: "(" | ")" | "{" | "}" | ";" | "," | "=" }
  | { t: "eof" };

const KEYWORDS = new Set(["if", "while", "print", "fn", "return"]);
const OPS = ["**", "==", "!=", "<=", ">=", "+", "-", "*", "/", "%", "<", ">"];

export function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (" \t\n\r".includes(c)) { i++; continue; }
    if (c === "#") { while (i < src.length && src[i] !== "\n") i++; continue; }

    if (c >= "0" && c <= "9") {
      let j = i;
      while (j < src.length && src[j] >= "0" && src[j] <= "9") j++;
      out.push({ t: "num", v: Number(src.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      out.push(KEYWORDS.has(word) ? { t: "kw", v: word as never } : { t: "ident", v: word });
      i = j;
      continue;
    }
    const op = OPS.find((o) => src.startsWith(o, i));
    if (op) { out.push({ t: "op", v: op }); i += op.length; continue; }
    if ("(){};,=".includes(c)) { out.push({ t: "punct", v: c as never }); i++; continue; }
    throw new Error(`unexpected character ${c} at ${i}`);
  }
  out.push({ t: "eof" });
  return out;
}

export type Cursor = {
  peek: () => Token;
  next: () => Token;
  at: (t: Token["t"], v?: string) => boolean;
  eat: (t: Token["t"], v?: string) => boolean;
  expect: (t: Token["t"], v?: string) => Token;
};

export function cursor(tokens: Token[]): Cursor {
  let i = 0;
  const at = (t: Token["t"], v?: string) => {
    const tok = tokens[i];
    return tok.t === t && (v === undefined || (tok as { v?: string }).v === v);
  };
  return {
    peek: () => tokens[i],
    next: () => tokens[i++],
    at,
    eat(t, v) { if (at(t, v)) { i++; return true; } return false; },
    expect(t, v) {
      if (!at(t, v)) throw new Error(`expected ${v ?? t}, got ${JSON.stringify(tokens[i])}`);
      return tokens[i++];
    },
  };
}
