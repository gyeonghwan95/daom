#!/usr/bin/env node
// node scripts/rseo-list.mjs 양산 창원 ...  → existing indexable URLs containing each token
import fs from "node:fs";
const paths = JSON.parse(fs.readFileSync("scripts/output/seo-paths.json", "utf8")).paths.map((p) => decodeURIComponent(p));
for (const t of process.argv.slice(2)) {
  console.log(`## ${t}`);
  for (const p of paths.filter((x) => x.includes(t))) console.log(p);
}
