#!/usr/bin/env node
/**
 * Full search-intent inventory (non-destructive).
 * Usage: node scripts/build-full-intent-inventory.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "scripts", "output", "seo-pages-manifest.json");
const PROTECTED = path.join(ROOT, "config", "seo-protected-assets.json");
const OUT_JSON = path.join(ROOT, "reports", "seo", "full-intent-inventory.json");
const OUT_MD = path.join(ROOT, "docs", "seo", "FULL_SEARCH_INTENT_MAP.md");

function hasLawyerWord(p) {
  return /법무사/.test(`${p.path || ""} ${p.metaTitle || ""} ${p.h1 || ""}`);
}

function inferAudience(p) {
  const s = `${p.path} ${p.metaTitle || ""} ${p.h1 || ""}`;
  if (/기업|법인|임원|본점|설립|해산|청산/.test(s)) return "business";
  if (/상속|사망|포기|한정|유류분|대습/.test(s)) return "family";
  if (/전세|임차|보증금/.test(s)) return "tenant-landlord";
  if (/회생|파산/.test(s)) return "debtor";
  if (/강의|교육|특강/.test(s)) return "institution";
  if (/복대리|집단등기|협업/.test(s)) return "b2b-peer";
  return "general";
}

function inferUrgency(p) {
  const s = `${p.path} ${p.metaTitle || ""} ${p.h1 || ""}`;
  if (/기한|과태료|3개월|말소|잔금|이의|보정|압류|가압류/.test(s))
    return "high";
  if (/비용|서류|준비|절차/.test(s)) return "medium";
  return "low";
}

function inferTransactional(p) {
  const s = `${p.path} ${p.metaTitle || ""} ${p.h1 || ""}`;
  if (/비용|신청|등기|포기|승인|말소|설립|변경|명령/.test(s)) return "high";
  if (/뜻|용어|glossary|소개|about/.test(s)) return "low";
  return "medium";
}

function inferService(p) {
  const s = `${p.path} ${p.metaTitle || ""} ${p.h1 || ""} ${p.category || ""}`;
  if (/상속|한정|포기|유류분|대습|사망/.test(s)) return "inheritance";
  if (/법인|설립|임원|본점|증자|해산|청산|정관/.test(s)) return "corporate";
  if (/근저당|전세|임차|매매|증여|경매|공매|소유권|입주|분양/.test(s))
    return "real-estate";
  if (/회생|파산/.test(s)) return "rehab";
  if (/지급명령|내용증명|가압류|가처분|공탁/.test(s)) return "civil";
  if (/강의|교육/.test(s)) return "education";
  return p.category || "other";
}

function inferPrimaryIntent(p) {
  if (p.path?.startsWith("/situations")) return "situation-router";
  if (p.path?.startsWith("/glossary")) return "definition";
  if (/비용|보수/.test(p.path || "")) return "cost";
  if (/자가진단|진단/.test(p.path || "")) return "diagnosis";
  if (hasLawyerWord(p) && /추천|잘하는/.test(`${p.metaTitle}${p.h1}`))
    return "provider-selection";
  return inferService(p);
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const protectedCfg = JSON.parse(fs.readFileSync(PROTECTED, "utf8"));
  const protectedUrls = new Set([
    ...(protectedCfg.pages || []).map((p) => p.url),
    ...(protectedCfg.assets || []).map((a) => a.path),
  ]);

  const pages = (manifest.pages || []).map((p) => ({
    url: p.path,
    title: p.metaTitle || null,
    h1: p.h1 || null,
    description: p.metaDescription || null,
    pageType: p.category || null,
    primaryIntent: inferPrimaryIntent(p),
    secondaryIntent: inferService(p),
    region: /부산|해운대|센텀|서면|연산|수영|동래|경남|전국/.test(p.path || "")
      ? "geo-tagged"
      : "general",
    serviceCategory: inferService(p),
    audience: inferAudience(p),
    urgency: inferUrgency(p),
    transactionalIntent: inferTransactional(p),
    mentionsLawyerWord: hasLawyerWord(p),
    problemOriented: !hasLawyerWord(p),
    faqCount: p.faqCount ?? null,
    majorH2: [],
    internalLinkCount: p.internalLinkCount ?? null,
    relatedLinks: p.relatedLinks || [],
    ctaTitle: p.ctaTitle || null,
    canonical: p.canonical || null,
    sitemap: p.sitemapUrl ?? true,
    indexability: "indexable-assumed",
    ogImage: null,
    protection: protectedUrls.has(p.path)
      ? "SEO_PROTECTED"
      : "UNKNOWN_PERFORMANCE",
  }));

  const withoutLawyer = pages.filter((p) => p.problemOriented);
  const byService = {};
  const byAudience = {};
  for (const page of pages) {
    byService[page.serviceCategory] =
      (byService[page.serviceCategory] || 0) + 1;
    byAudience[page.audience] = (byAudience[page.audience] || 0) + 1;
  }

  const inventory = {
    generatedAt: new Date().toISOString(),
    source: "scripts/output/seo-pages-manifest.json",
    total: pages.length,
    problemOrientedWithoutLawyerWord: withoutLawyer.length,
    lawyerWordInTitleOrPath: pages.length - withoutLawyer.length,
    byServiceCategory: byService,
    byAudience,
    pages,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(inventory, null, 2) + "\n", "utf8");

  const md = `# FULL SEARCH INTENT MAP

생성: ${inventory.generatedAt}  
출처: seo-pages-manifest (${inventory.total} pages)

## 요약

| Metric | Count |
|--------|------:|
| Total indexable (manifest) | ${inventory.total} |
| Title/path에 '법무사' 없음 (문제·업무형 후보) | ${inventory.problemOrientedWithoutLawyerWord} |
| '법무사' 포함 | ${inventory.lawyerWordInTitleOrPath} |
| SEO_PROTECTED | ${pages.filter((p) => p.protection === "SEO_PROTECTED").length} |

## 서비스 카테고리

| Category | Count |
|----------|------:|
${Object.entries(byService)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join("\n")}

## 오디언스

| Audience | Count |
|----------|------:|
${Object.entries(byAudience)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join("\n")}

## 해석

- 이미 상당수 URL이 직역명 없이 상황·서류·기한·비용 축으로 존재한다.
- 이번 확장의 핵심은 **신규 대량 생성이 아니라**, 법무사 없는 자연어 → 기존 Champion/상황 페이지 매핑 + **독립 Intent만 소량 추가**.
- 지역명만 바꾼 페이지는 만들지 않는다 (DOORWAY/THIN_LOCAL_RISK).

## 상세 JSON

\`reports/seo/full-intent-inventory.json\`

관련: \`docs/seo/LOCAL_AND_SITUATION_KEYWORD_GAP.md\`, \`src/data/seo/busan-local-intent-registry.ts\`
`;

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md, "utf8");
  console.log(
    JSON.stringify(
      {
        total: inventory.total,
        withoutLawyer: inventory.problemOrientedWithoutLawyerWord,
        out: OUT_JSON,
      },
      null,
      2,
    ),
  );
}

main();
