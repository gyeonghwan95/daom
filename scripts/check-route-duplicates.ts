/**
 * 부동산등기 신규 slug 중복·유사 검사
 * 실행: npx tsx scripts/check-route-duplicates.ts
 */
import { realEstateSearchIntents } from "../src/data/seo/real-estate-search-intents";
import { getAllSearchIntentSlugs } from "../src/lib/local-landing/search-intent";

const seeded = new Set(getAllSearchIntentSlugs());

const createNew = realEstateSearchIntents.filter((i) => i.action === "create-new");
const doNot = realEstateSearchIntents.filter((i) => i.action === "do-not-create");

let errors = 0;

console.log("=== create-new must be seeded ===");
for (const intent of createNew) {
  const slug = intent.targetUrl.replace(/^\//, "");
  if (!seeded.has(slug)) {
    console.error(`NOT SEEDED: ${intent.targetUrl}`);
    errors += 1;
  } else {
    console.log(`OK seeded: /${slug}`);
  }
}

console.log("\n=== do-not-create must NOT be seeded ===");
for (const intent of doNot) {
  const slug = intent.targetUrl.replace(/^\//, "");
  // do-not-create may point at an existing strong URL (e.g. 잔금일법무사) — only ban the forbidden synonym slug itself
  const forbiddenSlug = intent.primaryKeyword.includes("잔금일등기")
    ? "부산잔금일등기"
    : intent.primaryKeyword.includes("명의이전")
      ? "부산명의이전등기"
      : intent.primaryKeyword.includes("매매소유권이전")
        ? "부산매매소유권이전등기"
        : null;
  if (forbiddenSlug && seeded.has(forbiddenSlug)) {
    console.error(`FORBIDDEN slug seeded: /${forbiddenSlug}`);
    errors += 1;
  } else if (forbiddenSlug) {
    console.log(`OK not seeded: /${forbiddenSlug} → ${intent.targetUrl}`);
  }
}

const slugCounts = new Map<string, number>();
for (const slug of seeded) {
  slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
}
for (const [slug, count] of slugCounts) {
  if (count > 1) {
    console.error(`duplicate seed slug: ${slug}`);
    errors += 1;
  }
}

if (errors) process.exit(1);
console.log("\nOK — no route/seed conflicts");
