/**
 * 부동산등기 신규 페이지 FAQ·문장 유사도(간단 n-gram) 검사
 * 실행: npx tsx scripts/check-content-similarity.ts
 */
import { getAllSearchIntentContents } from "../src/lib/local-landing/search-intent";
import { getRealEstateCreateNewIntents } from "../src/data/seo/real-estate-search-intents";

const checkedSlugs = new Set(
  getRealEstateCreateNewIntents().map((intent) =>
    intent.targetUrl.replace(/^\//, ""),
  ),
);

const pages = getAllSearchIntentContents().filter((p) =>
  checkedSlugs.has(p.slug),
);

function normalize(s: string) {
  return s.replace(/\s+/g, "").replace(/[·,.]/g, "");
}

function trigrams(s: string): Set<string> {
  const t = normalize(s);
  const set = new Set<string>();
  for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3));
  return set;
}

function jaccard(a: Set<string>, b: Set<string>) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

const faqSeen = new Map<string, string>();
let warn = 0;

for (const page of pages) {
  for (const faq of page.faqs) {
    const key = normalize(faq.question);
    if (faqSeen.has(key)) {
      console.warn(
        `FAQ question repeat: "${faq.question}" (${faqSeen.get(key)} & ${page.slug})`,
      );
      warn += 1;
    } else {
      faqSeen.set(key, page.slug);
    }
  }
}

console.log("\n=== body similarity (trigram jaccard > 0.55) ===");
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const a = pages[i];
    const b = pages[j];
    // Ignore shared landing boilerplate and compare the situation-specific body.
    const textA = [
      ...a.searchIntents,
      ...a.documents,
      ...a.commonMistakes,
      ...a.faqs.map((faq) => faq.answer),
    ].join(" ");
    const textB = [
      ...b.searchIntents,
      ...b.documents,
      ...b.commonMistakes,
      ...b.faqs.map((faq) => faq.answer),
    ].join(" ");
    const score = jaccard(trigrams(textA), trigrams(textB));
    if (score > 0.55) {
      console.warn(
        `HIGH similarity ${score.toFixed(2)}: ${a.slug} ↔ ${b.slug}`,
      );
      warn += 1;
    }
  }
}

console.log(
  `\nDone — ${pages.length} real-estate create-new pages, warnings ${warn} (exit 0; review warnings)`,
);
