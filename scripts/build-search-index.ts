/**
 * 검색 인덱스 JSON 생성
 * Usage: npx tsx scripts/build-search-index.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSearchIndex,
  getSearchIndexStats,
} from "../src/lib/search/build-search-index";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "src/generated");
const OUT_JSON = path.join(OUT_DIR, "search-index.json");

function main() {
  const items = buildSearchIndex();
  const stats = getSearchIndexStats(items);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(items)}\n`, "utf8");

  const bytes = fs.statSync(OUT_JSON).size;
  const kb = (bytes / 1024).toFixed(1);

  console.log(`[build-search-index] wrote ${OUT_JSON}`);
  console.log(`[build-search-index] items: ${stats.total}`);
  console.log(`[build-search-index] featured: ${stats.featured}`);
  console.log(`[build-search-index] size: ${kb} KB`);
  console.log("[build-search-index] by category:");
  for (const [category, count] of Object.entries(stats.byCategory).sort()) {
    console.log(`  ${category}: ${count}`);
  }
}

main();
