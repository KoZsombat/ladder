export const isHighSurrogate = (u: number) => u >= 0xd800 && u <= 0xdbff;
export const isLowSurrogate = (u: number) => u >= 0xdc00 && u <= 0xdfff;
export const combine = (hi: number, lo: number) =>
  0x10000 + ((hi - 0xd800) << 10) + (lo - 0xdc00);

const ESC: Record<string, string> = {
  '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t",
};

function hex4(body: string, i: number): number {
  const h = body.slice(i, i + 4);
  if (!/^[0-9a-fA-F]{4}$/.test(h)) throw new SyntaxError(`bad \\u escape at ${i}`);
  return parseInt(h, 16);
}

export function decodeStringBody(body: string): string {
  let out = "";
  let i = 0;
  while (i < body.length) {
    const c = body[i];
    if (c < " ") throw new SyntaxError(`unescaped control character at ${i}`);
    if (c !== "\\") { out += c; i++; continue; }

    const e = body[i + 1];
    if (e === undefined) throw new SyntaxError("trailing backslash");
    if (e in ESC) { out += ESC[e]; i += 2; continue; }
    if (e !== "u") throw new SyntaxError(`unknown escape \\${e}`);

    i += 2;
    const u = hex4(body, i);
    i += 4;
    if (isLowSurrogate(u)) throw new SyntaxError("lone low surrogate");
    if (!isHighSurrogate(u)) { out += String.fromCharCode(u); continue; }
    if (body[i] !== "\\" || body[i + 1] !== "u") throw new SyntaxError("lone high surrogate");
    const lo = hex4(body, i + 2);
    i += 6;
    if (!isLowSurrogate(lo)) throw new SyntaxError("high surrogate not followed by a low one");
    out += String.fromCodePoint(combine(u, lo));
  }
  return out;
}
