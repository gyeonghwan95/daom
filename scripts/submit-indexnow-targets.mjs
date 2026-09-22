/**
 * One-shot IndexNow submit for TARGET SEO surgery URLs (list file).
 * Usage: node scripts/submit-indexnow-targets.mjs [--dry-run] [--endpoint=naver]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./lib/site-url.mjs";
import {
  INDEXNOW_KEY,
  INDEXNOW_ENDPOINTS,
  getIndexNowHost,
  getIndexNowKeyLocation,
} from "./lib/indexnow.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIST = path.join(ROOT, "reports/target-seo-2026-09-22/09-indexnow-targets.txt");
const KEY_FILE = path.join(ROOT, "public", `${INDEXNOW_KEY}.txt`);

const dryRun = process.argv.includes("--dry-run");
const endpointArg = process.argv.find((a) => a.startsWith("--endpoint="));
const endpoint = endpointArg ? endpointArg.slice("--endpoint=".length) : "naver";
const endpointUrl = INDEXNOW_ENDPOINTS[endpoint] ?? endpoint;

const SITE_URL = getSiteUrl().replace(/\/$/, "");
const host = getIndexNowHost(SITE_URL);
const keyLocation = getIndexNowKeyLocation(SITE_URL);

if (!fs.existsSync(KEY_FILE) || fs.readFileSync(KEY_FILE, "utf8").trim() !== INDEXNOW_KEY) {
  console.error("[indexnow-targets] key file mismatch");
  process.exit(1);
}

const urlList = fs
  .readFileSync(LIST, "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.startsWith("http"));

if (urlList.length === 0) {
  console.error("[indexnow-targets] empty list");
  process.exit(1);
}

const payload = { host, key: INDEXNOW_KEY, keyLocation, urlList };
console.log(`[indexnow-targets] ${urlList.length} URLs → ${endpoint}`);
urlList.forEach((u) => console.log(`  ${u}`));

if (dryRun) {
  console.log("[indexnow-targets] dry-run — not submitted");
  process.exit(0);
}

const res = await fetch(endpointUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});
const text = await res.text().catch(() => "");
console.log(`[indexnow-targets] HTTP ${res.status}`);
if (text) console.log(text.slice(0, 500));
if (res.status !== 200 && res.status !== 202) process.exit(1);
console.log("[indexnow-targets] OK");
