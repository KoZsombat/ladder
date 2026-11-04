# 02_scanner

## Hint 1
A `while (i < src.length)` with four branches and a `continue` in each.

## Hint 2
```ts
if (c >= "0" && c <= "9") {
  let j = i;
  while (j < src.length && src[j] >= "0" && src[j] <= "9") j++;
  out.push({ t: "num", v: Number(src.slice(i, j)) });
  i = j;
  continue;
}
```

## Hint 3
```ts
const sym = SYMBOLS.find((s) => src.startsWith(s, i));
if (sym) { out.push({ t: "sym", v: sym }); i += sym.length; continue; }
throw new Error(`unexpected character ${c} at ${i}`);
```
Word branch: `/[A-Za-z_]/.test(c)` to start, `/[A-Za-z0-9_]/` to continue.

## Hint 4
Try reordering SYMBOLS so `"<"` comes before `"<="` and watch the test fail.
That failure is the lesson — the same shape bites with `**` vs `*` in the
project, and with `>>=` vs `>>` vs `>` in any real language.
