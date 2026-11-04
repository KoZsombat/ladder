import { OP } from "./vm.ts";
import type { Expr, Stmt } from "./ast.ts";

const BINOP: Record<string, number> = {
  "+": OP.ADD, "-": OP.SUB, "*": OP.MUL, "/": OP.DIV,
};

export class Compiler {
  out: number[] = [];
  slots = new Map<string, number>();

  /**
   * The symbol table: name -> slot number. The VM only ever sees numbers.
   *
   * TODO: implement this. Look the name up; if it is new, assign it the
   * next free slot (which is just the current size of the map).
   */
  slotOf(name: string): number {
    throw new Error("TODO: slotOf");
  }

  emit(...xs: number[]): void {
    this.out.push(...xs);
  }

  /**
   * Emits a jump with an UNKNOWN target and returns the index of the hole.
   *
   * TODO: implement this.
   *
   *   emit(op, 0) — the 0 is a placeholder — then return the index of the
   *   OPERAND, which is out.length - 1, not - 2. Patching the opcode
   *   instead of the operand is one of the two classic bugs here.
   */
  emitJump(op: number): number {
    throw new Error("TODO: emitJump");
  }

  /**
   * Fills a hole with the address of the next instruction to be emitted.
   *
   * TODO: implement this. One line: out[site] = out.length.
   *
   *   The other classic bug is calling this one instruction too early or
   *   too late. Use the VM's trace flag when the countdown loop misbehaves.
   */
  patch(site: number): void {
    throw new Error("TODO: patch");
  }

  /**
   * TODO: implement this.
   *   num -> PUSH · var -> LOAD slotOf(name) · neg -> PUSH 0, expr, SUB
   *   bin -> left, right, then the opcode.
   *
   *   The comparison operators (< > == !=) have no opcodes. Express them
   *   with SUB and the fact that JZ tests for zero — or add opcodes to the
   *   VM. Decide, and write down which you chose.
   */
  compileExpr(e: Expr): void {
    throw new Error("TODO: compileExpr");
  }

  /**
   * TODO: implement this.
   *
   *   assign: compile the expression, then STORE slotOf(name)
   *   print:  compile the expression, then PRINT
   *   expr:   compile it, then POP — MANDATORY. A bare `1 + 1` pushes a
   *           value nobody pops, and the stack grows forever.
   *   if:     see compileIf below
   *   while:  see compileWhile below
   */
  compileStmt(st: Stmt): void {
    throw new Error("TODO: compileStmt");
  }

  /**
   * TODO: implement this. Four lines, and they are the lesson.
   *
   *   compile the condition
   *   const site = emitJump(JZ)      // "if false, jump to ... not known yet"
   *   compile every statement in the body
   *   patch(site)                    // now it is known
   */
  compileIf(st: Extract<Stmt, { s: "if" }>): void {
    throw new Error("TODO: compileIf");
  }

  /**
   * TODO: implement this. The same, plus one backward jump.
   *
   *   const top = out.length         // we jump back HERE: to the CONDITION
   *   compile the condition
   *   const exit = emitJump(JZ)
   *   compile the body
   *   emit(JMP, top)                 // fixed address, nothing to patch
   *   patch(exit)                    // lands after the JMP
   *
   *   Jumping back to the body instead of the condition gives you a loop
   *   that never re-tests and therefore never ends.
   */
  compileWhile(st: Extract<Stmt, { s: "while" }>): void {
    throw new Error("TODO: compileWhile");
  }

  compileProgram(stmts: Stmt[]): number[] {
    for (const st of stmts) this.compileStmt(st);
    this.emit(OP.HALT);
    return this.out;
  }
}

export function compile(stmts: Stmt[]): number[] {
  return new Compiler().compileProgram(stmts);
}
