export type Coin = 5 | 10 | 20 | 50 | 100 | 200;

export type Event =
  | { kind: "coin"; value: Coin }
  | { kind: "select"; slot: string }
  | { kind: "cancel" }
  | { kind: "restock"; slot: string; qty: number }
  | { kind: "fault" };

export type Effect =
  | { kind: "dispense"; slot: string; name: string }
  | { kind: "returnCoins"; coins: Coin[] }
  | { kind: "refuse"; reason: string }
  | { kind: "display"; text: string };

export type Slot = { name: string; price: number; qty: number };

export type Machine = {
  state: "idle" | "collecting" | "outOfService";
  credit: number; // Ft, integer — never a float
  slots: Record<string, Slot>;
  float: Record<Coin, number>; // how many of each coin the machine holds
};

export const COINS: Coin[] = [200, 100, 50, 20, 10, 5]; // descending

/**
 * Works out which coins to hand back.
 * Returns null when the float cannot make the amount exactly.
 *
 * TODO: implement this.
 *
 *   Greedy: walk COINS from largest to smallest, take as many of each as
 *   fit in what is left AND are available in `float`.
 *
 *   Afterwards, write a test with a made-up coin set of [4, 3, 1] and an
 *   amount of 6. Greedy gives 4+1+1 (three coins); the optimum is 3+3 (two).
 *   The forint set happens to be greedy-safe, which is luck, not design.
 *   This is your first meeting with an algorithm that is right in practice
 *   and wrong in general.
 */
export function makeChange(
  amount: number,
  float: Record<Coin, number>,
): Coin[] | null {
  throw new Error("TODO: makeChange");
}

/**
 * The single important signature in this project.
 *
 * Takes the current machine and one event, returns a NEW machine plus the
 * list of things that should happen. It never prints and never reaches out
 * for anything — that is what makes every test a one-liner, and what lets
 * you test the whole thing without a motor attached.
 *
 * TODO: implement every branch. The skeleton below shows the shape.
 *
 *   Rules the tests check:
 *   - coin:    credit grows, the coin joins the float, state becomes
 *              "collecting", and you emit a display effect
 *   - select:  refuse if the slot is unknown, sold out, or underfunded —
 *              and in every refusal the credit must NOT change. Then work
 *              out the change BEFORE touching anything: if makeChange
 *              returns null, refuse and return the whole credit.
 *   - cancel:  return the entire credit, back to idle
 *   - restock: increase qty; a machine in outOfService may come back
 *   - fault:   go to outOfService
 *
 *   Do not add a `default:` branch. With every case returning, TypeScript
 *   checks the union exhaustively, so adding a new Event later becomes a
 *   compile error instead of a silent no-op. That exhaustiveness is the
 *   whole reason to model state this way.
 */
export function step(m: Machine, e: Event): [Machine, Effect[]] {
  if (m.state === "outOfService" && e.kind !== "restock") {
    return [m, [{ kind: "refuse", reason: "out of service" }]];
  }

  switch (e.kind) {
    case "coin": {
      // TODO
      throw new Error("TODO: coin");
    }
    case "select": {
      // TODO
      throw new Error("TODO: select");
    }
    case "cancel": {
      // TODO
      throw new Error("TODO: cancel");
    }
    case "restock": {
      // TODO
      throw new Error("TODO: restock");
    }
    case "fault": {
      return [{ ...m, state: "outOfService" }, []];
    }
  }
}

/** A fresh machine, used by the tests. */
export function fresh(): Machine {
  return {
    state: "idle",
    credit: 0,
    slots: {
      A2: { name: "Crisps", price: 180, qty: 2 },
      B4: { name: "Turo Rudi", price: 70, qty: 3 },
      C1: { name: "Water", price: 100, qty: 0 },
    },
    float: { 200: 1, 100: 2, 50: 1, 20: 2, 10: 2, 5: 0 },
  };
}
