# 01_number_grammar

## Hint 1
One regex, written straight off the grammar. Anchor both ends for
`isJsonNumber`; anchor only the start for `readNumber`.

## Hint 2
```ts
const NUM = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/;

export function isJsonNumber(text: string): boolean {
  const m = NUM.exec(text);
  return m !== null && m[0].length === text.length;
}
```
Comparing the match LENGTH to the input length is how you get a `$` anchor
without writing a second regex.

## Hint 3
```ts
export function readNumber(src: string, i: number): [number, number] {
  const m = NUM.exec(src.slice(i));
  if (!m) throw new SyntaxError(`bad number at ${i}`);
  return [Number(m[0]), i + m[0].length];
}
```
Careful with `01`: the regex matches just `0`, so `readNumber("01", 0)`
returns `[0, 1]` rather than throwing. The project catches that at the next
level up — after a value, the only legal characters are whitespace, a comma
or a closing bracket. Add that check and `01` is rejected properly.
