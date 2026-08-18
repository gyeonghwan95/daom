/**
 * 「부산 법무사」 champion / homepage cannibalization checks.
 * Usage: npx --yes tsx scripts/check-busan-lawyer-hub.ts
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { HOME_METADATA_TITLE, getCanonicalUrl, homeMetadata, createPageMetadata } from "@/lib/seo/metadata";
import { resolveKoreanLandingPageData } from "@/lib/pageData/resolvers";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { buildHomePageData } from "@/lib/pageData/builders";
import {
  busanLawyerHubDescription,
  busanLawyerHubH1,
  busanLawyerHubMetaTitle,
} from "@/lib/local-landing/busan-lawyer-hub-content";
import { getInflowItemsForPath } from "@/lib/seo/inflow-policy";
import { sanitizePageKeywords } from "@/lib/seo/champion-query";

const ROOT = process.cwd();

const CLUSTER_SLUGS = [
  "부산법무사",
  "부산법무사추천",
  "부산법무사비교",
  "부산법무사상담",
  "부산법무사비용",
  "부산법무사무소",
  "부산등기법무사",
  "해운대법무사",
  "센텀법무사",
] as const;

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
  console.log("=== Busan lawyer hub check ===");

  const hub = resolveKoreanLandingPageData("부산법무사");
  if (!hub) {
    add("error", "/부산법무사 page data missing");
  } else {
    const canonical = getCanonicalUrl(hub.path);
    if (hub.path !== "/부산법무사") add("error", `hub path changed: ${hub.path}`);
    if (hub.metaTitle !== busanLawyerHubMetaTitle) {
      add("error", `hub metaTitle mismatch: ${hub.metaTitle}`);
    }
    if (hub.metaDescription !== busanLawyerHubDescription) {
      add("error", `hub metaDescription mismatch: ${hub.metaDescription}`);
    }
    if (hub.h1 !== busanLawyerHubH1) {
      add("error", `hub H1 mismatch: ${hub.h1}`);
    }
    if (!hub.includeFaqSchema) add("error", "hub includeFaqSchema should be true");
    if (hub.faqs.length < 6) {
      add("error", `hub FAQ count ${hub.faqs.length} (full hub FAQs should not be sliced to 3)`);
    }
    const jsonLd = buildJsonLdForPageData(hub);
    const types = jsonLd.map((s) => String((s as { "@type"?: string })["@type"] ?? ""));
    if (!types.includes("FAQPage")) add("error", "hub JSON-LD missing FAQPage");
    if (!types.includes("Service")) add("error", "hub JSON-LD missing Service");
    if (types.includes("LegalService")) {
      add("error", "page JSON-LD repeats global LegalService");
    }
    const blob = JSON.stringify(hub);
    if (blob.includes("부산 부산") || blob.includes("해운대 해운대")) {
      add("error", "hub page data contains duplicated region name");
    }
    if (hub.metaTitle === HOME_METADATA_TITLE) {
      add("error", "hub title duplicates homepage title");
    }
    if (hub.metaDescription === buildHomePageData().metaDescription) {
      add("error", "hub description duplicates homepage description");
    }
    if (getInflowItemsForPath("/업무사례/부산영주동법무사").length > 0) {
      add("error", "inflow rail still emits on thin case pages");
    }
    if (getInflowItemsForPath("/부산법무사").length === 0) {
      add("error", "inflow rail missing on champion hub");
    }
    const dongKeywords = sanitizePageKeywords("/민락동법무사", [
      "부산 법무사",
      "민락동 법무사",
    ]);
    if (dongKeywords?.includes("부산 법무사")) {
      add("error", "exact champion query still in non-champion keywords");
    }
    const hubKw = createPageMetadata({
      title: busanLawyerHubMetaTitle,
      description: busanLawyerHubDescription,
      path: "/부산법무사",
      keywords: ["부산 법무사", "해운대 법무사"],
    }).keywords;
    const hubKwList = Array.isArray(hubKw) ? hubKw : [];
    if (!hubKwList.includes("부산 법무사")) {
      add("error", "champion lost exact-query keywords");
    }
    console.log("HUB");
    console.log(`  path: ${hub.path}`);
    console.log(`  canonical: ${canonical}`);
    console.log(`  title: ${hub.metaTitle}`);
    console.log(`  h1: ${hub.h1}`);
    console.log(`  description (${hub.metaDescription.length}자): ${hub.metaDescription}`);
    console.log(`  faqs: ${hub.faqs.length}`);
    console.log(`  jsonLd types: ${types.join(", ")}`);
  }

  const home = buildHomePageData();
  console.log("\nHOME");
  console.log(`  title: ${home.metaTitle}`);
  console.log(`  h1: ${home.h1}`);
  if (/^부산법무사\s*\|/.test(home.metaTitle) || home.metaTitle.startsWith("부산 법무사 |")) {
    add("error", "homepage title still exact-matches 「부산 법무사」 champion query");
  }
  if (home.metaTitle === busanLawyerHubMetaTitle) {
    add("error", "homepage title equals champion title");
  }
  const homeKeywords = Array.isArray(homeMetadata.keywords)
    ? homeMetadata.keywords
    : [];
  if (
    homeKeywords.includes("부산법무사") ||
    homeKeywords.includes("부산 법무사")
  ) {
    add("error", "homepage meta keywords still exact-match 「부산 법무사」");
  }

  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const h1s = new Map<string, string>();
  titles.set(home.metaTitle, "/");
  descriptions.set(home.metaDescription, "/");
  h1s.set(home.h1, "/");

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

    if (slug === "부산법무사무소") {
      if (
        /^부산 법무사(\s|\||｜)/.test(page.metaTitle) ||
        page.metaTitle.startsWith("부산 법무사 사무실")
      ) {
        add(
          "error",
          "office page title still prefixes champion query 「부산 법무사」",
        );
      }
    }
    if (slug === "부산법무사추천") {
      if (!page.h1.includes("선택") && !page.h1.includes("추천")) {
        add("error", "추천 페이지 H1 lost selection intent");
      }
      const hasHubLink = page.internalLinks.some((l) => l.href === "/부산법무사");
      if (!hasHubLink) add("warn", "추천 페이지 PageData missing /부산법무사 link");
    }
    console.log(
      `  /${slug} | ${page.metaTitle.slice(0, 44)} | H1:${page.h1.slice(0, 28)}`,
    );
  }

  const clusterDirs = [
    join(ROOT, "src/lib/local-landing"),
    join(ROOT, "src/components/local-landing"),
  ];
  for (const dir of clusterDirs) {
    if (!existsSync(dir)) continue;
    for (const file of collectSourceFiles(dir)) {
      if (!file.includes("busan-lawyer") && !file.includes("flagship-busan")) continue;
      const src = readFileSync(file, "utf8");
      if (/부산 부산/.test(src) || /해운대 해운대/.test(src)) {
        add("error", `duplicated region string in ${file.replace(ROOT, "")}`);
      }
    }
  }

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  console.log("\n=== Result ===");
  console.log(`errors: ${errors.length}, warnings: ${warns.length}`);
  for (const issue of issues) console.log(`[${issue.level}] ${issue.message}`);
  if (errors.length) process.exitCode = 1;
}

main();
