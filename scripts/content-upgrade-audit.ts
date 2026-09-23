/**
 * Content Upgrade Audit — inventory + similarity + scorecards
 * Usage: npx --yes tsx scripts/content-upgrade-audit.ts
 *
 * URL / canonical / noindex 변경 없음. 보고서만 생성.
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import type { PageData } from "../src/lib/pageData/types";
import { isNoIndexPath } from "../src/lib/seo/index-policy";
import { resolveCarouselOgImage } from "../src/lib/seo/carousel-images";
import { getPageVisual } from "../src/data/seo/page-visuals";

const ROOT = process.cwd();
const DATE = new Date().toISOString().slice(0, 10);
const OUT = path.join(ROOT, "reports", "content-upgrade", DATE);
const CACHE = path.join(ROOT, ".cache", "content-upgrade");

const REGIONS = [
  "부산광역시",
  "부산",
  "해운대구",
  "해운대",
  "수영구",
  "수영",
  "연제구",
  "연제",
  "동래구",
  "동래",
  "부산진구",
  "부산진",
  "남구",
  "북구",
  "금정구",
  "금정",
  "사상구",
  "사상",
  "사하구",
  "사하",
  "강서구",
  "강서",
  "기장군",
  "기장",
  "중구",
  "서구",
  "영도구",
  "영도",
  "재송동",
  "재송",
  "반여동",
  "반여",
  "우동",
  "좌동",
  "중동",
  "센텀시티",
  "센텀",
  "양산",
  "김해",
  "울산",
  "창원",
  "거제",
  "통영",
  "마산",
  "진해",
];

type PageType =
  | "SERVICE_HUB"
  | "SERVICE_DETAIL"
  | "SITUATION"
  | "QUESTION"
  | "COST"
  | "COMPARISON"
  | "CASE"
  | "LOCAL"
  | "LECTURE"
  | "B2B"
  | "GUIDE"
  | "OTHER";

type InvRow = {
  url: string;
  title: string;
  h1: string;
  description: string;
  pageType: PageType;
  category: string;
  service: string;
  region: string;
  bodyChars: number;
  introChars: number;
  paragraphCount: number;
  h2Count: number;
  faqCount: number;
  outgoingInternalLinks: number;
  indexable: boolean;
  ogImage: string;
  first700: string;
  mainText: string;
  normalizedText: string;
};

function csvEscape(v: string | number | boolean): string {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(file: string, headers: string[], rows: (string | number | boolean)[][]) {
  const lines = [
    headers.join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ];
  writeFileSync(file, lines.join("\n"), "utf8");
}

function stripNoise(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/다옴법무사사무소|안윤정\s*법무사|법무사\s*안윤정/g, " ")
    .trim();
}

function normalizeRegions(s: string): string {
  let out = s;
  const sorted = [...REGIONS].sort((a, b) => b.length - a.length);
  for (const r of sorted) {
    out = out.split(r).join("[REGION]");
  }
  return out.replace(/\[REGION\](\s*\[REGION\])+/g, "[REGION]");
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function jaccard(a: string[], b: string[]): number {
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter += 1;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** 간단한 64-bit simhash */
function simhash(tokens: string[]): bigint {
  const bits = new Array<number>(64).fill(0);
  for (const t of tokens) {
    const h = createHash("sha256").update(t).digest();
    for (let i = 0; i < 8; i++) {
      const byte = h[i]!;
      for (let b = 0; b < 8; b++) {
        const idx = i * 8 + b;
        bits[idx]! += byte & (1 << b) ? 1 : -1;
      }
    }
  }
  let out = 0n;
  for (let i = 0; i < 64; i++) {
    if (bits[i]! > 0) out |= 1n << BigInt(i);
  }
  return out;
}

function hamming(a: bigint, b: bigint): number {
  let x = a ^ b;
  let c = 0;
  while (x) {
    c += Number(x & 1n);
    x >>= 1n;
  }
  return c;
}

function classifyPageType(page: PageData): PageType {
  const p = page.path;
  const cat = page.category;
  if (cat === "situation") return "SITUATION";
  if (cat === "case") return "CASE";
  if (cat === "cost" || /비용|수수료/.test(p)) return "COST";
  if (/차이|비교|vs|대비/.test(page.h1 + page.title + p)) return "COMPARISON";
  if (cat === "local" || cat === "businessDistrict" || cat === "court") return "LOCAL";
  if (/강의|특강|강연|교육/.test(p) || p.startsWith("/법률")) return "LECTURE";
  if (/partners|복대리|협업|집단등기|b2b/i.test(p)) return "B2B";
  if (cat === "pillar" || cat === "service") {
    if (
      [
        "/부산상속법무사",
        "/부산법인법무사",
        "/부산부동산등기",
        "/부산등기법무사",
        "/부산법무사",
        "/services",
      ].includes(p) ||
      p === "/부산개인회생법무사"
    ) {
      return "SERVICE_HUB";
    }
    return "SERVICE_DETAIL";
  }
  if (cat === "diagnosis" || cat === "tool" || cat === "glossary") return "GUIDE";
  if (cat === "faq" || /어떻게|무엇|언제|왜/.test(page.h1)) return "QUESTION";
  return "OTHER";
}

function detectRegion(page: PageData): string {
  const blob = `${page.path} ${page.h1} ${page.title}`;
  for (const r of REGIONS) {
    if (blob.includes(r)) return r;
  }
  return "";
}

function buildMainText(page: PageData): {
  intro: string;
  main: string;
  paragraphs: number;
} {
  const introParts = [
    page.intro,
    ...page.introParagraphs,
  ].filter(Boolean);
  const intro = stripNoise(introParts.join("\n"));

  const bodyParts = [
    ...page.procedures,
    ...page.documents,
    ...page.consultationPoints,
    ...page.sections.flatMap((s) => [
      s.title,
      s.body,
      ...(s.items ?? []),
    ]),
    page.consultationExample?.title,
    page.consultationExample?.body,
    ...(page.consultationExamples ?? []).flatMap((e) => [e.title, e.body]),
    ...page.faqs.flatMap((f) => [f.question, f.answer]),
  ].filter(Boolean);

  const main = stripNoise([intro, ...bodyParts].join("\n"));
  const paragraphs = main.split(/\n+/).filter((p) => p.trim().length > 40).length;
  return { intro, main, paragraphs };
}

function band(score: number): string {
  if (score >= 0.9) return "CRITICAL_DUPLICATE";
  if (score >= 0.8) return "HIGH_SIMILARITY";
  if (score >= 0.65) return "SIMILARITY_RISK";
  return "UNIQUE";
}

function first700Score(first700: string, page: InvRow): number {
  let score = 0;
  const t = first700;
  if (/상속|등기|법인|회생|파산|전세|임대|증여|근저당|임원|본점/.test(t)) score += 1;
  if (/경우|때|후|전|상황|걱정|필요/.test(t)) score += 1;
  if (/먼저|확인|검토|절차|서류|기한|비용/.test(t)) score += 1;
  if (t.length >= 120) score += 1;
  if (!/안녕하세요|오늘은|살펴보겠습니다|문의가 증가/.test(t)) score += 1;
  if (!/최고|1위|무료상담|무조건/.test(t)) score += 1;
  // uniqueness proxy vs title echo only
  if (t.replace(/\s/g, "").length > page.title.replace(/\s/g, "").length * 2) score += 0;
  return Math.min(6, score);
}

function contentScore(row: InvRow, firstScore: number, maxSim: number): number {
  let s = 0;
  // intent clarity 15
  s += row.h1 && row.description ? 12 : 6;
  if (row.pageType !== "OTHER") s += 3;
  // first700 10
  s += Math.round((firstScore / 6) * 10);
  // unique 15
  s += maxSim >= 0.9 ? 2 : maxSim >= 0.8 ? 6 : maxSim >= 0.65 ? 10 : 15;
  // completeness 15
  if (row.bodyChars >= 3000) s += 15;
  else if (row.bodyChars >= 2000) s += 12;
  else if (row.bodyChars >= 1500) s += 8;
  else if (row.bodyChars >= 1000) s += 5;
  else s += 2;
  // experience/trust 10 — FAQ/sections proxy
  s += Math.min(10, row.faqCount * 2 + (row.h2Count > 2 ? 4 : 0));
  // readability 10
  const longWall = row.bodyChars > 2500 && row.h2Count < 2;
  s += longWall ? 3 : row.h2Count >= 3 ? 10 : 7;
  // internal linking 10
  s += Math.min(10, row.outgoingInternalLinks * 1.5);
  // metadata 5
  s += row.title && row.description && row.description.length > 40 ? 5 : 2;
  // technical 5
  s += row.indexable ? 5 : 0;
  // conversion 5 — cta always present in template; soft score
  s += 4;
  return Math.min(100, Math.round(s));
}

function readabilityLabel(row: InvRow): string {
  if (row.bodyChars > 2800 && row.h2Count < 3) return "VERTICAL_WALL";
  if (row.bodyChars > 2000 && row.h2Count < 2) return "NEEDS_LAYOUT_IMPROVEMENT";
  if (row.bodyChars < 800) return "NEEDS_LAYOUT_IMPROVEMENT";
  return "GOOD";
}

function main() {
  mkdirSync(OUT, { recursive: true });
  mkdirSync(CACHE, { recursive: true });

  const all = getAllPageData().filter((p) => isIndexablePagePath(p.path));
  const inventory: InvRow[] = [];

  for (const page of all) {
    const { intro, main, paragraphs } = buildMainText(page);
    const first700 = main.slice(0, 700);
    const og =
      getPageVisual(page.path)?.representativeImage ??
      resolveCarouselOgImage(page.path)?.src ??
      page.ogImage ??
      "";
    inventory.push({
      url: page.path,
      title: page.metaTitle || page.title,
      h1: page.h1,
      description: page.metaDescription,
      pageType: classifyPageType(page),
      category: page.category,
      service: page.serviceSlug ?? "",
      region: detectRegion(page),
      bodyChars: main.replace(/\s/g, "").length,
      introChars: intro.replace(/\s/g, "").length,
      paragraphCount: paragraphs,
      h2Count: page.sections.length,
      faqCount: page.faqs.length,
      outgoingInternalLinks: page.internalLinks.length + page.relatedLinks.length,
      indexable: !isNoIndexPath(page.path),
      ogImage: og,
      first700,
      mainText: main,
      normalizedText: normalizeRegions(main),
    });
  }

  // similarity within category buckets (cap comparisons)
  const byCat = new Map<string, InvRow[]>();
  for (const row of inventory) {
    const key = `${row.category}|${row.service || row.pageType}`;
    const list = byCat.get(key) ?? [];
    list.push(row);
    byCat.set(key, list);
  }

  const maxSimByUrl = new Map<string, number>();
  const maxNormSimByUrl = new Map<string, number>();
  const duplicatePairs: {
    a: string;
    b: string;
    raw: number;
    norm: number;
    band: string;
    normBand: string;
  }[] = [];

  for (const [, group] of byCat) {
    const limited = group.length > 80 ? group.slice(0, 80) : group;
    const hashed = limited.map((r) => ({
      row: r,
      tokens: tokenize(r.mainText),
      normTokens: tokenize(r.normalizedText),
      hash: simhash(tokenize(r.mainText)),
    }));

    for (let i = 0; i < hashed.length; i++) {
      for (let j = i + 1; j < hashed.length; j++) {
        const A = hashed[i]!;
        const B = hashed[j]!;
        // skip if simhash far
        if (hamming(A.hash, B.hash) > 18) continue;
        const raw = jaccard(A.tokens, B.tokens);
        const norm = jaccard(A.normTokens, B.normTokens);
        if (raw < 0.55 && norm < 0.55) continue;
        const b = band(raw);
        const nb = band(norm);
        duplicatePairs.push({
          a: A.row.url,
          b: B.row.url,
          raw: Math.round(raw * 1000) / 1000,
          norm: Math.round(norm * 1000) / 1000,
          band: b,
          normBand: nb,
        });
        maxSimByUrl.set(A.row.url, Math.max(maxSimByUrl.get(A.row.url) ?? 0, raw));
        maxSimByUrl.set(B.row.url, Math.max(maxSimByUrl.get(B.row.url) ?? 0, raw));
        maxNormSimByUrl.set(
          A.row.url,
          Math.max(maxNormSimByUrl.get(A.row.url) ?? 0, norm),
        );
        maxNormSimByUrl.set(
          B.row.url,
          Math.max(maxNormSimByUrl.get(B.row.url) ?? 0, norm),
        );
      }
    }
  }

  duplicatePairs.sort((x, y) => y.norm - x.norm || y.raw - x.raw);

  // title duplicates
  const titleMap = new Map<string, string[]>();
  for (const r of inventory) {
    const k = r.title.trim();
    const list = titleMap.get(k) ?? [];
    list.push(r.url);
    titleMap.set(k, list);
  }

  // first700 similarity among hubs/details sample
  const important = inventory.filter((r) =>
    ["SERVICE_HUB", "SERVICE_DETAIL", "LOCAL", "SITUATION"].includes(r.pageType),
  );
  const first700Pairs: { a: string; b: string; sim: number }[] = [];
  const sample700 = important.slice(0, 120);
  for (let i = 0; i < sample700.length; i++) {
    for (let j = i + 1; j < sample700.length; j++) {
      const a = sample700[i]!;
      const b = sample700[j]!;
      if (a.category !== b.category) continue;
      const sim = jaccard(tokenize(a.first700), tokenize(b.first700));
      if (sim >= 0.8) first700Pairs.push({ a: a.url, b: b.url, sim });
    }
  }
  first700Pairs.sort((x, y) => y.sim - x.sim);

  // scorecards
  const scores = inventory.map((row) => {
    const maxSim = maxSimByUrl.get(row.url) ?? 0;
    const fScore = first700Score(row.first700, row);
    const score = contentScore(row, fScore, maxSim);
    const grade =
      score >= 85 ? "STRONG" : score >= 70 ? "IMPROVE" : score >= 55 ? "WEAK" : "CRITICAL";
    const introRatio = row.bodyChars > 0 ? row.introChars / row.bodyChars : 0;
    const longIntro =
      introRatio > 0.15 ||
      /안녕하세요|오늘은|살펴보겠습니다|문의가 증가/.test(row.first700);
    const thin = row.bodyChars < 2000;
    const answerLate = !/먼저|확인|검토|절차|기한|필요|경우/.test(row.first700.slice(0, 280));
    return {
      row,
      score,
      grade,
      fScore,
      maxSim,
      maxNorm: maxNormSimByUrl.get(row.url) ?? 0,
      longIntro,
      thin,
      answerLate,
      readability: readabilityLabel(row),
    };
  });

  // --- write reports ---
  writeCsv(
    path.join(OUT, "01-site-inventory.csv"),
    [
      "url",
      "title",
      "h1",
      "description",
      "pageType",
      "category",
      "service",
      "region",
      "bodyChars",
      "introChars",
      "paragraphCount",
      "h2Count",
      "faqCount",
      "outgoingInternalLinks",
      "indexable",
      "ogImage",
    ],
    inventory.map((r) => [
      r.url,
      r.title,
      r.h1,
      r.description,
      r.pageType,
      r.category,
      r.service,
      r.region,
      r.bodyChars,
      r.introChars,
      r.paragraphCount,
      r.h2Count,
      r.faqCount,
      r.outgoingInternalLinks,
      r.indexable,
      r.ogImage,
    ]),
  );

  const thinRows = scores.filter((s) => s.thin);
  writeCsv(
    path.join(OUT, "02-thin-content.csv"),
    ["url", "pageType", "bodyChars", "h2Count", "faqCount", "grade", "score"],
    thinRows.map((s) => [
      s.row.url,
      s.row.pageType,
      s.row.bodyChars,
      s.row.h2Count,
      s.row.faqCount,
      s.grade,
      s.score,
    ]),
  );

  const longIntroRows = scores.filter((s) => s.longIntro || s.answerLate);
  writeCsv(
    path.join(OUT, "03-long-intros.csv"),
    ["url", "introChars", "bodyChars", "introRatio", "answerLate", "first700Preview"],
    longIntroRows.map((s) => [
      s.row.url,
      s.row.introChars,
      s.row.bodyChars,
      Math.round((s.row.introChars / Math.max(1, s.row.bodyChars)) * 1000) / 1000,
      s.answerLate,
      s.row.first700.slice(0, 180),
    ]),
  );

  writeCsv(
    path.join(OUT, "04-duplicate-content.csv"),
    ["pageA", "pageB", "rawSimilarity", "band", "actionHint"],
    duplicatePairs
      .filter((p) => p.raw >= 0.65)
      .slice(0, 500)
      .map((p) => [
        p.a,
        p.b,
        p.raw,
        p.band,
        p.band === "CRITICAL_DUPLICATE"
          ? "CANNIBALIZATION_RISK_OR_REPOSITION"
          : "REPOSITION_OR_EXPAND",
      ]),
  );

  writeCsv(
    path.join(OUT, "05-region-normalized-duplicates.csv"),
    ["pageA", "pageB", "normSimilarity", "normBand", "rawSimilarity"],
    duplicatePairs
      .filter((p) => p.norm >= 0.65)
      .slice(0, 500)
      .map((p) => [p.a, p.b, p.norm, p.normBand, p.raw]),
  );

  writeCsv(
    path.join(OUT, "06-cannibalization.csv"),
    ["pageA", "pageB", "raw", "norm", "classification"],
    duplicatePairs
      .filter((p) => p.raw >= 0.8 || p.norm >= 0.85)
      .slice(0, 300)
      .map((p) => [
        p.a,
        p.b,
        p.raw,
        p.norm,
        p.norm >= 0.9
          ? "CANNIBALIZATION_RISK"
          : p.norm >= 0.8
            ? "REPOSITION"
            : "LOCAL_DIFFERENTIATION_REQUIRED",
      ]),
  );

  writeCsv(
    path.join(OUT, "07-first700-problems.csv"),
    ["url", "first700Score", "pairRiskCount", "preview"],
    scores
      .filter((s) => s.fScore < 4 || first700Pairs.some((p) => p.a === s.row.url || p.b === s.row.url))
      .map((s) => [
        s.row.url,
        s.fScore,
        first700Pairs.filter((p) => p.a === s.row.url || p.b === s.row.url).length,
        s.row.first700.slice(0, 160),
      ]),
  );

  writeCsv(
    path.join(OUT, "08-readability-problems.csv"),
    ["url", "bodyChars", "h2Count", "paragraphCount", "label"],
    scores
      .filter((s) => s.readability !== "GOOD")
      .map((s) => [
        s.row.url,
        s.row.bodyChars,
        s.row.h2Count,
        s.row.paragraphCount,
        s.readability,
      ]),
  );

  const metaProblems = inventory.filter((r) => {
    const dups = titleMap.get(r.title.trim()) ?? [];
    return (
      !r.description ||
      r.description.length < 40 ||
      dups.length > 1 ||
      /전문 법무사|절차 비용 서류 총정리/.test(r.title)
    );
  });
  writeCsv(
    path.join(OUT, "09-metadata-problems.csv"),
    ["url", "title", "descriptionLen", "titleDuplicateCount", "issue"],
    metaProblems.map((r) => {
      const dups = titleMap.get(r.title.trim()) ?? [];
      const issues = [];
      if (!r.description || r.description.length < 40) issues.push("WEAK_DESCRIPTION");
      if (dups.length > 1) issues.push("DUPLICATE_TITLE");
      if (/전문 법무사|절차 비용 서류 총정리/.test(r.title)) issues.push("TEMPLATE_TITLE");
      return [r.url, r.title, r.description.length, dups.length, issues.join("|")];
    }),
  );

  const orphanish = inventory.filter((r) => r.outgoingInternalLinks < 3);
  writeCsv(
    path.join(OUT, "10-internal-link-problems.csv"),
    ["url", "outgoingInternalLinks", "pageType", "note"],
    orphanish.map((r) => [
      r.url,
      r.outgoingInternalLinks,
      r.pageType,
      "LOW_OUTGOING_LINKS_REVIEW",
    ]),
  );

  writeCsv(
    path.join(OUT, "11-conversion-problems.csv"),
    ["url", "pageType", "bodyChars", "faqCount", "issue"],
    scores
      .filter((s) => s.row.faqCount === 0 && s.row.pageType !== "OTHER")
      .slice(0, 400)
      .map((s) => [s.row.url, s.row.pageType, s.row.bodyChars, s.row.faqCount, "NO_FAQ_REVIEW"]),
  );

  // empty improved / create for now
  writeCsv(
    path.join(OUT, "12-pages-improved.csv"),
    ["url", "action", "note"],
    [["", "NONE_YET", "Audit-first run; improvements in follow-up batch"]],
  );
  writeCsv(
    path.join(OUT, "13-create-candidates.csv"),
    ["intent", "reason", "suggestedOwner"],
    [
      [
        "승인 후 검토",
        "감사 결과 CREATE보다 REPOSITION/EXPAND 우선",
        "",
      ],
    ],
  );
  writeCsv(
    path.join(OUT, "14-before-after.csv"),
    ["url", "beforeChars", "afterChars", "status"],
    [],
  );

  writeFileSync(path.join(OUT, "15-indexnow-targets.txt"), "", "utf8");

  const criticalDup = duplicatePairs.filter((p) => p.band === "CRITICAL_DUPLICATE").length;
  const highSim = duplicatePairs.filter((p) => p.band === "HIGH_SIMILARITY").length;
  const regionCrit = duplicatePairs.filter((p) => p.normBand === "CRITICAL_DUPLICATE").length;
  const vertical = scores.filter((s) => s.readability === "VERTICAL_WALL").length;

  const summary = `# Content Upgrade Audit — ${DATE}

## Scope
- Indexable PageData pages audited: **${inventory.length}**
- Method: registry inventory + Jaccard + SimHash prefilter + region-normalized similarity
- **No URL / canonical / noindex / redirect changes**

## Problem counts
| Issue | Count |
|------|------:|
| Thin (<2000 chars) | ${thinRows.length} |
| Long intro / late answer | ${longIntroRows.length} |
| CRITICAL_DUPLICATE pairs | ${criticalDup} |
| HIGH_SIMILARITY pairs | ${highSim} |
| Region-normalized CRITICAL pairs | ${regionCrit} |
| First700 problems (sample) | ${scores.filter((s) => s.fScore < 4).length} |
| Vertical wall readability | ${vertical} |
| Metadata problems | ${metaProblems.length} |
| Low outgoing links (<3) | ${orphanish.length} |
| CRITICAL grade pages | ${scores.filter((s) => s.grade === "CRITICAL").length} |
| WEAK grade pages | ${scores.filter((s) => s.grade === "WEAK").length} |

## Priority actions (no auto-merge)
1. **P0** — CRITICAL_DUPLICATE / cannibalization pairs → REPOSITION or MERGE_CANDIDATE (approval)
2. **P1** — Important hubs/details that are thin + low first700 score
3. **P2** — Long intro / promotional openings
4. **P3** — Vertical wall readability (TOC/summary/steps)
5. **P4** — Metadata + internal links

## Top cannibalization pairs (norm)
${duplicatePairs
  .filter((p) => p.norm >= 0.85)
  .slice(0, 15)
  .map((p) => `- ${p.a} ↔ ${p.b} (norm ${p.norm}, raw ${p.raw})`)
  .join("\n") || "- none at ≥0.85"}

## Top thin important pages
${scores
  .filter((s) => s.thin && ["SERVICE_HUB", "SERVICE_DETAIL", "LOCAL"].includes(s.row.pageType))
  .sort((a, b) => a.row.bodyChars - b.row.bodyChars)
  .slice(0, 15)
  .map((s) => `- ${s.row.url} (${s.row.bodyChars} chars, ${s.grade})`)
  .join("\n") || "- none"}

## Approval needed
- MERGE_CANDIDATE: see 06-cannibalization.csv (do not auto-redirect)
- CREATE_CANDIDATE: deferred — strengthen existing pages first
`;

  writeFileSync(path.join(OUT, "00-summary.md"), summary, "utf8");
  writeFileSync(
    path.join(OUT, "16-build-validation.md"),
    `# Build validation\n\nAudit-only run on ${DATE}.\nNo content rewrites in this pass.\nProduction build not required for CSV generation.\n`,
    "utf8",
  );

  // dashboard
  const dashRows = scores
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 200);
  const html = `<!doctype html><html lang="ko"><meta charset="utf-8"/>
<title>Content Upgrade Dashboard ${DATE}</title>
<style>
body{font-family:Malgun Gothic,sans-serif;background:#f7f4ef;color:#152a45;padding:24px}
table{border-collapse:collapse;width:100%;background:#fff}
th,td{border:1px solid #ddd4c6;padding:8px;font-size:12px;vertical-align:top}
th{background:#eef2f7;position:sticky;top:0}
.CRITICAL{color:#9b1c1c}.WEAK{color:#9a3412}.IMPROVE{color:#854d0e}.STRONG{color:#166534}
input,select{margin:4px 8px 12px 0;padding:6px}
</style>
<h1>Content Upgrade Dashboard — ${DATE}</h1>
<p>Indexable: ${inventory.length} · Showing worst 200 by score</p>
<label>Grade <select id="g"><option value="">ALL</option><option>CRITICAL</option><option>WEAK</option><option>IMPROVE</option><option>STRONG</option></select></label>
<label>Filter <input id="f" placeholder="url contains"/></label>
<table id="t"><thead><tr>
<th>URL</th><th>Type</th><th>Chars</th><th>Intro</th><th>MaxSim</th><th>Score</th><th>Grade</th><th>Readability</th><th>Flags</th>
</tr></thead><tbody>
${dashRows
  .map((s) => {
    const flags = [
      s.thin ? "THIN" : "",
      s.longIntro ? "LONG_INTRO" : "",
      s.maxSim >= 0.8 ? "DUP" : "",
      s.readability === "VERTICAL_WALL" ? "VERTICAL_WALL" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `<tr data-g="${s.grade}" data-u="${s.row.url}"><td>${s.row.url}</td><td>${s.row.pageType}</td><td>${s.row.bodyChars}</td><td>${s.row.introChars}</td><td>${(s.maxSim * 100).toFixed(0)}%</td><td>${s.score}</td><td class="${s.grade}">${s.grade}</td><td>${s.readability}</td><td>${flags}</td></tr>`;
  })
  .join("\n")}
</tbody></table>
<script>
const g=document.getElementById('g'),f=document.getElementById('f'),rows=[...document.querySelectorAll('#t tbody tr')];
function apply(){const gv=g.value,fv=f.value.trim();rows.forEach(r=>{const okG=!gv||r.dataset.g===gv;const okF=!fv||r.dataset.u.includes(fv);r.style.display=okG&&okF?'':'none';})}
g.onchange=apply;f.oninput=apply;
</script></html>`;
  writeFileSync(path.join(OUT, "dashboard.html"), html, "utf8");

  // cache snapshot
  writeFileSync(
    path.join(CACHE, `${DATE}-summary.json`),
    JSON.stringify(
      {
        date: DATE,
        indexable: inventory.length,
        thin: thinRows.length,
        longIntro: longIntroRows.length,
        criticalDup,
        highSim,
        regionCrit,
        vertical,
        metaProblems: metaProblems.length,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        out: OUT,
        indexable: inventory.length,
        thin: thinRows.length,
        longIntro: longIntroRows.length,
        criticalDup,
        highSim,
        regionCrit,
        vertical,
        metaProblems: metaProblems.length,
        orphanish: orphanish.length,
        criticalPages: scores.filter((s) => s.grade === "CRITICAL").length,
        weakPages: scores.filter((s) => s.grade === "WEAK").length,
      },
      null,
      2,
    ),
  );
}

main();
