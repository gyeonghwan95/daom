/**
 * hire-intent-100 검색어를 keyword-map에 보탠다. 이미 있는 owner는 덮지 않는다.
 */
import fs from "node:fs";
import path from "node:path";
import { HIRE_INTENT_100_TARGETS } from "../src/data/seo/hire-intent-100-champions";

const file = path.join(process.cwd(), "seo/keyword-map.json");
const map = JSON.parse(fs.readFileSync(file, "utf8")) as {
  queries: Record<string, { owner: string; intent?: string; aliasOf?: string }>;
};

let added = 0;
let kept = 0;
const conflicts: string[] = [];

for (const row of HIRE_INTENT_100_TARGETS) {
  const existing = map.queries[row.query];
  if (!existing) {
    map.queries[row.query] = {
      owner: row.champion,
      intent: "hire-inflow",
    };
    added += 1;
    continue;
  }
  const owner = existing.aliasOf && map.queries[existing.aliasOf]
    ? map.queries[existing.aliasOf].owner
    : existing.owner;
  if (owner !== row.champion) {
    conflicts.push(`${row.query}: map ${owner} ≠ ${row.champion}`);
  } else {
    kept += 1;
  }
}

if (conflicts.length) {
  for (const line of conflicts) console.error(line);
  process.exit(1);
}

fs.writeFileSync(file, `${JSON.stringify(map, null, 2)}\n`);
console.log(`keyword-map hire-intent: added ${added}, kept ${kept}`);
