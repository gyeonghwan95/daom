/**
 * 부산 등기 클러스터 intent / metadata / duplication checks.
 * Usage: npx --yes tsx scripts/check-busan-registry-hub.ts
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { resolveKoreanLandingPageData } from "@/lib/pageData/resolvers";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { registryHubTopic } from "@/lib/local-landing/registry-hub-content";

const ROOT = process.cwd();

const CLUSTER_SLUGS = [
  "부산등기법무사",
  "부산등기법무사추천",
  "부산부동산등기",
  "부산상속등기",
  "부산법인등기",
  "부산소유권이전등기",
  "등기소근처법무사",
  "부산지방법원등기국",
  "남부산등기소법무사",
  "부산진등기소법무사",
  "북부산등기소법무사",
  "부산근저당설정등기",
  "부산근저당말소등기",
  "부산신축건물보존등기",
  "부산부동산등기법무사",
  "부산임원변경등기",
] as const;

const INTENT_MAP: Array<{ query: string; slug: string }> = [
  { query: "부산 등기 법무사", slug: "부산등기법무사" },
  { query: "부산 등기 법무사 추천", slug: "부산등기법무사추천" },
  { query: "부산 부동산등기", slug: "부산부동산등기" },
  { query: "부산 상속등기", slug: "부산상속등기" },
  { query: "부산 법인등기", slug: "부산법인등기" },
  { query: "부산 소유권이전등기", slug: "부산소유권이전등기" },
  { query: "등기소 근처 법무사", slug: "등기소근처법무사" },
  { query: "부산지방법원 등기국", slug: "부산지방법원등기국" },
];

type Issue = { level: "error" | "warn"; message: string };

const issues: Issue[] = [];

function add(level: Issue["level"], message: string) {
  issues.push({ level, message });
}

function collectSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "out") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collectSourceFiles(full, acc);
    else if (/\.(ts|tsx|mdx|js|mjs)$/.test(name)) acc.push(full);
  }
  return acc;
}

function main() {
  console.log("=== Busan registry hub check ===");

  const hub = resolveKoreanLandingPageData("부산등기법무사");
  if (!hub) {
    add("error", "/부산등기법무사 page data missing");
  } else {
    const canonical = getCanonicalUrl(hub.path);
    if (hub.path !== "/부산등기법무사") {
      add("error", `hub path changed: ${hub.path}`);
    }
    if (!canonical.endsWith("/%EB%B6%80%EC%82%B0%EB%93%B1%EA%B8%B0%EB%B2%95%EB%AC%B4%EC%82%AC")) {
      add("warn", `canonical encoding check: ${canonical}`);
    }
    if (hub.metaTitle !== registryHubTopic.metaTitle) {
      add("error", `hub metaTitle mismatch: ${hub.metaTitle}`);
    }
    if (hub.metaDescription !== registryHubTopic.metaDescription) {
      add("error", `hub metaDescription mismatch`);
    }
    if (hub.h1 !== registryHubTopic.h1) {
      add("error", `hub H1 mismatch: ${hub.h1}`);
    }
    const h1Hits = [hub.h1, hub.title].filter(Boolean);
    if (h1Hits.length < 1) add("error", "hub missing H1");
    if (!hub.includeFaqSchema) add("error", "hub includeFaqSchema should be true");
    if (hub.faqs.length < 3 || hub.faqs.length > 8) {
      add("warn", `hub FAQ count ${hub.faqs.length} (expect 3–6 visible)`);
    }
    const jsonLd = buildJsonLdForPageData(hub);
    if (!Array.isArray(jsonLd) || jsonLd.length === 0) {
      add("error", "hub JSON-LD empty");
    }
    const types = jsonLd.map((s) => String((s as { "@type"?: string })["@type"] ?? ""));
    if (!types.includes("FAQPage")) add("error", "hub JSON-LD missing FAQPage");
    const blob = JSON.stringify(hub);
    if (blob.includes("부산 부산") || blob.includes("해운대 해운대")) {
      add("error", "hub page data contains duplicated region name");
    }
    const hrefs = hub.internalLinks.map((l) => l.href);
    for (const required of [
      "/부산부동산등기",
      "/부산상속등기",
      "/부산법인등기",
      "/부산소유권이전등기",
    ]) {
      if (!hrefs.includes(required) && !blob.includes(required)) {
        add("warn", `hub related links missing ${required} in PageData (custom view may still include)`);
      }
    }
    console.log("HUB");
    console.log(`  path: ${hub.path}`);
    console.log(`  canonical: ${canonical}`);
    console.log(`  title: ${hub.metaTitle}`);
    console.log(`  h1: ${hub.h1}`);
    console.log(`  description: ${hub.metaDescription.slice(0, 80)}…`);
    console.log(`  faqs: ${hub.faqs.length}`);
    console.log(`  jsonLd types: ${types.join(", ")}`);
  }

  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const h1s = new Map<string, string>();

  console.log("\nCLUSTER");
  for (const slug of CLUSTER_SLUGS) {
    const page = resolveKoreanLandingPageData(slug);
    if (!page) {
      add("error", `missing page data: /${slug}`);
      continue;
    }
    const text = [
      page.metaTitle,
      page.metaDescription,
      page.h1,
      page.intro,
      ...page.introParagraphs,
      ...page.sections.map((s) => `${s.title} ${s.body}`),
    ].join("\n");
    if (text.includes("부산 부산") || text.includes("해운대 해운대")) {
      add("error", `/${slug} contains duplicated region name`);
    }
    if (titles.has(page.metaTitle)) {
      add("error", `duplicate title ${titles.get(page.metaTitle)} ↔ /${slug}`);
    } else titles.set(page.metaTitle, `/${slug}`);
    if (descriptions.has(page.metaDescription)) {
      add("error", `duplicate description ${descriptions.get(page.metaDescription)} ↔ /${slug}`);
    } else descriptions.set(page.metaDescription, `/${slug}`);
    if (h1s.has(page.h1)) {
      add("error", `duplicate H1 ${h1s.get(page.h1)} ↔ /${slug}`);
    } else h1s.set(page.h1, `/${slug}`);

    const looksLikeServiceHub =
      /부동산·상속·법인/.test(`${page.metaTitle} ${page.h1}`) ||
      /등기업무 대표/.test(page.h1);
    if (slug !== "부산등기법무사" && looksLikeServiceHub && slug === "등기소근처법무사") {
      add("error", `/${slug} still looks like the registration service hub`);
    }
    if (slug === "등기소근처법무사") {
      const hasHubLink =
        page.internalLinks.some((l) => l.href === "/부산등기법무사") ||
        page.sections.some((s) => s.links?.some((l) => l.href === "/부산등기법무사"));
      if (!hasHubLink) add("error", "등기소근처법무사 missing hub link");
      if (page.h1.includes("부산 등기 법무사") && !page.h1.includes("근처")) {
        add("error", "등기소근처법무사 H1 still targets 부산 등기 법무사");
      }
    }
    if (slug === "부산등기법무사추천") {
      const hasHubLink = page.internalLinks.some((l) => l.href === "/부산등기법무사");
      if (!hasHubLink) add("warn", "추천 페이지 PageData missing hub link (view may still link)");
    }
    console.log(
      `  /${slug} | ${page.metaTitle.slice(0, 42)} | H1:${page.h1.slice(0, 28)}`,
    );
  }

  console.log("\nINTENT MAP");
  for (const row of INTENT_MAP) {
    const page = resolveKoreanLandingPageData(row.slug);
    const ok = Boolean(page);
    console.log(`  ${row.query} → /${row.slug} ${ok ? "OK" : "MISSING"}`);
    if (!ok) add("error", `intent map missing /${row.slug}`);
  }

  const clusterDirs = [
    join(ROOT, "src/lib/local-landing"),
    join(ROOT, "src/lib/seo-landing"),
    join(ROOT, "src/components/local-landing"),
  ];
  const dupPatterns = [
    /부산 부산/g,
    /해운대 해운대/g,
    /센텀 센텀/g,
  ];
  for (const dir of clusterDirs) {
    if (!existsSync(dir)) continue;
    for (const file of collectSourceFiles(dir)) {
      const src = readFileSync(file, "utf8");
      for (const pattern of dupPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(src)) {
          add("error", `duplicated region string in ${file.replace(ROOT, "")}`);
        }
      }
    }
  }

  const sitemapCandidates = [
    join(ROOT, "public/sitemap.xml"),
    join(ROOT, "public/sitemaps/sitemap.xml"),
  ];
  let sitemapHit = false;
  for (const file of sitemapCandidates) {
    if (!existsSync(file)) continue;
    const xml = readFileSync(file, "utf8");
    if (xml.includes("부산등기법무사") || xml.includes("%EB%B6%80%EC%82%B0%EB%93%B1%EA%B8%B0%EB%B2%95%EB%AC%B4%EC%82%AC")) {
      sitemapHit = true;
    }
  }
  if (!sitemapHit) {
    add("warn", "could not confirm /부산등기법무사 in public sitemap files (generated at prebuild)");
  }

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  console.log("\n=== Result ===");
  console.log(`errors: ${errors.length}, warnings: ${warns.length}`);
  for (const issue of issues) console.log(`[${issue.level}] ${issue.message}`);
  if (errors.length) process.exitCode = 1;
}

main();
