export type Token =
  | { t: "num"; v: number }
  | { t: "word"; v: string }
  | { t: "sym"; v: string }
  | { t: "eof" };

const SYMBOLS = ["<=", ">=", "==", "!=", "+", "-", "*", "/", "<", ">", "(", ")"];

export function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === " " || c === "\t" || c === "\n" || c === "\r") { i++; continue; }

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
      out.push({ t: "word", v: src.slice(i, j) });
      i = j;
      continue;
    }

    const sym = SYMBOLS.find((s) => src.startsWith(s, i));
    if (sym) { out.push({ t: "sym", v: sym }); i += sym.length; continue; }

    throw new Error(`unexpected character ${c} at ${i}`);
  }
  out.push({ t: "eof" });
  return out;
}
