import { OP } from "./vm.ts";
import type { Node } from "./parser.ts";

const BINOP: Record<string, number> = {
  "+": OP.ADD, "-": OP.SUB, "*": OP.MUL, "/": OP.DIV,
};

/**
 * Put these two side by side; this is the whole lesson.
 *
 *   evaluate(node):                   compile(node):
 *     if number: return node.v          if number: emit(PUSH, node.v)
 *     a = evaluate(node.l)              compile(node.l)
 *     b = evaluate(node.r)              compile(node.r)
 *     return a + b                      emit(ADD)
 *
 * TODO: implement this.
 *
 *   - a number emits PUSH with its value
 *   - "neg" has no opcode. Express it with what you have: PUSH 0, compile
 *     the operand, SUB.
 *   - a binary node compiles its LEFT child, then its RIGHT child, then
 *     emits the operator. Left first, or `10 - 3` becomes -7 again.
 *   - "**" has no opcode either. Throw a clear error for it; the test
 *     expects that, and "say what you cannot do" is a real design decision.
 *
 * Why this order works at all: walking left-child, right-child, then node
 * (post-order) emits instructions in exactly the order a stack machine
 * needs — both operands are on the stack before the operator pops them.
 * No temporaries, no register allocation. That is why the JVM, CPython and
 * WebAssembly all chose stack machines.
 */
export function compileExpr(n: Node, out: number[]): void {
  throw new Error("TODO: compileExpr");
}

/**
 * TODO: implement this. Compile the expression, then emit PRINT and HALT.
 */
export function compile(n: Node): number[] {
  throw new Error("TODO: compile");
}

/**
 * Stretch: constant folding.
 *
 * TODO (optional): when both children of a binary node are literals,
 * emit ONE push of the computed value instead of three instructions.
 * You have just written an optimising compiler pass.
 */
