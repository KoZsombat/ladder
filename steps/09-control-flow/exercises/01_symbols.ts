// 01 — symbol tables and scope
//
// The VM only ever sees numbers. A symbol table is the compile-time map
// from a name to the slot that holds it.
//
// Once you add blocks, you need a STACK of those maps: a lookup walks
// outward from the innermost scope, and declaring a name in an inner scope
// SHADOWS the outer one without destroying it. That is the whole mechanism
// behind every `let` you have ever written.

export class Scopes {
  private frames: Map<string, number>[] = [new Map()];
  private next = 0;

  /** TODO: implement. Push a new empty scope. */
  push(): void {
    throw new Error("TODO: push");
  }

  /**
   * TODO: implement. Pop the innermost scope.
   *
   *   Do NOT reclaim the slot numbers. Reusing a slot that an inner scope
   *   had is how you get two variables sharing storage, which produces
   *   bugs that look like memory corruption in a language that has none.
   *   Throw if someone pops the global scope.
   */
  pop(): void {
    throw new Error("TODO: pop");
  }

  /**
   * Declares a name in the CURRENT scope and returns its slot.
   *
   * TODO: implement this.
   *
   *   Re-declaring in the same scope should reuse the same slot (so
   *   `x = 1; x = 2` is one variable). Re-declaring in an INNER scope must
   *   allocate a new one — that is shadowing, not assignment.
   */
  declare(name: string): number {
    throw new Error("TODO: declare");
  }

  /**
   * Looks a name up, innermost scope first.
   *
   * TODO: implement this. Return undefined when it is not found anywhere.
   */
  lookup(name: string): number | undefined {
    throw new Error("TODO: lookup");
  }

  /** How many distinct slots have been handed out. */
  slotCount(): number {
    return this.next;
  }
}
