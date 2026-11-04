# 03 — Hints

## Tier 1 — order of work
Parser first, and print the tree for `a|bc*` before writing any matcher.
Then the matcher for `char` and `concat` only. Then `star`. Then the rest.

## Tier 2 — the parser
```ts
export function alt(c: Cur): Re {
  const xs = [concat(c)];
  while (c.peek() === "|") { c.next(); xs.push(concat(c)); }
  return xs.length === 1 ? xs[0] : { n: "alt", xs };
}

export function concat(c: Cur): Re {
  const xs: Re[] = [];
  while (c.peek() !== undefined && c.peek() !== "|" && c.peek() !== ")") {
    xs.push(repeat(c));
  }
  return xs.length === 1 ? xs[0] : { n: "concat", xs };
}

export function repeat(c: Cur): Re {
  let x = atom(c);
  for (;;) {
    const p = c.peek();
    if (p === "*") { c.next(); x = { n: "star", x }; continue; }
    if (p === "+") { c.next(); x = { n: "plus", x }; continue; }
    if (p === "?") { c.next(); x = { n: "opt", x }; continue; }
    break;
  }
  return x;
}
```

## Tier 3 — the matcher
```ts
export function m(node: Re, s: string, pos: number, cont: Cont): number | null {
  switch (node.n) {
    case "char": return s[pos] === node.c ? cont(pos + 1) : null;
    case "any":  return pos < s.length ? cont(pos + 1) : null;
    case "class": {
      const ch = s[pos];
      if (ch === undefined) return null;
      const hit = node.ranges.some(([a, b]) => ch >= a && ch <= b);
      return hit !== node.neg ? cont(pos + 1) : null;
    }
    case "concat": {
      const go = (k: number): Cont => (p) =>
        k === node.xs.length ? cont(p) : m(node.xs[k], s, p, go(k + 1));
      return go(0)(pos);
    }
    case "alt": {
      for (const x of node.xs) {
        const r = m(x, s, pos, cont);
        if (r !== null) return r;
      }
      return null;
    }
    case "star": {
      const try_ = (p: number): number | null => {
        const more = m(node.x, s, p, (q) => (q === p ? null : try_(q)));
        return more !== null ? more : cont(p);
      };
      return try_(pos);
    }
    case "plus":
      return m(node.x, s, pos, (q) => m({ n: "star", x: node.x }, s, q, cont));
    case "opt": {
      const r = m(node.x, s, pos, cont);
      return r !== null ? r : cont(pos);
    }
  }
}

export function test(node: Re, s: string): boolean {
  for (let i = 0; i <= s.length; i++) {
    if (m(node, s, i, (p) => p) !== null) return true;
  }
  return false;
}
```

## Tier 4 — the payoff, do not skip it
```ts
test(re("(a+)+b"), "a".repeat(26));   // hangs
```
Nested quantifiers create exponentially many ways to split the input, and
the engine tries all of them before concluding failure. That is ReDoS.
Entry F03 in the fundamentals track rebuilds this as an NFA, where the same
line finishes in milliseconds.
