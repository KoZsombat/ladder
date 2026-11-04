import { test } from "node:test";
import assert from "node:assert/strict";
import { step, run, type Ev } from "./02_transitions.ts";

const push: Ev = { kind: "push" };
const pull: Ev = { kind: "pull" };
const key: Ev = { kind: "turnKey" };

test("opening and closing", () => {
  const [s1, fx1] = step("closed", push);
  assert.equal(s1, "open");
  assert.deepEqual(fx1, [{ kind: "sound", what: "creak" }]);

  const [s2, fx2] = step("open", pull);
  assert.equal(s2, "closed");
  assert.deepEqual(fx2, [{ kind: "sound", what: "thud" }]);
});

test("locking both ways", () => {
  assert.equal(step("closed", key)[0], "locked");
  assert.equal(step("locked", key)[0], "closed");
  assert.deepEqual(step("closed", key)[1], [{ kind: "sound", what: "click" }]);
});

test("illegal transitions are refused and the state does not change", () => {
  const [s, fx] = step("locked", push);
  assert.equal(s, "locked");
  assert.equal(fx.length, 1);
  assert.equal(fx[0].kind, "refuse");

  assert.equal(step("closed", pull)[0], "closed");
  assert.equal(step("open", push)[0], "open");
  assert.equal(step("open", key)[0], "open", "you cannot lock an open door");
});

test("run threads the state through", () => {
  const [s, fx] = run("closed", [push, pull, key, key, push]);
  assert.equal(s, "open");
  assert.equal(fx.filter((f) => f.kind === "sound").length, 5);
});

test("step does not mutate", () => {
  const before: "closed" = "closed";
  step(before, push);
  assert.equal(before, "closed");
});
