// 01 — post-order emission, and why stack machines exist
//
// Walk a tree left-child, right-child, then node, emitting as you go.
// That order produces instructions in exactly the sequence a stack machine
// needs: both operands land on the stack before the operator pops them.
//
// No temporaries. No register allocation. No bookkeeping at all. This is
// why the JVM, CPython and WebAssembly all chose stack machines, and why
// targeting a register machine is a much harder project.

export type Node =
  | { n: "num"; v: number }
  | { n: "bin"; op: "+" | "-" | "*" | "/"; l: Node; r: Node };

/**
 * The INTERPRETER. Given for comparison — read it before writing the next one.
 */
export function evaluate(n: Node): number {
  if (n.n === "num") return n.v;
  const a = evaluate(n.l);
  const b = evaluate(n.r);
  switch (n.op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return (a / b) | 0;
  }
}

/**
 * The COMPILER. Same walk. Instead of computing, it appends to `out`.
 *
 * TODO: implement this.
 *
 *   A number appends its value.
 *   A binary node compiles its LEFT child, then its RIGHT child, then
 *   appends the operator.
 *
 *   Left first. Compile right-then-left and `10 - 3` becomes -7 — the same
 *   pop-order trap as step 03, now wearing a different hat.
 *
 *   Put the two functions side by side when you are done. The structure is
 *   identical; only the body differs. That is the entire difference between
 *   an interpreter and a compiler, and you are looking at it in ten lines.
 */
export function compile(n: Node, out: (number | string)[]): void {
  throw new Error("TODO: compile");
}

/**
 * Runs the flat output of `compile` on a stack machine.
 *
 * TODO: implement this. It is step 03's evalStack again — write it from
 * memory rather than looking back, and return the single remaining value.
 */
export function runFlat(ops: (number | string)[]): number {
  throw new Error("TODO: runFlat");
}
