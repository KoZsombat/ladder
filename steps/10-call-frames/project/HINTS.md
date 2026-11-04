# 08 — Hints

## Tier 1 — order of work
CALL and RET with no arguments first; get the instruction pointer going there
and coming back with `trace` on. Then arguments. Then recursion. Closures
last — they are a separate idea bolted on top.

## Tier 2 — CALL and RET
```ts
case OP.CALL: {
  const target = program[ip + 1];
  const argc = program[ip + 2];
  const base = locals.length;
  const args = stack.splice(stack.length - argc, argc);
  locals.push(...args);
  frames.push({ ret: ip + 3, base, argc, closure: -1 });
  if (frames.length > MAX_DEPTH) throw new Error("stack overflow");
  ip = target;
  break;
}

case OP.RET: {
  const f = frames.pop()!;
  locals.length = f.base;      // the locals VANISH — this is why recursion works
  if (f.ret === -1) return { output, stack, locals, frames, heap };
  ip = f.ret;
  break;
}
```

## Tier 3 — closures
```ts
case OP.MAKE_CLOSURE: {
  const addr = program[ip + 1];
  const n = program[ip + 2];
  const captured = stack.splice(stack.length - n, n);  // BY VALUE
  heap.push({ addr, captured });
  stack.push(heap.length - 1);
  ip += 3;
  break;
}

case OP.LOAD_CAPTURED:
  stack.push(heap[frame().closure].captured[program[ip + 1]]);
  ip += 2;
  break;

case OP.CALL_VALUE: {
  const argc = program[ip + 1];
  const args = stack.splice(stack.length - argc, argc);
  const idx = stack.pop()!;                 // the closure sat below the args
  const base = locals.length;
  locals.push(...args);
  frames.push({ ret: ip + 2, base, argc, closure: idx });
  if (frames.length > MAX_DEPTH) throw new Error("stack overflow");
  ip = heap[idx].addr;
  break;
}
```

## Tier 4 — the thing worth ten minutes
You just implemented capture BY VALUE. Python and JavaScript instead keep a
chain of heap-allocated scopes that frames point into. Write down what would
change if you did it that way — and you will finally understand exactly why
a JavaScript loop variable captured in a closure behaved the way it did
before `let`.

Then, if you want the real stretch: a mark-and-sweep collector for `heap`.
Two more hours, and it is the only way to really understand a GC pause.
