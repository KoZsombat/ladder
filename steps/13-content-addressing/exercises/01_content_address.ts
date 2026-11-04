// 01 — naming data by its own hash
//
// Content addressing: the key IS the hash of the value. Three consequences
// fall straight out of that, and all three are why git is shaped the way
// it is.
//
//   - identical content is automatically stored once
//   - any change to content changes its name, so history is tamper-evident
//   - nothing can be "updated in place"; you write a new object and move a
//     pointer

import { createHash } from "node:crypto";

/**
 * Git's object format: "<type> <byte-length>\0<content>".
 *
 * TODO: implement this.
 *
 *   Return a Buffer of the header followed by the content.
 *
 *   The LENGTH is the byte length of the CONTENT only, not including the
 *   header. Use Buffer.byteLength, not String.length — "héllo" is 5
 *   characters and 6 bytes, and git counts bytes.
 */
export function wrap(type: string, content: Buffer): Buffer {
  throw new Error("TODO: wrap");
}

/**
 * The object's name: the SHA-1 of the WRAPPED bytes, as 40 hex characters.
 *
 * TODO: implement this.
 *
 *   The hash covers the header too. Hashing only the content gives you
 *   plausible-looking hashes that real git will not recognise, and it is
 *   the single most common mistake in this project.
 */
export function objectId(type: string, content: Buffer): string {
  throw new Error("TODO: objectId");
}

/**
 * An in-memory object store.
 *
 * TODO: implement `put` and `get`.
 *
 *   put: compute the id, store the WRAPPED bytes under it, return the id.
 *        Storing the same content twice must store ONE copy — that
 *        deduplication is free, and it is why git repositories are smaller
 *        than you expect.
 *   get: return the wrapped bytes, or undefined.
 */
export class Store {
  private objects = new Map<string, Buffer>();

  put(type: string, content: Buffer): string {
    throw new Error("TODO: put");
  }

  get(id: string): Buffer | undefined {
    throw new Error("TODO: get");
  }

  size(): number {
    return this.objects.size;
  }
}

/**
 * Splits a wrapped object back into its type and content.
 *
 * TODO: implement this.
 *
 *   Find the first zero byte (indexOf(0)), parse "<type> <len>" before it,
 *   and take the content after it. Verify the length matches and throw if
 *   it does not — a corrupt object should announce itself.
 */
export function unwrap(buf: Buffer): { type: string; content: Buffer } {
  throw new Error("TODO: unwrap");
}
