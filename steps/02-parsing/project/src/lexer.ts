export type Token =
  | { t: "num"; v: number }
  | { t: "op"; v: "+" | "-" | "*" | "/" | "**" }
  | { t: "lparen" }
  | { t: "rparen" }
  | { t: "eof" };

/**
 * Turns source text into a flat list of tokens.
 *
 * TODO: implement this.
 *
 *   Walk an index through the string. For each position:
 *   - skip whitespace HERE (never in the parser)
 *   - a run of digits becomes { t: "num", v }
 *   - "**" must be matched BEFORE "*", or you tokenize it as two
 *     multiplications and `2 ** 3 ** 2` comes out as 64 instead of 512
 *   - + - * / ( ) become their tokens
 *   - anything else throws with the character and its position
 *
 *   Always push { t: "eof" } at the end. It saves the parser from checking
 *   for the end of the array on every peek.
 */

const OPERATORS = ["+", "-", "*", "/", "**"];

export function tokenize(src: string): Token[] {
  const output: Token[] = [];
  for (let index = 0; index < src.length; index++) {
    const curr = src[index];
    if (curr == " ") continue;
    if (
      index + 1 < src.length &&
      OPERATORS.includes(`${src[index]}${src[index + 1]}`)
    ) {
      output.push({ t: "op", v: "**" });
      index++;
      continue;
    }
    if (OPERATORS.includes(curr)) {
      output.push({ t: "op", v: curr as "+" | "-" | "*" | "/" });
      continue;
    }
    if (!isNaN(Number(curr))) {
      let i = 0;
      while (!isNaN(Number(src[index + i]))) {
        i++;
      }
      output.push({ t: "num", v: Number(src.slice(index, index + i)) });
      index += i - 1;
      continue;
    }
    if (curr === "(") {
      output.push({ t: "lparen" });
      continue;
    }
    if (curr === ")") {
      output.push({ t: "rparen" });
      continue;
    }
  }
  output.push({ t: "eof" });
  return output;
}
