# 03_trees

## Hint 1
Three functions, same shape: switch on `n.n`, base case for `num`, recurse
for the rest.

## Hint 2
```ts
export function evaluate(n: Node): number {
  switch (n.n) {
    case "num": return n.v;
    case "neg": return -evaluate(n.e);
    case "bin": {
      const a = evaluate(n.l), b = evaluate(n.r);
      switch (n.op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return a / b;
      }
    }
  }
}
```

## Hint 3
```ts
export function show(n: Node): string {
  switch (n.n) {
    case "num": return String(n.v);
    case "neg": return `(-${show(n.e)})`;
    case "bin": return `(${show(n.l)} ${n.op} ${show(n.r)})`;
  }
}

export function depth(n: Node): number {
  switch (n.n) {
    case "num": return 1;
    case "neg": return 1 + depth(n.e);
    case "bin": return 1 + Math.max(depth(n.l), depth(n.r));
  }
}
```

## Hint 4
You now have the three pieces of the project: a cursor, a scanner, and
recursion over a tree. The only thing the project adds is the function that
BUILDS the tree with the right shape — which is one loop and one `+ 1`.
