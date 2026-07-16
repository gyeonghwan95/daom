/**
 * 검색 인덱스 품질 검사
 * Usage: npx tsx scripts/check-search-index.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";
import type { SearchIndexItem } from "../src/lib/search/types";
import { FEATURED_PATHS } from "../src/lib/search/popular-links";
import { searchSite } from "../src/lib/search/search-site";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const INDEX_PATH = path.join(ROOT, "src/generated/search-index.json");

const SAMPLE_QUERIES = [
  "부산법무사",
  "상속 빚",
  "부모님 사망",
  "회생",
  "파산",
  "법인 주소 이전",
  "대표이사 변경",
  "근저당 말소",
  "전세 강의",
  "강사 섭외",
  "복대리",
  "집단등기",
  "수임료",
  "센텀 상속",
];

function main() {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error(`[check-search-index] missing ${INDEX_PATH}`);
    console.error("Run: npm run build:search");
    process.exit(1);
  }

  const items = JSON.parse(
    fs.readFileSync(INDEX_PATH, "utf8"),
  ) as SearchIndexItem[];
  const published = new Set(getAllPublishedPaths());

  const errors: string[] = [];
  const warnings: string[] = [];

  const hrefSeen = new Map<string, string>();
  const titleSeen = new Map<string, string>();

  for (const item of items) {
    if (!item.title?.trim()) {
      errors.push(`missing title: ${item.href}`);
    }
    if (!item.category) {
      errors.push(`missing category: ${item.href}`);
    }
    if (!item.keywords || item.keywords.length === 0) {
      warnings.push(`no keywords: ${item.href}`);
    }
    if ((item.description?.length ?? 0) > 200) {
      warnings.push(`long description (${item.description?.length}): ${item.href}`);
    }

    if (hrefSeen.has(item.href)) {
      errors.push(`duplicate href: ${item.href}`);
    } else {
      hrefSeen.set(item.href, item.id);
    }

    const titleKey = item.title.trim();
    if (titleSeen.has(titleKey)) {
      warnings.push(
        `duplicate title "${titleKey}": ${item.href} vs ${titleSeen.get(titleKey)}`,
      );
    } else {
      titleSeen.set(titleKey, item.href);
    }

    if (!published.has(item.href) && item.href !== "/") {
      // 메뉴·정적 경로는 published에 있을 것으로 기대
      warnings.push(`href not in published-paths: ${item.href}`);
    }

    if (
      item.href.includes("blog/external") ||
      item.category === ("external" as string) ||
      /네이버\s*블로그/.test(item.title)
    ) {
      errors.push(`naver/external blog included: ${item.href}`);
    }

    if (item.href.startsWith("http")) {
      errors.push(`external URL in index: ${item.href}`);
    }
  }

  for (const featured of FEATURED_PATHS) {
    const found = items.find((item) => item.href === featured);
    if (!found) {
      warnings.push(`featured path missing from index: ${featured}`);
    } else if (!found.priority || found.priority < 50) {
      warnings.push(`featured path low priority: ${featured}`);
    }
  }

  console.log(`[check-search-index] items: ${items.length}`);
  console.log("[check-search-index] sample queries:");
  for (const query of SAMPLE_QUERIES) {
    const results = searchSite(items, query, { limit: 3 });
    const top = results.map((r) => r.href).join(", ") || "(none)";
    console.log(`  "${query}" → ${top}`);
    if (results.length === 0) {
      warnings.push(`no results for sample query: ${query}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n[check-search-index] ${warnings.length} warnings:`);
    for (const warning of warnings.slice(0, 40)) {
      console.warn(`  ⚠ ${warning}`);
    }
    if (warnings.length > 40) {
      console.warn(`  … and ${warnings.length - 40} more`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n[check-search-index] ${errors.length} errors:`);
    for (const error of errors) {
      console.error(`  ✖ ${error}`);
    }
    process.exit(1);
  }

  console.log("\n[check-search-index] OK");
}

main();
