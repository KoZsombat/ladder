// 01 — stack discipline
//
// A stack machine keeps operands on a stack instead of in registers.
// PUSH 2, PUSH 3, ADD leaves 5. The JVM, CPython and WebAssembly all work
// this way, because it makes code generation trivial — you will see exactly
// why in step 05.
//
// The one thing to get right, and it will bite you again in the project:
// the SECOND operand comes off the stack FIRST.

/**
 * Evaluates a list of stack operations and returns the final stack.
 * Ops are numbers (pushed) or one of "+", "-", "*", "/".
 *
 * TODO: implement this.
 *
 *   For an operator: pop b, pop a, push the result. In that order.
 *   `a - b`, not `b - a`. It makes no difference for + and *, and it is
 *   the difference between 7 and -7 for subtraction.
 *
 *   Throw a clear error on an underflow — "ADD needs two operands, found 1"
 *   beats `undefined` propagating silently through ten more instructions.
 */
export type Op = number | "+" | "-" | "*" | "/";

export function evalStack(ops: Op[]): number[] {
  throw new Error("TODO: evalStack");
}

/**
 * Checks whether a program is stack-balanced: it never underflows, and it
 * ends with exactly one value.
 *
 * TODO: implement this. Return true or false, do not throw.
 *
 *   You do not need to evaluate anything — just track the DEPTH. A number
 *   adds 1, an operator subtracts 1 (pops two, pushes one). If the depth
 *   ever goes below the two an operator needs, it is unbalanced.
 *
 *   This is a type-checker in miniature: reasoning about a program without
 *   running it. Your compiler in step 05 will rely on the same property,
 *   and the project asserts the stack is empty at HALT for exactly this
 *   reason.
 */
export function isBalanced(ops: Op[]): boolean {
  throw new Error("TODO: isBalanced");
}
