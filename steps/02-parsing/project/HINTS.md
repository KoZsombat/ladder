# 01 — Hints

## Tier 1 — order of work
1. `tokenize` alone. Print the tokens for `"12 + 3 * (4 - 1)"` and eyeball them.
2. `cursor`. Three lines.
3. `parseAtom` with numbers only, then `parseExpr` with `+ -` only.
   Check `10 - 3 - 2` = 5 before going further.
4. Add `* /`, then `**` with the right-associative recursion. Check 512.
5. `evaluate`, then `show`.

Do not write all five and then run the tests. Each step runs on its own.

## Tier 2 — the pieces
```ts
export function cursor(tokens: Token[]): Cursor {
  let i = 0;
  return {
    peek: () => tokens[i],
    next: () => tokens[i++],
    expect(t) {
      const tok = tokens[i];
      if (tok.t !== t) throw new Error(`expected ${t}, got ${tok.t}`);
      return tokens[i++];
    },
  };
}
```
Tokenizer digit run:
```ts
if (c >= "0" && c <= "9") {
  let j = i;
  while (j < src.length && src[j] >= "0" && src[j] <= "9") j++;
  out.push({ t: "num", v: Number(src.slice(i, j)) });
  i = j;
  continue;
}
```

## Tier 3 — the Pratt loop in full
```ts
export function parseExpr(c: Cursor, minBP: number): Node {
  let left = parseAtom(c);
  for (;;) {
    const tok = c.peek();
    if (tok.t !== "op") break;
    const info = BP[tok.v];
    if (!info || info.bp < minBP) break;
    c.next();
    const right = parseExpr(c, info.right ? info.bp : info.bp + 1);
    left = { n: "bin", op: tok.v, l: left, r: right };
  }
  return left;
}

export function parseAtom(c: Cursor): Node {
  const tok = c.next();
  if (tok.t === "num") return { n: "num", v: tok.v };
  if (tok.t === "op" && tok.v === "-") return { n: "neg", e: parseAtom(c) };
  if (tok.t === "lparen") {
    const e = parseExpr(c, 0);
    c.expect("rparen");
    return e;
  }
  throw new Error(`unexpected token ${tok.t}`);
}
```

## Tier 4 — stretch
Add `%` and comparison operators, purely to confirm that adding an operator
is now a one-line edit to the BP table.
