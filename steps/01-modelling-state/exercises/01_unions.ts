// 01 — discriminated unions, and getting exhaustiveness for free
//
// TypeScript cannot check that you handled every case of a union... unless
// you ask it to. The trick is the `never` type: in a branch the compiler
// believes is unreachable, the value has type `never`, and assigning
// anything else to `never` is an error.
//
// That one trick turns "I added a new case and forgot to handle it
// somewhere" from a runtime surprise into a compile error. It is the same
// guarantee OCaml and Rust give you by default, retrofitted.

export type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number }
  | { kind: "point" };

/**
 * TODO: implement this with a switch on `s.kind`.
 *
 *   circle -> Math.PI * r * r
 *   rect   -> w * h
 *   point  -> 0
 *
 *   Write it FIRST without the "point" branch and without a default, and
 *   look at what tsc says. Then add it.
 *
 *   Do NOT add `default: return 0`. A catch-all compiles happily and
 *   silently swallows every case you add in future — which is exactly the
 *   bug this exercise exists to prevent.
 */
export function area(s: Shape): number {
  switch (s.kind) {
    case "circle": {
      return Math.PI * s.r * s.r;
    }
    case "rect": {
      return s.w * s.h;
    }
    case "point": {
      return 0;
    }
  }
}

/**
 * TODO: implement this, and make the compiler enforce exhaustiveness.
 *
 *   Return "circle" / "rect" / "point". Then, after the switch, add:
 *
 *       const _exhaustive: never = s;
 *       throw new Error(`unhandled: ${JSON.stringify(_exhaustive)}`);
 *
 *   If every case returned, `s` is `never` there and this compiles. Comment
 *   out one case and the assignment fails with "Type ... is not assignable
 *   to type 'never'" — naming the case you forgot.
 *
 *   This is the single most useful TypeScript idiom in this repo, and you
 *   will use it in the vending machine, the parser and the compiler.
 */
export function name(s: Shape): string {
  switch (s.kind) {
    case "circle": {
      return "circle";
    }
    case "rect": {
      return "rect";
    }
    case "point": {
      return "point";
    }
    default: {
      const _exhaustive: never = s;
      throw new Error(`unhandled: ${JSON.stringify(_exhaustive)}`);
    }
  }
}

/**
 * TODO: implement this.
 *
 *   Return the radius for a circle, and undefined for anything else.
 *   A single `if (s.kind === "circle")` is enough: inside it TypeScript
 *   NARROWS `s` to the circle variant, so `s.r` is legal there and only
 *   there. Try reading `s.r` outside the if and see the error.
 */
export function radius(s: Shape): number | undefined {
  if (s.kind === "circle") {
    return s.r;
  } else {
    return undefined;
  }
}
