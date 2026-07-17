/**
 * search-intent override 메타·본문 중복·얇은 페이지 검사
 * 실행: npx tsx scripts/check-metadata-duplicates.ts
 */
import { getAllSearchIntentContents } from "../src/lib/local-landing/search-intent";
import { getRealEstateCreateNewIntents } from "../src/data/seo/real-estate-search-intents";

const pages = getAllSearchIntentContents();
const titleMap = new Map<string, string>();
const descMap = new Map<string, string>();
const h1Map = new Map<string, string>();

let errors = 0;

for (const page of pages) {
  if (titleMap.has(page.metaTitle)) {
    console.error(
      `duplicate metaTitle: ${page.metaTitle} (${titleMap.get(page.metaTitle)} vs ${page.slug})`,
    );
    errors += 1;
  }
  titleMap.set(page.metaTitle, page.slug);

  if (descMap.has(page.metaDescription)) {
    console.error(
      `duplicate metaDescription: ${page.slug} vs ${descMap.get(page.metaDescription)}`,
    );
    errors += 1;
  }
  descMap.set(page.metaDescription, page.slug);

  if (h1Map.has(page.h1)) {
    console.warn(`duplicate h1 (warn): ${page.h1}`);
  }
  h1Map.set(page.h1, page.slug);
}

const checkedSlugs = new Set(
  getRealEstateCreateNewIntents().map((intent) =>
    intent.targetUrl.replace(/^\//, ""),
  ),
);

console.log("\n=== real-estate create-new thin-page checks ===");
for (const page of pages) {
  if (!checkedSlugs.has(page.slug)) continue;
  const text = [
    ...page.heroParagraphs,
    ...page.summaryBullets,
    ...page.procedures,
    ...page.whenNeeded,
    ...page.faqs.map((f) => f.question + f.answer),
  ].join(" ");
  const len = text.replace(/\s+/g, "").length;
  const faqCount = page.faqs.length;
  const linkCount =
    page.relatedServiceLinks.length + page.relatedGuideLinks.length;

  const issues: string[] = [];
  if (len < 1200) issues.push(`chars ${len}<1200`);
  if (faqCount < 6) issues.push(`faq ${faqCount}<6`);
  if (linkCount < 3) issues.push(`links ${linkCount}<3`);
  if (!page.procedures.length) issues.push("no procedures");
  if (!page.bottomCtaText) issues.push("no CTA");

  if (issues.length) {
    console.error(`THIN ${page.slug}: ${issues.join(", ")}`);
    errors += 1;
  } else {
    console.log(`OK ${page.slug} chars~${len} faq ${faqCount} links ${linkCount}`);
  }
}

if (errors) process.exit(1);
console.log(`\nOK — ${pages.length} search-intent pages, metadata unique for checked fields`);
