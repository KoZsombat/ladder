# 01_content_address

## Hint 1
```ts
export function wrap(type: string, content: Buffer): Buffer {
  const header = Buffer.from(`${type} ${content.length}\0`, "utf8");
  return Buffer.concat([header, content]);
}
```
`content.length` on a Buffer is already the byte length — that is the point
of taking a Buffer rather than a string.

## Hint 2
```ts
export function objectId(type: string, content: Buffer): string {
  return createHash("sha1").update(wrap(type, content)).digest("hex");
}
```
If your empty-blob hash is not `e69de29b...`, you are hashing the content
without the header.

## Hint 3
```ts
put(type: string, content: Buffer): string {
  const id = objectId(type, content);
  if (!this.objects.has(id)) this.objects.set(id, wrap(type, content));
  return id;
}
get(id: string): Buffer | undefined { return this.objects.get(id); }
```

## Hint 4
```ts
export function unwrap(buf: Buffer): { type: string; content: Buffer } {
  const nul = buf.indexOf(0);
  if (nul < 0) throw new Error("no header terminator");
  const [type, lenStr] = buf.subarray(0, nul).toString().split(" ");
  const content = buf.subarray(nul + 1);
  if (Number(lenStr) !== content.length) {
    throw new Error(`header says ${lenStr} bytes, found ${content.length}`);
  }
  return { type, content };
}
```
