#!/usr/bin/env node
// node scripts/rseo-peek.mjs /업무사례/경주상속등기법무사 ...  → title/h1/description + main text head from snapshot
import fs from "node:fs";
const NS = process.env.SNAP_NS || "regional-seo";
const PHASE = process.env.PEEK_PHASE || "after";
const raw = JSON.parse(fs.readFileSync(`.cache/${NS}/${PHASE}/raw.json`, "utf8"));
const manifest = JSON.parse(fs.readFileSync(`.cache/${NS}/${PHASE}/manifest.json`, "utf8"));
const len = Number(process.env.PEEK_LEN || 1800);
for (const p of process.argv.slice(2)) {
  const m = manifest.pages?.[p] ?? manifest[p] ?? {};
  const r = raw[p];
  console.log(`\n===== ${p}`);
  console.log("title:", m.title ?? m.fields?.title);
  console.log("h1:", m.h1 ?? m.fields?.h1);
  console.log("desc:", m.description ?? m.fields?.description);
  if (!r) { console.log("(no raw)"); continue; }
  console.log("chars:", r.mainText.length, "hrefs:", r.hrefs.length);
  console.log(r.mainText.slice(0, len));
}
