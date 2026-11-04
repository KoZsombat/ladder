// 02 — a transition function that returns effects instead of doing them
//
// The shape:
//
//     step(state, event) -> [newState, effects[]]
//
// It never prints, never writes a file, never reaches out for anything. It
// is handed an event and returns a new state plus a LIST OF THINGS THAT
// SHOULD HAPPEN. Somebody else performs them.
//
// Two payoffs. Every test becomes one line with no mocking. And the rule
// "the function must be total" — every state, every event, say what
// happens — becomes checkable, because there is nothing hidden in a side
// effect.

export type Door = "closed" | "open" | "locked";

export type Ev =
  | { kind: "push" }
  | { kind: "pull" }
  | { kind: "turnKey" };

export type Fx =
  | { kind: "sound"; what: string }
  | { kind: "refuse"; why: string };

/**
 * A door. closed -> push -> open. open -> pull -> closed.
 * closed -> turnKey -> locked, and locked -> turnKey -> closed.
 * Anything else is refused.
 *
 * TODO: implement this.
 *
 *   Return a NEW state, never mutate. Emit { kind: "sound" } with
 *   "creak" when the door opens and "thud" when it closes, and
 *   "click" when the lock turns either way.
 *
 *   Refuse with a reason for the rest: pushing a locked door is
 *   { kind: "refuse", why: "locked" }, pulling an already-closed door is
 *   { kind: "refuse", why: "already closed" }, and so on.
 *
 *   Write every (state, event) pair out explicitly. There are nine. The
 *   discipline of covering all nine is the exercise — in a real system the
 *   combinations you did not think about are where the bugs live.
 */
export function step(state: Door, e: Ev): [Door, Fx[]] {
  throw new Error("TODO: step");
}

/**
 * Runs a whole sequence of events, collecting every effect.
 *
 * TODO: implement this with reduce (or a plain loop).
 *
 *   This three-line helper is why the [state, effects] shape pays off:
 *   a test becomes "feed it these five events, assert on what came out".
 */
export function run(start: Door, events: Ev[]): [Door, Fx[]] {
  throw new Error("TODO: run");
}
