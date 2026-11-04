export type Cont = (pos: number) => number | null;

let steps = 0;

export function matchFrom(pat: string, pi: number, s: string, pos: number, cont: Cont): number | null {
  steps++;
  if (pi === pat.length) return cont(pos);
  const p = pat[pi];

  if (p === "?") {
    return pos < s.length ? matchFrom(pat, pi + 1, s, pos + 1, cont) : null;
  }

  if (p === "*") {
    for (let take = s.length - pos; take >= 0; take--) {
      const r = matchFrom(pat, pi + 1, s, pos + take, cont);
      if (r !== null) return r;
    }
    return null;
  }

  return s[pos] === p ? matchFrom(pat, pi + 1, s, pos + 1, cont) : null;
}

export function matches(pat: string, s: string): boolean {
  return matchFrom(pat, 0, s, 0, (p) => (p === s.length ? p : null)) !== null;
}

export function matchCost(pat: string, s: string): number {
  steps = 0;
  matchFrom(pat, 0, s, 0, (p) => (p === s.length ? p : null));
  return steps;
}
