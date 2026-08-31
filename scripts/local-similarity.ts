/**
 * Local page similarity (region names stripped).
 * Thresholds are internal quality gates, not Naver scores.
 *
 * normalized_similarity >= 0.75 CRITICAL
 * 0.60–0.75 HIGH
 * 0.45–0.60 REVIEW
 *
 * Usage: npx --yes tsx scripts/local-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { localLandingConfigs } from "../src/lib/local-landing/config";
import { REGION_HUB_IDENTITIES } from "../src/lib/local-landing/region-hub-identity";

const OUT = path.join(process.cwd(), "seo/local-similarity-report.csv");

const PLACE_NAMES = [
  "해운대구",
  "해운대",
  "센텀시티",
  "센텀",
  "연제구",
  "연산동",
  "거제동",
  "수영구",
  "광안리",
  "광안동",
  "민락동",
  "망미동",
  "남천동",
  "동래구",
  "사직동",
  "온천동",
  "명륜동",
  "부산진구",
  "서면",
  "부전동",
  "전포동",
  "남구",
  "대연동",
  "용호동",
  "문현동",
  "북구",
  "화명동",
  "덕천동",
  "금정구",
  "사상구",
  "사하구",
  "중구",
  "서구",
  "동구",
  "영도구",
  "강서구",
  "기장군",
  "기장읍",
  "재송동",
  "반여동",
  "우동",
  "좌동",
  "중동",
  "다옴법무사사무소",
  "안윤정",
].sort((a, b) => b.length - a.length);

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((token) => token.length > 1),
  );
}

function jaccard(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  let inter = 0;
  for (const token of ta) if (tb.has(token)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function stripPlaces(text: string): string {
  let out = text;
  for (const name of PLACE_NAMES) {
    out = out.split(name).join("");
  }
  return out.replace(/\s+/g, " ").trim();
}

function risk(score: number): string {
  if (score >= 0.75) return "CRITICAL";
  if (score >= 0.6) return "HIGH";
  if (score >= 0.45) return "REVIEW";
  return "OK";
}

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function main() {
  const pages = getAllPageData();
  const hubSlugs = new Set(
    localLandingConfigs
      .filter(
        (config) =>
          config.pageType === "region-hub" ||
          config.pageType === "neighborhood-hub" ||
          Boolean(REGION_HUB_IDENTITIES[config.slug]),
      )
      .map((config) => config.slug),
  );

  const docs = pages
    .filter(
      (page) =>
        hubSlugs.has(page.slug) &&
        page.path === `/${page.slug}` &&
        page.slug !== "부산법무사",
    )
    .map((page) => {
      const raw = [
        page.h1,
        page.intro,
        ...page.introParagraphs,
        ...page.sections.map((section) => section.body),
        ...page.faqs.map((faq) => `${faq.question} ${faq.answer}`),
      ].join("\n");
      const headings = [page.h1, ...page.sections.map((section) => section.title)].join("\n");
      const faqs = page.faqs.map((faq) => faq.question).join("\n");
      return {
        path: page.path,
        raw,
        normalized: stripPlaces(raw),
        headings: stripPlaces(headings),
        faqs: stripPlaces(faqs),
      };
    });

  const rows: string[] = [
    "page_a,page_b,raw_similarity,normalized_similarity,heading_similarity,faq_similarity,risk",
  ];
  let critical = 0;
  let high = 0;

  for (let i = 0; i < docs.length; i += 1) {
    for (let j = i + 1; j < docs.length; j += 1) {
      const a = docs[i];
      const b = docs[j];
      const normalized = jaccard(a.normalized, b.normalized);
      if (normalized < 0.45) continue;
      const raw = jaccard(a.raw, b.raw);
      const heading = jaccard(a.headings, b.headings);
      const faq = a.faqs && b.faqs ? jaccard(a.faqs, b.faqs) : 0;
      const band = risk(normalized);
      if (band === "CRITICAL") critical += 1;
      if (band === "HIGH") high += 1;
      rows.push(
        [
          csvCell(a.path),
          csvCell(b.path),
          raw.toFixed(3),
          normalized.toFixed(3),
          heading.toFixed(3),
          faq.toFixed(3),
          band,
        ].join(","),
      );
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${rows.join("\n")}\n`, "utf8");
  console.log("=== Local similarity ===");
  console.log(`hub docs compared: ${docs.length}`);
  console.log(`pairs >= REVIEW: ${rows.length - 1}`);
  console.log(`HIGH: ${high}  CRITICAL: ${critical}`);
  console.log(
    "Thresholds are internal quality gates, not Naver ranking scores.",
  );
  console.log(`wrote ${OUT}`);
}

main();
