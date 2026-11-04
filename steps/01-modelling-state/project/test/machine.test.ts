import { test } from "node:test";
import assert from "node:assert/strict";
import { fresh, step, makeChange, type Event, type Machine, type Effect, type Coin } from "../src/machine.ts";

function run(m: Machine, events: Event[]): [Machine, Effect[]] {
  let fx: Effect[] = [];
  for (const e of events) {
    const [next, out] = step(m, e);
    m = next;
    fx = [...fx, ...out];
  }
  return [m, fx];
}

const coin = (value: Coin): Event => ({ kind: "coin", value });
const select = (slot: string): Event => ({ kind: "select", slot });
const sum = (cs: Coin[]) => cs.reduce((a, b) => a + b, 0);

test("buy with exact-ish money, gets change", () => {
  const [m, fx] = run(fresh(), [coin(100), select("B4")]);
  assert.ok(fx.some((f) => f.kind === "dispense" && f.slot === "B4"), "should dispense B4");
  const ret = fx.find((f) => f.kind === "returnCoins");
  assert.ok(ret && ret.kind === "returnCoins" && sum(ret.coins) === 30, "should return 30 Ft");
  assert.equal(m.credit, 0);
  assert.equal(m.slots.B4.qty, 2, "stock should drop");
});

test("not enough credit refuses and keeps the money", () => {
  const [m, fx] = run(fresh(), [coin(50), select("B4")]);
  assert.ok(fx.some((f) => f.kind === "refuse"));
  assert.equal(m.credit, 50, "the machine must not swallow the money");
  assert.equal(m.slots.B4.qty, 3, "stock must not drop on a refusal");
});

test("cancel returns everything", () => {
  const [m, fx] = run(fresh(), [coin(100), coin(20), { kind: "cancel" }]);
  const ret = fx.find((f) => f.kind === "returnCoins");
  assert.ok(ret && ret.kind === "returnCoins" && sum(ret.coins) === 120);
  assert.equal(m.credit, 0);
  assert.equal(m.state, "idle");
});

test("sold out refuses and keeps the credit", () => {
  const [m, fx] = run(fresh(), [coin(100), select("C1")]);
  assert.ok(fx.some((f) => f.kind === "refuse"));
  assert.equal(m.credit, 100);
});

test("cannot make change: refuse the sale and refund", () => {
  // empty the float so 20 Ft change is impossible
  const m0 = fresh();
  m0.float = { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 };
  const [m, fx] = run(m0, [coin(100), select("B4")]);
  assert.ok(!fx.some((f) => f.kind === "dispense"), "must not dispense");
  assert.ok(fx.some((f) => f.kind === "refuse"));
  assert.equal(m.credit, 0, "the credit should be refunded");
});

test("makeChange", () => {
  const full: Record<Coin, number> = { 200: 5, 100: 5, 50: 5, 20: 5, 10: 5, 5: 5 };
  assert.equal(sum(makeChange(30, full)!), 30);
  assert.equal(sum(makeChange(0, full)!), 0);
  assert.equal(makeChange(7, full), null, "7 is not payable with these coins");
  assert.equal(makeChange(50, { 200: 0, 100: 0, 50: 0, 20: 1, 10: 1, 5: 0 }), null);
});
