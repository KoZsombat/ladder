import { test } from "node:test";
import assert from "node:assert/strict";
import { Scopes } from "./01_symbols.ts";

test("declare and look up", () => {
  const s = new Scopes();
  const a = s.declare("a");
  assert.equal(s.lookup("a"), a);
  assert.equal(s.lookup("nope"), undefined);
});

test("re-declaring in the same scope reuses the slot", () => {
  const s = new Scopes();
  assert.equal(s.declare("x"), s.declare("x"));
  assert.equal(s.slotCount(), 1);
});

test("an inner scope SHADOWS without destroying", () => {
  const s = new Scopes();
  const outer = s.declare("x");
  s.push();
  const inner = s.declare("x");
  assert.notEqual(inner, outer, "shadowing must allocate a new slot");
  assert.equal(s.lookup("x"), inner, "innermost wins");
  s.pop();
  assert.equal(s.lookup("x"), outer, "the outer one is still there");
});

test("lookup walks outward", () => {
  const s = new Scopes();
  const g = s.declare("g");
  s.push();
  s.push();
  assert.equal(s.lookup("g"), g);
});

test("slots are never reused after a pop", () => {
  const s = new Scopes();
  s.push();
  s.declare("tmp");
  s.pop();
  s.push();
  const other = s.declare("other");
  assert.equal(other, 1, "slot 0 was taken by tmp and must not be handed out again");
});

test("popping the global scope is an error", () => {
  const s = new Scopes();
  assert.throws(() => s.pop());
});
