/**
 * 내부링크 href가 실제 공개 경로인지 검사.
 * Usage: npx --yes tsx scripts/check-links.ts
 */
import { getAllPageData } from "../src/lib/pageData/registry";

const known = new Set<string>(["/", "/contact", "/contact/inquiry", "/search"]);

for (const page of getAllPageData()) {
  known.add(page.path);
}

function normalizeHref(href: string): string {
  const pathOnly = href.split("#")[0]?.split("?")[0] ?? href;
  if (!pathOnly || pathOnly === "/") return "/";
  return pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
}

function main() {
  const missing: string[] = [];
  let checked = 0;

  for (const page of getAllPageData()) {
    const links = [...page.internalLinks, ...page.relatedLinks];
    for (const link of links) {
      if (!link.href.startsWith("/")) continue;
      const href = normalizeHref(link.href);
      checked += 1;
      if (known.has(href)) continue;
      missing.push(`${page.path} → ${href} (${link.label})`);
    }
  }

  console.log("=== Internal links ===");
  console.log(`checked: ${checked}`);
  console.log(`known paths: ${known.size}`);

  const unique = [...new Set(missing)];
  if (unique.length > 0) {
    for (const row of unique.slice(0, 40)) console.error(`[missing] ${row}`);
    if (unique.length > 40) {
      console.error(`… ${unique.length - 40} more`);
    }
    console.error(`[fail] broken internal links: ${unique.length}`);
    process.exit(1);
  }
  console.log("OK — no missing internal hrefs in pageData links.");
}

main();
