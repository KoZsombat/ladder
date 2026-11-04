export type TreeEntry = { mode: string; name: string; id: string };

export function encodeTree(entries: TreeEntry[]): Buffer {
  const sorted = [...entries].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const parts: Buffer[] = [];
  for (const e of sorted) {
    if (!/^[0-9a-f]{40}$/.test(e.id)) throw new Error(`bad object id: ${e.id}`);
    parts.push(Buffer.from(`${e.mode} ${e.name}\0`, "utf8"));
    parts.push(Buffer.from(e.id, "hex"));
  }
  return Buffer.concat(parts);
}

export function decodeTree(buf: Buffer): TreeEntry[] {
  const out: TreeEntry[] = [];
  let i = 0;
  while (i < buf.length) {
    const sp = buf.indexOf(0x20, i);
    const nul = buf.indexOf(0, sp);
    const mode = buf.subarray(i, sp).toString();
    const name = buf.subarray(sp + 1, nul).toString();
    const id = buf.subarray(nul + 1, nul + 21).toString("hex");
    out.push({ mode, name, id });
    i = nul + 21;
  }
  return out;
}

export function encodeCommit(o: {
  tree: string; parents: string[]; who: string; when: number; tz: string; message: string;
}): Buffer {
  const lines = [`tree ${o.tree}`];
  for (const p of o.parents) lines.push(`parent ${p}`);
  lines.push(`author ${o.who} ${o.when} ${o.tz}`);
  lines.push(`committer ${o.who} ${o.when} ${o.tz}`);
  lines.push("", o.message);
  return Buffer.from(lines.join("\n") + "\n", "utf8");
}
