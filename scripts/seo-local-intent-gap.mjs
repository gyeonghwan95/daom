#!/usr/bin/env node
/** Local/situation intent gap pipeline (no auto-publish). */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("node", ["scripts/build-full-intent-inventory.mjs"]);
run("node", ["scripts/fetch-naver-search-trends.mjs"]);

const summary = {
  generatedAt: new Date().toISOString(),
  inventory: "reports/seo/full-intent-inventory.json",
  map: "docs/seo/FULL_SEARCH_INTENT_MAP.md",
  gapReport: "docs/seo/LOCAL_AND_SITUATION_KEYWORD_GAP.md",
  localRegistry: "src/data/seo/busan-local-intent-registry.ts",
  note: "No auto-publish. Prefer STRENGTHEN/aliases over CREATE_NEW. No thin geo clones.",
};

fs.mkdirSync(path.join(ROOT, "reports", "seo"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "reports", "seo", "local-intent-gap-run.json"),
  JSON.stringify(summary, null, 2) + "\n",
);
console.log("\nseo:local-intent-gap complete", summary);
