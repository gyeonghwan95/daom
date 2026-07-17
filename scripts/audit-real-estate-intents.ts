/**
 * 부동산등기 검색의도 감사
 * 실행: npx tsx scripts/audit-real-estate-intents.ts
 */
import {
  getRealEstateCreateNewIntents,
  realEstateSearchIntents,
  summarizeRealEstateIntentCoverage,
} from "../src/data/seo/real-estate-search-intents";
import { getAllSearchIntentSlugs } from "../src/lib/local-landing/search-intent";

const coverage = summarizeRealEstateIntentCoverage();

console.log("=== 부동산등기 검색의도 action 요약 ===");
for (const [key, items] of Object.entries(coverage)) {
  console.log(`\n[${key}] ${items.length}`);
  for (const item of items) {
    console.log(`  - ${item.keyword} → ${item.url}`);
  }
}

const targetMap = new Map<string, string[]>();
for (const intent of realEstateSearchIntents) {
  if (intent.action === "do-not-create") continue;
  const list = targetMap.get(intent.targetUrl) ?? [];
  list.push(intent.primaryKeyword);
  targetMap.set(intent.targetUrl, list);
}

console.log("\n=== targetUrl 공유 (의도적 허브) ===");
for (const [url, keywords] of targetMap) {
  if (keywords.length > 1) {
    console.log(`  ${url}: ${keywords.join(", ")}`);
  }
}

const seeded = new Set(getAllSearchIntentSlugs());
const missingSeeds: string[] = [];
for (const intent of getRealEstateCreateNewIntents()) {
  const slug = intent.targetUrl.replace(/^\//, "");
  if (!seeded.has(slug)) missingSeeds.push(slug);
}

if (missingSeeds.length) {
  console.error("\nMISSING seeds for create-new:", missingSeeds.join(", "));
  process.exit(1);
}

const ids = new Set<string>();
for (const intent of realEstateSearchIntents) {
  if (ids.has(intent.id)) {
    console.error(`duplicate id: ${intent.id}`);
    process.exit(1);
  }
  ids.add(intent.id);
}

console.log(
  `\nOK — intents ${realEstateSearchIntents.length}, create-new seeded ${getRealEstateCreateNewIntents().length}`,
);
