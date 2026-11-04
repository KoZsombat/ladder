# 00 — Hints

## Tier 1 — where to start
Do `makeChange` first and in isolation; `step` needs it and is much easier
once it exists. Then do `coin` and `cancel` (easy), then `select` (the real
one), then `restock`.

In `select`, the order of operations is the whole exercise: validate, then
compute the change, and only then build the new machine.

## Tier 2 — shapes
```ts
export function makeChange(amount, float) {
  const out: Coin[] = [];
  const left0 = { ...float };          // do not mutate the caller's float
  let left = amount;
  for (const c of COINS) {
    while (left >= c && left0[c] > 0) { out.push(c); left -= c; left0[c]--; }
  }
  return left === 0 ? out : null;
}
```
`coin` branch:
```ts
const credit = m.credit + e.value;
const float = { ...m.float, [e.value]: m.float[e.value] + 1 };
return [{ ...m, state: "collecting", credit, float },
        [{ kind: "display", text: `${credit} Ft` }]];
```

## Tier 3 — the select branch in full
```ts
const slot = m.slots[e.slot];
if (!slot)           return [m, [{ kind: "refuse", reason: "no such slot" }]];
if (slot.qty === 0)  return [m, [{ kind: "refuse", reason: "sold out" }]];
if (m.credit < slot.price)
  return [m, [{ kind: "refuse", reason: `need ${slot.price - m.credit} Ft more` }]];

const change = makeChange(m.credit - slot.price, m.float);
if (change === null) {
  const refund = makeChange(m.credit, m.float) ?? [];
  return [{ ...m, credit: 0, state: "idle" },
          [{ kind: "refuse", reason: "cannot make change" },
           { kind: "returnCoins", coins: refund }]];
}

const float = { ...m.float };
for (const c of change) float[c]--;

return [
  { ...m, state: "idle", credit: 0, float,
    slots: { ...m.slots, [e.slot]: { ...slot, qty: slot.qty - 1 } } },
  [{ kind: "dispense", slot: e.slot, name: slot.name },
   { kind: "returnCoins", coins: change }],
];
```

## Tier 4 — stretch
Write the transition table as data (a map from state to a map from event kind
to a handler) and generate a diagram from it. That is how real state machines
ship, and it is a small change once the shape is right.
