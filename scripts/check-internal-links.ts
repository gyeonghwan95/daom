/**
 * 검색의도 내부링크 href가 seo-paths(또는 신규 seed)에 있는지 검사
 * 실행: npx tsx scripts/check-internal-links.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllSearchIntentContents } from "../src/lib/local-landing/search-intent";
import { getRealEstateCreateNewIntents } from "../src/data/seo/real-estate-search-intents";

const seoPaths = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "scripts/output/seo-paths.json"),
    "utf8",
  ),
) as { paths: string[] };

const known = new Set(seoPaths.paths);
for (const intent of getRealEstateCreateNewIntents()) {
  known.add(intent.targetUrl);
}

const externalOk = new Set([
  "/contact",
  "/contact/inquiry",
  "/search-guides",
]);

let missing = 0;
for (const page of getAllSearchIntentContents()) {
  const links = [
    ...page.relatedServiceLinks,
    ...page.relatedGuideLinks,
    ...page.relatedCaseLinks,
  ];
  for (const link of links) {
    if (!link.href.startsWith("/")) continue;
    if (externalOk.has(link.href)) continue;
    if (known.has(link.href)) continue;
    // allow nested service/blog/faq/tools/glossary/situations paths present in sitemap
    if (known.has(link.href)) continue;
    console.error(`MISSING link from /${page.slug} → ${link.href}`);
    missing += 1;
  }
}

if (missing) {
  console.error(`\n${missing} missing internal links`);
  process.exit(1);
}
console.log("OK — search-intent internal links resolve");
