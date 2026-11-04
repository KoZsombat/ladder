# 02_transitions

## Hint 1
Nine pairs. A nested switch — outer on `state`, inner on `e.kind` — makes
all nine visible at once, which is the point.

## Hint 2
```ts
export function step(state: Door, e: Ev): [Door, Fx[]] {
  switch (state) {
    case "closed":
      if (e.kind === "push") return ["open", [{ kind: "sound", what: "creak" }]];
      if (e.kind === "turnKey") return ["locked", [{ kind: "sound", what: "click" }]];
      return ["closed", [{ kind: "refuse", why: "already closed" }]];
    // ...
  }
}
```

## Hint 3
```ts
case "open":
  if (e.kind === "pull") return ["closed", [{ kind: "sound", what: "thud" }]];
  if (e.kind === "push") return ["open", [{ kind: "refuse", why: "already open" }]];
  return ["open", [{ kind: "refuse", why: "cannot lock an open door" }]];

case "locked":
  if (e.kind === "turnKey") return ["closed", [{ kind: "sound", what: "click" }]];
  return ["locked", [{ kind: "refuse", why: "locked" }]];
```
and
```ts
export function run(start: Door, events: Ev[]): [Door, Fx[]] {
  return events.reduce<[Door, Fx[]]>(
    ([s, fx], e) => {
      const [next, out] = step(s, e);
      return [next, [...fx, ...out]];
    },
    [start, []],
  );
}
```

## Hint 4 — the habit to take with you
Notice that every refusal returns the SAME state it was given. In the
vending machine that rule becomes "a refused purchase must not swallow the
customer's money", and the test checks for it explicitly.
