import { test } from "node:test";
import assert from "node:assert/strict";
import { area, name, radius, type Shape } from "./01_unions.ts";

const circle: Shape = { kind: "circle", r: 2 };
const rect: Shape = { kind: "rect", w: 3, h: 4 };
const point: Shape = { kind: "point" };

test("area", () => {
  assert.ok(Math.abs(area(circle) - 12.566) < 0.01);
  assert.equal(area(rect), 12);
  assert.equal(area(point), 0);
});

test("name", () => {
  assert.equal(name(circle), "circle");
  assert.equal(name(rect), "rect");
  assert.equal(name(point), "point");
});

test("radius narrows", () => {
  assert.equal(radius(circle), 2);
  assert.equal(radius(rect), undefined);
  assert.equal(radius(point), undefined);
});
