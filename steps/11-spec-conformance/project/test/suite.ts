// Sitting two: the conformance runner.
//
//   git clone https://github.com/nst/JSONTestSuite
//   node --experimental-strip-types test/suite.ts <path>/JSONTestSuite/test_parsing
//
// y_ must be accepted · n_ must be rejected · i_ either is fine.
// Expect to fail 30-60 of roughly 300 on the first run. That is the point.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "../src/json.ts";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: suite.ts <path-to-JSONTestSuite/test_parsing>");
  process.exit(1);
}

let pass = 0;
const failures: string[] = [];

for (const f of readdirSync(dir).sort()) {
  if (!f.endsWith(".json")) continue;
  const src = readFileSync(join(dir, f), "utf8");
  let ok: boolean;
  try {
    parse(src);
    ok = true;
  } catch {
    ok = false;
  }
  const expected = f.startsWith("y_") ? true : f.startsWith("n_") ? false : ok;
  if (ok === expected) pass++;
  else failures.push(`${ok ? "accepted" : "rejected"} ${f}`);
}

console.log(`${pass} / ${pass + failures.length} passed`);
for (const f of failures) console.log("  " + f);
