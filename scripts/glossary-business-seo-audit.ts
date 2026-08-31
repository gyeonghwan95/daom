/**
 * Glossary business-intent SEO audit.
 * Internal QA — not a Naver algorithm score.
 * Search Advisor: UNKNOWN unless seo/naver-searchadvisor.csv exists.
 */
import fs from "node:fs";
import path from "node:path";
import {
  assertGlossaryPolicyComplete,
  buildGlossaryHubPageData,
  buildGlossaryTermPageData,
  finalBusinessSeoScore,
  getAllGlossaryTerms,
  getGlossaryGuide,
  getGlossaryPolicy,
  glossaryCanonicalToOwner,
  glossaryNoIndexPaths,
  GLOSSARY_HUB_POLICY,
} from "../src/lib/glossary";
import { isNoIndexPath, getCanonicalOverridePath } from "../src/lib/seo/index-policy";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";

const ROOT = process.cwd();
const TEMPLATE_PHRASES = [
  "실무에서는 관할 기관·사건 경과·당사자 수에 따라",
  "구체적 사실관계(금액·날짜·당사자·서류)를",
  "관련 당사자와 일정·서류·비용을",
  "기한·절차 순서·비용을 한 번에",
  "절차 완료 후에도 세금·등기·분쟁 예방을",
  "전국 어디서나 바로 상담",
  "뜻과 절차｜부산 법무사가 쉽게 설명",
  "은(는)",
  "과(와)",
  "이(가)",
];

const ARTIFACTS = /과\(와\)|은\(는\)|이\(가\)|undefined|null|TODO|○○/;

type LinkRow = { path: string; incoming: number; outgoing: number };

function csvEscape(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(file: string, headers: string[], rows: Array<Array<string | number>>) {
  const body = [
    headers.join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, file), `${body}\n`, "utf8");
}

function loadIncoming(): Map<string, LinkRow> {
  const map = new Map<string, LinkRow>();
  const file = path.join(ROOT, "seo/baseline/internal-links.csv");
  if (!fs.existsSync(file)) return map;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).slice(1);
  for (const line of lines) {
    if (!line.startsWith("/glossary")) continue;
    const [p, inc, out] = line.split(",");
    if (!p) continue;
    map.set(p, {
      path: p,
      incoming: Number(inc) || 0,
      outgoing: Number(out) || 0,
    });
  }
  return map;
}

function loadSearchAdvisor(): Map<string, { impressions: string; clicks: string; ctr: string }> {
  const map = new Map<string, { impressions: string; clicks: string; ctr: string }>();
  const candidates = [
    "seo/naver-searchadvisor.csv",
    "seo/naver-searchadvisor.json",
    "data/seo/naver-searchadvisor.csv",
  ];
  for (const rel of candidates) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) continue;
    // File exists but this project has no verified Search Advisor export for glossary.
  }
  return map;
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2),
  );
}

function jaccard(a: string, b: string): number {
  const sa = tokenize(a);
  const sb = tokenize(b);
  let inter = 0;
  for (const token of sa) if (sb.has(token)) inter += 1;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function bodyOfPage(page: {
  h1: string;
  intro: string;
  introParagraphs: string[];
  metaTitle: string;
  metaDescription: string;
  sections: { title: string; body: string; items?: string[] }[];
}): string {
  return [
    page.metaTitle,
    page.h1,
    page.intro,
    ...page.introParagraphs,
    page.metaDescription,
    ...page.sections.flatMap((s) => [s.title, s.body, ...(s.items ?? [])]),
  ].join("\n");
}

function main() {
  assertGlossaryPolicyComplete();
  const errors: string[] = [];
  const warnings: string[] = [];
  const terms = getAllGlossaryTerms();
  const incoming = loadIncoming();
  loadSearchAdvisor();

  const hub = buildGlossaryHubPageData();
  if (GLOSSARY_HUB_POLICY.forbiddenQueries.some((q) => hub.metaTitle.includes(q) || hub.h1.includes(q))) {
    errors.push("HUB title/H1 contains forbidden CORE/LOCAL query");
  }
  if (hub.h1.includes("상속·등기·법인·회생 업무를 준비")) {
    errors.push("HUB H1 still looks like a service-cluster page");
  }
  if (hub.internalLinks.some((link) => link.label === "부산 법무사" || link.href === "/")) {
    errors.push("HUB should not use CORE query 부산 법무사 as a related-link dump");
  }

  const inventoryRows: Array<Array<string | number>> = [];
  const ownerRows: Array<Array<string | number>> = [];
  const pruneRows: Array<Array<string | number>> = [];
  const titles = new Map<string, string[]>();
  const descriptions = new Map<string, string[]>();
  const distinctive = new Map<string, string>();

  for (const term of terms) {
    const policy = getGlossaryPolicy(term.slug);
    const guide = getGlossaryGuide(term.slug);
    const page = buildGlossaryTermPageData(term.slug);
    if (!policy || !guide || !page) {
      errors.push(`missing policy/guide/page: ${term.slug}`);
      continue;
    }

    const url = term.path;
    const indexable = isIndexablePagePath(url) && !isNoIndexPath(url);
    const expectedNoindex =
      policy.action === "SUPPORT_NOINDEX" ||
      policy.action === "REMOVE_FROM_DISCOVERY" ||
      policy.action === "MERGE_REDIRECT_CANDIDATE";
    if (expectedNoindex && indexable) {
      errors.push(`${url} should be noindex but is indexable`);
    }
    if (!expectedNoindex && policy.action !== "KEEP_INDEX" && policy.action !== "UPGRADE_INDEX") {
      errors.push(`${url} action ${policy.action} not handled`);
    }

    const haystack = bodyOfPage(page);
    for (const phrase of TEMPLATE_PHRASES) {
      if (haystack.includes(phrase)) errors.push(`${url} template phrase: ${phrase}`);
    }
    if (ARTIFACTS.test(haystack)) errors.push(`${url} template artifact`);
    for (const forbidden of policy.forbiddenQueries) {
      if (page.metaTitle.includes(forbidden) || page.h1.includes(forbidden)) {
        errors.push(`${url} title/H1 uses forbidden query "${forbidden}"`);
      }
    }
    if (page.metaTitle.includes("뜻과 절차") || page.h1.endsWith("뜻과 절차")) {
      errors.push(`${url} still uses dictionary title`);
    }
    if (page.metaTitle.includes("부산 법무사가 쉽게")) {
      errors.push(`${url} stuffed 부산 법무사 in title`);
    }
    if (!page.metaTitle.includes("용어 확인")) {
      errors.push(`${url} title should stay a glossary label (용어 확인), not a service title`);
    }
    if (page.h1 !== term.term) {
      errors.push(`${url} H1 should be the term only to avoid competing with service H1`);
    }
    if (glossaryCanonicalToOwner(term.slug)) {
      const canonical = getCanonicalOverridePath(url);
      if (canonical !== policy.serviceOwner) {
        errors.push(`${url} canonical should be ${policy.serviceOwner}, got ${canonical}`);
      }
    } else if (getCanonicalOverridePath(url)) {
      errors.push(`${url} should not canonical to another URL`);
    }
    if (page.sections.some((section) => section.title === "상담 시 확인하는 내용")) {
      errors.push(`${url} generic min-content pad competes with service pages`);
    }
    if (page.procedures.some((item) => item.includes("현재 상황과 목표를 전화"))) {
      errors.push(`${url} default procedure template`);
    }
    if (page.faqs.some((faq) => faq.question.includes("상담은 어디서 받을 수 있나요"))) {
      errors.push(`${url} default FAQ pad`);
    }
    if (
      page.internalLinks.some(
        (link) => link.label === "부산 법무사" || link.href === "/부산법무사",
      )
    ) {
      errors.push(`${url} should not inherit 부산법무사 hub spokes`);
    }

    distinctive.set(
      term.slug,
      [
        term.term,
        term.oneLineDefinition,
        guide.answerLead,
        ...guide.stuckPoints.slice(0, 3),
        guide.scrivenerScope,
        guide.outOfScope ?? "",
      ].join("\n"),
    );

    const keepOrUpgrade =
      policy.action === "KEEP_INDEX" || policy.action === "UPGRADE_INDEX";
    if (keepOrUpgrade) {
      if (policy.businessIntent < 60 || policy.serviceFit < 60) {
        errors.push(`${url} GATE fail: BI/SF below 60 for ${policy.action}`);
      }
      if (policy.ownerUniqueness < 40) {
        errors.push(`${url} GATE fail: cannibalization CRITICAL for ${policy.action}`);
      }
    }

    const titleList = titles.get(page.metaTitle) ?? [];
    titleList.push(url);
    titles.set(page.metaTitle, titleList);
    const descList = descriptions.get(page.metaDescription) ?? [];
    descList.push(url);
    descriptions.set(page.metaDescription, descList);

    const links = incoming.get(url);
    const score = finalBusinessSeoScore(policy);
    inventoryRows.push([
      term.term,
      url,
      term.category,
      page.metaTitle,
      page.h1,
      indexable ? "true" : "false",
      getCanonicalOverridePath(url) ?? url,
      indexable ? "true" : "false",
      bodyOfPage(page).length,
      policy.primaryQuery,
      links?.incoming ?? "",
      links?.outgoing ?? "",
      policy.serviceOwner,
      "UNKNOWN",
      "UNKNOWN",
      "UNKNOWN",
      policy.businessIntent,
      policy.serviceFit,
      100 - policy.ownerUniqueness,
      policy.action,
      `owner=${policy.serviceOwner}; final=${score}; Search Advisor UNKNOWN`,
    ]);

    ownerRows.push([
      term.term,
      url,
      policy.primaryQuery,
      policy.allowedSecondary.join(" | "),
      policy.forbiddenQueries.join(" | "),
      policy.serviceOwner,
      policy.action,
    ]);

    pruneRows.push([
      term.term,
      url,
      policy.businessIntent,
      policy.serviceFit,
      policy.serviceOwner,
      "UNKNOWN",
      policy.ownerUniqueness < 40 ? "CRITICAL" : policy.ownerUniqueness < 60 ? "HIGH" : "LOW",
      policy.action,
      policy.primaryQuery,
      policy.serviceOwner,
      policy.action === "REMOVE_FROM_DISCOVERY"
        ? "definition/out-of-scope or fee-only; keep URL, hide from hub discovery"
        : "strong service owner exists; glossary is support noindex",
    ]);
  }

  for (const [title, urls] of titles) {
    if (urls.length > 1) errors.push(`duplicate title: ${title} → ${urls.join(" ")}`);
  }
  for (const [desc, urls] of descriptions) {
    if (urls.length > 1) errors.push(`duplicate description: ${desc.slice(0, 40)} → ${urls.join(" ")}`);
  }

  const similarityRows: Array<Array<string | number>> = [];
  let highSim = 0;
  const slugs = terms.map((t) => t.slug);
  for (let i = 0; i < slugs.length; i += 1) {
    for (let j = i + 1; j < slugs.length; j += 1) {
      const sim = jaccard(distinctive.get(slugs[i]) ?? "", distinctive.get(slugs[j]) ?? "");
      const risk = sim >= 0.55 ? "HIGH" : sim >= 0.4 ? "MEDIUM" : "LOW";
      if (sim >= 0.4) {
        similarityRows.push([slugs[i], slugs[j], sim.toFixed(3), sim.toFixed(3), risk]);
      }
      if (sim >= 0.55) {
        highSim += 1;
        errors.push(`HIGH similarity ${slugs[i]} ↔ ${slugs[j]} (${sim.toFixed(3)})`);
      }
    }
  }

  const noindexFromPolicy = new Set(glossaryNoIndexPaths());
  for (const p of noindexFromPolicy) {
    if (!isNoIndexPath(p)) errors.push(`index-policy missing ${p}`);
  }

  if (getCanonicalOverridePath("/glossary/director-change-registration") !== "/부산임원변경등기") {
    errors.push("director-change-registration canonical must be /부산임원변경등기");
  }
  if (getCanonicalOverridePath("/glossary/inheritance-registration") !== "/부산상속등기") {
    errors.push("inheritance-registration canonical must be /부산상속등기");
  }
  if (getCanonicalOverridePath("/glossary/mortgage")) {
    errors.push("mortgage must not canonical (설정 vs 말소 split)");
  }
  if (getCanonicalOverridePath("/glossary/pledge")) {
    errors.push("pledge must not canonical (weak/split owner)");
  }
  if (getCanonicalOverridePath("/glossary/stamp-duty")) {
    errors.push("stamp-duty must not canonical");
  }

  writeCsv(
    "seo/glossary-inventory.csv",
    [
      "term",
      "url",
      "category",
      "title",
      "h1",
      "indexable",
      "canonical",
      "sitemap",
      "word_count",
      "current_primary_query",
      "incoming_links",
      "outgoing_links",
      "existing_service_owner",
      "searchadvisor_impressions",
      "searchadvisor_clicks",
      "searchadvisor_ctr",
      "business_intent_score",
      "service_fit_score",
      "seo_collision_score",
      "recommended_action",
      "reason",
    ],
    inventoryRows,
  );

  writeCsv(
    "seo/glossary-keyword-owner-map.csv",
    [
      "term",
      "glossary_url",
      "primary_query",
      "allowed_secondary_query",
      "forbidden_query",
      "service_owner",
      "glossary_role",
    ],
    ownerRows,
  );

  writeCsv(
    "seo/glossary-pruning-plan.csv",
    [
      "term",
      "url",
      "business_intent",
      "service_fit",
      "existing_owner",
      "current_performance",
      "cannibalization_risk",
      "recommended_action",
      "new_primary_intent",
      "service_destination",
      "reason",
    ],
    pruneRows,
  );

  writeCsv(
    "seo/glossary-similarity.csv",
    ["page_a", "page_b", "similarity", "template_similarity", "risk"],
    similarityRows.length
      ? similarityRows
      : [["(none)", "(none)", "0", "0", "LOW"]],
  );

  const indexableTerms = terms.filter((t) => {
    const p = getGlossaryPolicy(t.slug);
    return p?.action === "KEEP_INDEX" || p?.action === "UPGRADE_INDEX";
  });
  const noindexTerms = terms.filter((t) => {
    const p = getGlossaryPolicy(t.slug);
    return p?.action === "SUPPORT_NOINDEX" || p?.action === "REMOVE_FROM_DISCOVERY";
  });

  console.log("=== Glossary business SEO audit ===");
  console.log(`total terms: ${terms.length}`);
  console.log(`hub indexable: ${isIndexablePagePath("/glossary")}`);
  console.log(`KEEP/UPGRADE (index): ${indexableTerms.length}`);
  console.log(`SUPPORT_NOINDEX+REMOVE: ${noindexTerms.length}`);
  console.log(`HIGH similarity pairs: ${highSim}`);
  console.log(`Search Advisor: UNKNOWN`);

  if (errors.length) {
    for (const error of errors) console.error(`[fail] ${error}`);
    process.exit(1);
  }
  if (warnings.length) {
    for (const warning of warnings) console.warn(`[warn] ${warning}`);
  }
  console.log("OK — glossary business SEO audit passed.");
}

main();
