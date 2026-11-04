export type Door = "closed" | "open" | "locked";
export type Ev = { kind: "push" } | { kind: "pull" } | { kind: "turnKey" };
export type Fx = { kind: "sound"; what: string } | { kind: "refuse"; why: string };

export function step(state: Door, e: Ev): [Door, Fx[]] {
  switch (state) {
    case "closed":
      if (e.kind === "push") return ["open", [{ kind: "sound", what: "creak" }]];
      if (e.kind === "turnKey") return ["locked", [{ kind: "sound", what: "click" }]];
      return ["closed", [{ kind: "refuse", why: "already closed" }]];

    case "open":
      if (e.kind === "pull") return ["closed", [{ kind: "sound", what: "thud" }]];
      if (e.kind === "push") return ["open", [{ kind: "refuse", why: "already open" }]];
      return ["open", [{ kind: "refuse", why: "cannot lock an open door" }]];

    case "locked":
      if (e.kind === "turnKey") return ["closed", [{ kind: "sound", what: "click" }]];
      return ["locked", [{ kind: "refuse", why: "locked" }]];
  }
}

export function run(start: Door, events: Ev[]): [Door, Fx[]] {
  return events.reduce<[Door, Fx[]]>(
    ([s, fx], e) => {
      const [next, out] = step(s, e);
      return [next, [...fx, ...out]];
    },
    [start, []],
  );
}
