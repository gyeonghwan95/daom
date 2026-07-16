/**
 * 기업 검색의도·페이지 중복 감사
 * 실행: npx tsx scripts/audit-business-pages.ts
 */
import { businessSearchIntents } from "../src/data/business/search-intents";
import { businessPages, getAllBusinessSlugs } from "../src/lib/business/content";

const targetMap = new Map<string, string[]>();
for (const intent of businessSearchIntents) {
  const url = intent.targetUrl ?? intent.existingUrl ?? "(none)";
  const list = targetMap.get(url) ?? [];
  list.push(intent.primaryKeyword);
  targetMap.set(url, list);
}

console.log("=== action 요약 ===");
for (const action of [
  "create-new",
  "strengthen-existing",
  "merge-into-existing",
  "section-only",
  "faq-only",
  "do-not-target",
] as const) {
  const items = businessSearchIntents.filter((item) => item.action === action);
  console.log(`\n[${action}] ${items.length}`);
  for (const item of items) {
    console.log(
      `  - ${item.primaryKeyword} → ${item.targetUrl ?? item.existingUrl ?? "-"}`,
    );
  }
}

console.log("\n=== 신규 페이지 slug ===");
for (const slug of getAllBusinessSlugs()) {
  const page = businessPages.find((item) => item.slug === slug)!;
  console.log(`  /${slug} | ${page.metaTitle}`);
}

const titles = new Map<string, string>();
let dupTitle = 0;
for (const page of businessPages) {
  if (titles.has(page.metaTitle)) {
    console.error(`duplicate metaTitle: ${page.metaTitle}`);
    dupTitle += 1;
  }
  titles.set(page.metaTitle, page.slug);
}

if (dupTitle) process.exit(1);
console.log("\nOK: no duplicate business meta titles");
