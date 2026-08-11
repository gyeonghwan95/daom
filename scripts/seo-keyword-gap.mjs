#!/usr/bin/env node
/**
 * Keyword-gap analysis pipeline (no auto-publish).
 * Usage: npm run seo:keyword-gap
 */
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
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

run("node", ["scripts/build-content-inventory.mjs"]);
run("node", ["scripts/fetch-naver-search-trends.mjs"]);

const trendPath = path.join(ROOT, "reports", "seo", "naver-datalab-trends.json");
const trend = fs.existsSync(trendPath)
  ? JSON.parse(fs.readFileSync(trendPath, "utf8"))
  : { status: "TREND_DATA_UNAVAILABLE" };

const summary = {
  generatedAt: new Date().toISOString(),
  inventory: "reports/seo/content-inventory.json",
  contentMap: "docs/seo/CURRENT_CONTENT_MAP.md",
  gapReport: "docs/seo/NAVER_KEYWORD_GAP_REPORT.md",
  intentRegistry: "src/data/seo/search-intent-registry.ts",
  opportunityLog: "data/internal/content-opportunity-log.json",
  trendStatus: trend.status || "UNKNOWN",
  note: "Auto-publish is forbidden. Review gap report before creating pages.",
};

fs.mkdirSync(path.join(ROOT, "reports", "seo"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "reports", "seo", "keyword-gap-run.json"),
  JSON.stringify(summary, null, 2) + "\n",
  "utf8",
);

console.log("\nkeyword-gap complete:", summary);
