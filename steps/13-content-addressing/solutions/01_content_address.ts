import { createHash } from "node:crypto";

export function wrap(type: string, content: Buffer): Buffer {
  const header = Buffer.from(`${type} ${content.length}\0`, "utf8");
  return Buffer.concat([header, content]);
}

export function objectId(type: string, content: Buffer): string {
  return createHash("sha1").update(wrap(type, content)).digest("hex");
}

export class Store {
  private objects = new Map<string, Buffer>();

  put(type: string, content: Buffer): string {
    const id = objectId(type, content);
    if (!this.objects.has(id)) this.objects.set(id, wrap(type, content));
    return id;
  }

  get(id: string): Buffer | undefined {
    return this.objects.get(id);
  }

  size(): number {
    return this.objects.size;
  }
}

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
