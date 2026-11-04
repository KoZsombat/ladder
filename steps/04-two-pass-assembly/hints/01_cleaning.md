# 01_cleaning

## Hint 1
A chain: `split("\n")` → `map` strip+trim → `filter` non-empty → `map` classify.

## Hint 2
```ts
return src.split("\n")
  .map((l) => l.replace(/;.*$/, "").trim())
  .filter((l) => l.length > 0)
  .map((l) => { /* classify */ });
```

## Hint 3
```ts
.map((l): Line => {
  if (l.endsWith(":")) return { kind: "label", name: l.slice(0, -1) };
  const [op, arg] = l.split(/\s+/);
  return { kind: "instr", op: op.toLowerCase(), arg };
});
```
