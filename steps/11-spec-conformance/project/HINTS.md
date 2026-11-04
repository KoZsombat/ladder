# 02 — Hints

## Tier 1 — order of work
Literals, then numbers, then arrays and objects, then strings. Strings last,
because they are 60% of the work and you want the rest running first.

Depth: thread it through `value -> object/array -> value` and increment on
the way down.

## Tier 2 — numbers and lit
```ts
const NUM = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/;

function number(p: P): number {
  const m = NUM.exec(p.s.slice(p.i));
  if (!m) p.die("bad number");
  for (let k = 0; k < m[0].length; k++) p.next();
  return Number(m[0]);
}

function lit(p: P, word: string): void {
  for (const ch of word) {
    if (p.next() !== ch) p.die(`expected ${word}`);
  }
}
```
Object loop:
```ts
p.eat("{"); p.ws();
const out: Record<string, unknown> = {};
if (p.peek() === "}") { p.next(); return out; }
for (;;) {
  p.ws();
  if (p.peek() !== '"') p.die("object key must be a string");
  const k = string(p);
  p.ws(); p.eat(":");
  out[k] = value(p, depth);
  p.ws();
  if (p.peek() === ",") { p.next(); continue; }
  p.eat("}");
  return out;
}
```

## Tier 3 — the string function
```ts
function hex4(p: P): number {
  let n = 0;
  for (let k = 0; k < 4; k++) {
    const d = parseInt(p.next() ?? "", 16);
    if (Number.isNaN(d)) p.die("bad \\u escape");
    n = n * 16 + d;
  }
  return n;
}

function string(p: P): string {
  p.eat('"');
  let out = "";
  for (;;) {
    const c = p.next();
    if (c === undefined) p.die("unterminated string");
    if (c === '"') return out;
    if (c < " ") p.die("unescaped control character");
    if (c !== "\\") { out += c; continue; }

    const e = p.next()!;
    if (e in ESC) { out += ESC[e]; continue; }
    if (e !== "u") p.die(`unknown escape \\${e}`);

    const hi = hex4(p);
    if (hi >= 0xd800 && hi <= 0xdbff) {
      if (p.next() !== "\\" || p.next() !== "u") p.die("lone high surrogate");
      const lo = hex4(p);
      if (lo < 0xdc00 || lo > 0xdfff) p.die("bad low surrogate");
      out += String.fromCodePoint(0x10000 + ((hi - 0xd800) << 10) + (lo - 0xdc00));
    } else {
      out += String.fromCharCode(hi);
    }
  }
}
```

## Tier 4 — the suite
Above 90% with an explanation for each remaining failure is the win. Chasing
every last `n_` case is a rabbit hole. Write your pass rate in NOTES.md.
