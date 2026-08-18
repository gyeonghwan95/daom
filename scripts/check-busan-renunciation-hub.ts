/**
 * 「부산 상속포기 법무사」 champion checks.
 * Usage: npx --yes tsx scripts/check-busan-renunciation-hub.ts
 */
import { HOME_METADATA_TITLE, createPageMetadata, getCanonicalUrl } from "@/lib/seo/metadata";
import { resolveKoreanLandingPageData } from "@/lib/pageData/resolvers";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { getInflowItemsForPath } from "@/lib/seo/inflow-policy";
import {
  isBusanRenunciationExactQuery,
  sanitizePageKeywords,
} from "@/lib/seo/champion-query";
import {
  busanRenunciationHubDescription,
  busanRenunciationHubH1,
  busanRenunciationHubMetaTitle,
} from "@/lib/local-landing/renunciation-hub-identity";

type Issue = { level: "error" | "warn"; message: string };

const issues: Issue[] = [];

function add(level: Issue["level"], message: string) {
  issues.push({ level, message });
}

function main() {
  console.log("=== Busan renunciation hub check ===");

  const hub = resolveKoreanLandingPageData("부산상속포기");
  if (!hub) {
    add("error", "/부산상속포기 page data missing");
  } else {
    const canonical = getCanonicalUrl(hub.path);
    if (hub.path !== "/부산상속포기") add("error", `hub path changed: ${hub.path}`);
    if (hub.metaTitle !== busanRenunciationHubMetaTitle) {
      add("error", `hub metaTitle mismatch: ${hub.metaTitle}`);
    }
    if (hub.metaDescription !== busanRenunciationHubDescription) {
      add("error", `hub metaDescription mismatch: ${hub.metaDescription}`);
    }
    if (hub.h1 !== busanRenunciationHubH1) {
      add("error", `hub H1 mismatch: ${hub.h1}`);
    }
    if (hub.metaDescription.length < 80 || hub.metaDescription.length > 120) {
      add("error", `hub description length ${hub.metaDescription.length} (want 80–120)`);
    }
    if (!hub.includeFaqSchema) add("error", "hub includeFaqSchema should be true");
    if (hub.faqs.length < 10) {
      add("error", `hub FAQ count ${hub.faqs.length} (should keep full FAQ set)`);
    }
    const jsonLd = buildJsonLdForPageData(hub);
    const types = jsonLd.map((s) => String((s as { "@type"?: string })["@type"] ?? ""));
    if (!types.includes("FAQPage")) add("error", "hub JSON-LD missing FAQPage");
    if (!types.includes("Service")) add("error", "hub JSON-LD missing Service");
    if (types.includes("LegalService")) {
      add("error", "page JSON-LD repeats global LegalService");
    }
    if (getInflowItemsForPath("/부산상속포기").length === 0) {
      add("error", "inflow rail missing on renunciation champion");
    }
    const hubKw = createPageMetadata({
      title: busanRenunciationHubMetaTitle,
      description: busanRenunciationHubDescription,
      path: "/부산상속포기",
      keywords: ["부산 상속포기 법무사", "부산 상속포기"],
    }).keywords;
    const hubKwList = Array.isArray(hubKw) ? hubKw : [];
    if (!hubKwList.includes("부산 상속포기 법무사")) {
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

  const otherKw = sanitizePageKeywords("/부산상속포기전문법무사", [
    "부산 상속포기 법무사",
    "부산 상속포기",
  ]);
  if (otherKw?.includes("부산 상속포기 법무사")) {
    add("error", "exact query still in specialist keywords");
  }
  if (!otherKw?.includes("부산 상속포기")) {
    add("error", "specialist lost own query 부산 상속포기");
  }
  if (!isBusanRenunciationExactQuery("부산상속포기법무사")) {
    add("error", "compact exact query not detected");
  }
  if (isBusanRenunciationExactQuery("부산 상속포기")) {
    add("error", "sanitizer false-positive on 부산 상속포기");
  }

  const inheritance = resolveKoreanLandingPageData("부산상속법무사");
  if (!inheritance) {
    add("error", "/부산상속법무사 missing");
  } else {
    if (!inheritance.metaTitle.startsWith("부산 상속 법무사")) {
      add("error", "inheritance champion title drifted");
    }
    if (inheritance.metaTitle === busanRenunciationHubMetaTitle) {
      add("error", "inheritance hub title equals renunciation title");
    }
    const rail = getInflowItemsForPath("/부산상속법무사");
    if (!rail.some((item) => item.href === "/부산상속포기")) {
      add("error", "inheritance hub rail missing mixed-anchor to /부산상속포기");
    }
  }

  const diagnosis = resolveKoreanLandingPageData("상속포기자가진단");
  if (!diagnosis) {
    add("error", "/상속포기자가진단 missing");
  } else if (diagnosis.metaTitle.includes("부산 상속포기 법무사")) {
    add("error", "diagnosis title still exact-matches champion query");
  }

  const homeTitle = HOME_METADATA_TITLE;
  if (homeTitle.includes("부산 상속포기 법무사")) {
    add("error", "homepage title contains renunciation exact query");
  }

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  console.log("\n=== Result ===");
  console.log(`errors: ${errors.length}, warnings: ${warns.length}`);
  for (const issue of issues) console.log(`[${issue.level}] ${issue.message}`);
  if (errors.length) process.exitCode = 1;
}

main();
