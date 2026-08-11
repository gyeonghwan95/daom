#!/usr/bin/env node
/**
 * Build content inventory from seo-pages-manifest (non-destructive).
 * Usage: node scripts/build-content-inventory.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "scripts", "output", "seo-pages-manifest.json");
const PROTECTED = path.join(ROOT, "config", "seo-protected-assets.json");
const OUT_JSON = path.join(ROOT, "reports", "seo", "content-inventory.json");
const OUT_MD = path.join(ROOT, "docs", "seo", "CURRENT_CONTENT_MAP.md");

function inferField(p) {
  const s = `${p.path} ${p.metaTitle || ""} ${p.h1 || ""} ${p.category || ""}`;
  if (/상속|한정|포기|유증|대습|유류분/.test(s)) return "inheritance";
  if (/법인|설립|임원|본점|증자|감자|해산|청산|정관/.test(s)) return "corporate";
  if (/부동산|매매|증여|근저당|전세|임차|보존|경매|공매|소유권/.test(s))
    return "real-estate";
  if (/회생|파산|면책|압류/.test(s) && /개인|회생|파산/.test(s)) return "rehab";
  if (/지급명령|내용증명|가압류|가처분|공탁|채권/.test(s)) return "civil";
  if (/강의|교육|협업|복대리|특강/.test(s)) return "education-b2b";
  if (/개명/.test(s)) return "name-change";
  return p.category || "other";
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
    description: p.metaDescription || null,
    h1: p.h1 || null,
    pageType: p.category || null,
    primaryIntent: inferField(p),
    primaryKeyword: (p.metaTitle || p.h1 || p.slug || "").split(/[｜|]/)[0].trim(),
    secondaryKeywords: [],
    region: /부산|해운대|센텀|경남|전국/.test(p.path) ? "geo-tagged" : "general",
    businessField: inferField(p),
    majorH2: [],
    faqCount: p.faqCount ?? null,
    bodyCharEstimate: null,
    hasUniqueTable: null,
    ctaTitle: p.ctaTitle || null,
    inboundLinksUnknown: true,
    outboundInternalLinkCount: p.internalLinkCount ?? null,
    outboundInternalLinks: p.internalLinks || [],
    relatedLinks: p.relatedLinks || [],
    canonical: p.canonical || null,
    sitemapUrl: p.sitemapUrl ?? true,
    indexability: "indexable-assumed",
    ogImage: null,
    structuredDataCount: p.jsonLdCount ?? null,
    author: "안윤정 법무사 (다옴법무사사무소)",
    lastModified: null,
    isCoreHub: Boolean(p.isCoreHub),
    protection: protectedUrls.has(p.path) ? "SEO_PROTECTED" : "UNKNOWN_PERFORMANCE",
  }));

  const byField = {};
  for (const page of pages) {
    byField[page.businessField] = (byField[page.businessField] || 0) + 1;
  }

  const inventory = {
    generatedAt: new Date().toISOString(),
    source: "scripts/output/seo-pages-manifest.json",
    total: pages.length,
    byBusinessField: byField,
    byCategory: (manifest.pages || []).reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {}),
    protectedCount: pages.filter((p) => p.protection === "SEO_PROTECTED").length,
    pages,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(inventory, null, 2) + "\n", "utf8");

  const fieldLines = Object.entries(byField)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `| ${k} | ${v} |`)
    .join("\n");

  const md = `# CURRENT CONTENT MAP

생성: ${inventory.generatedAt}  
출처: \`scripts/output/seo-pages-manifest.json\` (indexable ${inventory.total})

## 업무 분야별 페이지 수

| Field | Count |
|-------|------:|
${fieldLines}

## 카테고리별

| Category | Count |
|----------|------:|
${Object.entries(inventory.byCategory)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join("\n")}

## 보호

- SEO_PROTECTED (registry): ${inventory.protectedCount}
- 나머지: UNKNOWN_PERFORMANCE (성과 없음으로 간주하지 않음)

## Champion / Hub (보호 예시)

${[...(protectedCfg.pages || [])].map((p) => `- \`${p.url}\` — ${p.role || p.reason}`).join("\n")}

## 상세 JSON

\`reports/seo/content-inventory.json\`

> note: bodyCharEstimate·majorH2·ogImage는 정적 매니페스트 한계로 null일 수 있음. URL/title/H1/canonical은 매니페스트 기준.
`;

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md, "utf8");
  console.log(
    JSON.stringify(
      { total: inventory.total, byBusinessField: byField, out: OUT_JSON },
      null,
      2,
    ),
  );
}

main();
