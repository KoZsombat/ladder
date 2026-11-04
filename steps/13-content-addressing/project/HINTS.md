# Project — Hints

## Tier 1 — order of work
`wrap` and `objectId` first (copy them from exercise 01), then
`writeObject`, and run the "git itself can read a blob" test. Once git can
read one object of yours, everything else is more of the same.

## Tier 2 — writing and reading
```ts
export function writeObject(gitDir: string, type: string, content: Buffer): string {
  const id = objectId(type, content);
  const dir = join(gitDir, "objects", id.slice(0, 2));
  const file = join(dir, id.slice(2));
  if (existsSync(file)) return id;
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, deflateSync(wrap(type, content)), { mode: 0o444 });
  return id;
}

export function readObject(gitDir: string, id: string) {
  const file = join(gitDir, "objects", id.slice(0, 2), id.slice(2));
  const buf = inflateSync(readFileSync(file));
  const nul = buf.indexOf(0);
  const [type, len] = buf.subarray(0, nul).toString().split(" ");
  const content = buf.subarray(nul + 1);
  if (Number(len) !== content.length) throw new Error(`corrupt object ${id}`);
  return { type, content };
}
```
`deflateSync`, not `gzipSync`. Gzip adds its own header and git will not
recognise the object.

## Tier 3 — refs
```ts
export function updateRef(gitDir: string, ref: string, id: string): void {
  const file = join(gitDir, ref);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, id + "\n");
}

export function readRef(gitDir: string, ref: string): string | undefined {
  const file = join(gitDir, ref);
  return existsSync(file) ? readFileSync(file, "utf8").trim() : undefined;
}
```

## Tier 4 — log
```ts
export function log(gitDir: string, startId: string): string[] {
  const out: string[] = [];
  let id: string | undefined = startId;
  while (id) {
    out.push(id);
    const { content } = readObject(gitDir, id);
    const line = content.toString().split("\n").find((l) => l.startsWith("parent "));
    id = line?.slice(7).trim();     // FIRST parent only
  }
  return out;
}
```

## Tier 5 — when fsck complains
- *"invalid sha1 pointer"* in a tree: you wrote hex instead of 20 raw bytes.
- *"not a valid object name"*: wrapping or compression is wrong — check that
  the empty blob hashes to `e69de29b...`.
- *"contains zero-padded file modes"*: you wrote `040000` for a directory;
  it is `40000`, five digits.
- *"tree is not sorted"*: sort by name.

## Tier 6 — stretch
Add a second parent and make a merge commit. Then implement `git add`
against the index file — a different, binary format with its own quirks and
a genuinely good next project.
