const NUM = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/;

export function isJsonNumber(text: string): boolean {
  const m = NUM.exec(text);
  return m !== null && m[0].length === text.length;
}

export function readNumber(src: string, i: number): [number, number] {
  const rest = src.slice(i);
  const m = NUM.exec(rest);
  if (!m) throw new SyntaxError(`bad number at ${i}`);
  // reject a number immediately followed by another digit-ish character
  const after = rest[m[0].length];
  if (after !== undefined && /[0-9.eE+]/.test(after) && !isJsonNumber(rest.slice(0, m[0].length + 1))) {
    throw new SyntaxError(`bad number at ${i}`);
  }
  return [Number(m[0]), i + m[0].length];
}
