/**
 * 얇은 페이지 검사 (부동산등기 create-new 전체)
 * 실행: npx tsx scripts/check-thin-pages.ts
 */
import { getAllSearchIntentContents } from "../src/lib/local-landing/search-intent";
import { getRealEstateCreateNewIntents } from "../src/data/seo/real-estate-search-intents";

const checkedSlugs = getRealEstateCreateNewIntents().map((intent) =>
  intent.targetUrl.replace(/^\//, ""),
);

const bySlug = new Map(
  getAllSearchIntentContents().map((p) => [p.slug, p] as const),
);

let fail = 0;
for (const slug of checkedSlugs) {
  const page = bySlug.get(slug);
  if (!page) {
    console.error(`MISSING page content: ${slug}`);
    fail += 1;
    continue;
  }
  const body = [
    ...page.heroParagraphs,
    ...page.summaryBullets,
    ...page.whenNeeded,
    ...page.procedures,
    ...page.documents,
    ...page.commonMistakes,
    ...page.faqs.map((f) => `${f.question}${f.answer}`),
  ].join("");
  const chars = body.replace(/\s+/g, "").length;
  const h2Proxy =
    page.whenNeeded.length +
    page.procedures.length +
    (page.documents.length ? 1 : 0) +
    (page.faqs.length ? 1 : 0);
  const links =
    page.relatedServiceLinks.length + page.relatedGuideLinks.length;

  const issues: string[] = [];
  if (chars < 1200) issues.push(`chars ${chars}`);
  if (h2Proxy < 4) issues.push(`sections ${h2Proxy}`);
  if (links < 2) issues.push(`links ${links}`);
  if (page.faqs.length < 6) issues.push(`faq ${page.faqs.length}`);
  if (!page.bottomCtaText) issues.push("no CTA");

  if (issues.length) {
    console.error(`FAIL /${slug}: ${issues.join(", ")}`);
    fail += 1;
  } else {
    console.log(`OK /${slug} chars=${chars} faq=${page.faqs.length} links=${links}`);
  }
}

if (fail) process.exit(1);
console.log("\nOK — no thin real-estate create-new pages");
