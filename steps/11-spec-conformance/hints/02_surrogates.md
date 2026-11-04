# 02_surrogates

## Hint 1
```ts
export const isHighSurrogate = (u: number) => u >= 0xd800 && u <= 0xdbff;
export const isLowSurrogate = (u: number) => u >= 0xdc00 && u <= 0xdfff;
export const combine = (hi: number, lo: number) =>
  0x10000 + ((hi - 0xd800) << 10) + (lo - 0xdc00);
```

## Hint 2
Walk an index. Four branches: a control character (throw), a non-backslash
(append), a simple escape (look it up), a `\u` (the interesting one).

```ts
const ESC: Record<string, string> = {
  '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t",
};
```

## Hint 3
```ts
function hex4(body: string, i: number): number {
  const h = body.slice(i, i + 4);
  if (!/^[0-9a-fA-F]{4}$/.test(h)) throw new SyntaxError(`bad \\u escape at ${i}`);
  return parseInt(h, 16);
}
```

## Hint 4
The `\u` branch in full:
```ts
const u = hex4(body, i); i += 4;
if (isLowSurrogate(u)) throw new SyntaxError("lone low surrogate");
if (!isHighSurrogate(u)) { out += String.fromCharCode(u); continue; }
if (body[i] !== "\\" || body[i + 1] !== "u") throw new SyntaxError("lone high surrogate");
const lo = hex4(body, i + 2); i += 6;
if (!isLowSurrogate(lo)) throw new SyntaxError("high surrogate not followed by a low one");
out += String.fromCodePoint(combine(u, lo));
```
