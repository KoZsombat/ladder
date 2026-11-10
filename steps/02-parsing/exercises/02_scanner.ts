// 02 — a scanner: characters in, tokens out
//
// The tokenizer is half of parsing, and keeping it SEPARATE from the parser
// is what makes both easy. The tokenizer worries about whitespace, comments
// and multi-character symbols. The parser never sees a character.
//
// Merging the two is what makes parsing feel impossible.

export type Token =
  | { t: "num"; v: number }
  | { t: "word"; v: string }
  | { t: "sym"; v: string }
  | { t: "eof" };

const SYMBOLS = [
  "<=",
  ">=",
  "==",
  "!=",
  "+",
  "-",
  "*",
  "/",
  "<",
  ">",
  "(",
  ")",
];

/**
 * TODO: implement this.
 *
 *   Walk an index through the string:
 *   - skip spaces and tabs HERE, never in the parser
 *   - a run of digits becomes { t: "num" }
 *   - a letter or _ starts a run of letters/digits/_ and becomes { t: "word" }
 *   - otherwise match against SYMBOLS
 *   - anything else throws, naming the character and its index
 *   - always push { t: "eof" } last, so the parser never has to bounds-check
 *
 *   THE TRAP: SYMBOLS is ordered longest-first on purpose. If you match "<"
 *   before "<=", then "a <= b" tokenizes as "<" followed by "=" and your
 *   parser gets a baffling error three functions away. Use
 *   `SYMBOLS.find(s => src.startsWith(s, i))` and the order does the work.
 *
 *   The same trap bites in the calculator project with ** and *, where it
 *   turns 2 ** 3 ** 2 into 64 instead of 512.
 */
export function tokenize(src: string): Token[] {
  const output: Token[] = [];

  for (let index = 0; index < src.length; index++) {
    const curr = src[index];
    if (curr == " ") continue;

    if (SYMBOLS.includes(`${curr}${src[index + 1]}`)) {
      output.push({ t: "sym", v: `${curr}${src[index + 1]}` });
      index++;
      continue;
    }
    if (SYMBOLS.includes(curr)) {
      output.push({ t: "sym", v: curr });
      continue;
    }
    if (!isNaN(Number(curr))) {
      let i = 0;
      while (index + i < src.length && !isNaN(Number(src[index + i]))) {
        i++;
      }
      output.push({ t: "num", v: Number(src.slice(index, index + i)) });
      index += src.slice(index, index + i).length - 1;
      continue;
    }
    const isDigit = (c: string) => c >= "0" && c <= "9";
    const isLetter = (c: string) =>
      (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
    if (isLetter(curr)) {
      let i = 0;
      while (
        index + i < src.length &&
        (isLetter(src[index + i]) || isDigit(src[index + i]))
      ) {
        i++;
      }
      output.push({ t: "word", v: src.slice(index, index + i) });
      index += src.slice(index, index + i).length - 1;
      continue;
    }
    throw new Error(`Black ${curr} at ${index}`);
  }
  output.push({ t: "eof" });
  return output;
}
