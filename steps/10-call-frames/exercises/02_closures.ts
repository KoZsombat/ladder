// 02 — closures, both ways
//
// A function that outlives the frame it was created in still needs the
// variables it captured. There are two honest answers, and writing both is
// the fastest way to understand a confusion you have already lived through
// in JavaScript.
//
// BY VALUE: copy the captured values into the function object at creation.
//   Simple, fast, and the captured variable is frozen at that moment.
//
// BY REFERENCE: keep a heap-allocated cell; the closure holds a pointer to
//   it. Several closures can share one cell and see each other's writes.
//   This is what Python and JavaScript actually do.
//
// Pre-`let` JavaScript captured the loop's single `var` binding BY
// REFERENCE, so every closure saw the final value. `let` creates a fresh
// binding per iteration, which makes it behave like capture by value.

export type Cell = { v: number };

export type ByValue = { kind: "value"; captured: number[]; body: (args: number[], cap: number[]) => number };
export type ByRef = { kind: "ref"; cells: Cell[]; body: (args: number[], cells: Cell[]) => number };

/**
 * Creates a by-value closure: it COPIES the numbers it is given.
 *
 * TODO: implement this. Copy the array, do not alias it — a later write to
 * the caller's array must not be visible inside the closure.
 */
export function captureByValue(
  values: number[],
  body: (args: number[], cap: number[]) => number,
): ByValue {
  throw new Error("TODO: captureByValue");
}

/**
 * Creates a by-reference closure over existing cells.
 *
 * TODO: implement this. Keep the SAME cell objects — that sharing is the
 * whole point.
 */
export function captureByRef(
  cells: Cell[],
  body: (args: number[], cells: Cell[]) => number,
): ByRef {
  throw new Error("TODO: captureByRef");
}

/** TODO: implement. Call either kind of closure with the given arguments. */
export function callClosure(c: ByValue | ByRef, args: number[]): number {
  throw new Error("TODO: callClosure");
}

/**
 * Builds three closures in a loop, each of which returns the loop counter.
 *
 * TODO: implement this so it reproduces the classic difference.
 *
 *   With `mode === "value"` each closure captures the counter AT THAT
 *   MOMENT, so calling them gives 0, 1, 2.
 *
 *   With `mode === "ref"` all three share ONE cell that the loop keeps
 *   incrementing, so calling them gives 3, 3, 3 — the pre-`let` JavaScript
 *   behaviour, reproduced deliberately.
 */
export function makeCounters(mode: "value" | "ref"): (ByValue | ByRef)[] {
  throw new Error("TODO: makeCounters");
}
