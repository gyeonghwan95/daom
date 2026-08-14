/**
 * 신규 corporate legal 모듈 vs 기존 Champion/기업허브/협업문의 유사도.
 * 공통명사(법인/기업/회사/부산/법무사) 제거 후 Jaccard.
 * 실행: npx --yes tsx scripts/audit-corporate-legal-similarity.ts
 */
import { getKeywordTopic } from "../src/lib/local-landing/keyword-topics";
import { businessPages } from "../src/lib/business/content";
import {
  corporateChangeSituationCards,
  corporateLegalExtraFaqs,
  corporateScopeRows,
  corporateSixAreaNav,
} from "../src/lib/local-landing/corporate-legal-operations-modules";

const STRIP = [
  /부산광역시?/g,
  /해운대/g,
  /센텀/g,
  /안윤정/g,
  /다옴법무사사무소/g,
  /법인/g,
  /기업/g,
  /회사/g,
  /법무사/g,
  /등기/g,
  /\s+/g,
];

function stripNoise(s: string): string {
  let t = s;
  for (const re of STRIP) t = t.replace(re, " ");
  return t.replace(/\s+/g, " ").trim();
}

function tokens(s: string): Set<string> {
  return new Set(
    stripNoise(s)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1),
  );
}

function jaccard(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  let inter = 0;
  for (const x of ta) if (tb.has(x)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function topicBlob(slug: string): string {
  const t = getKeywordTopic(slug);
  if (!t) return "";
  return [
    ...t.summaryParagraphs,
    t.problemStatement,
    ...t.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join("\n");
}

function businessBlob(slug: string): string {
  const p = businessPages.find((row) => row.slug === slug);
  if (!p) return "";
  return [
    p.heroIntro,
    ...p.heroParagraphs,
    ...p.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join("\n");
}

const newCopy = [
  ...corporateSixAreaNav.map((c) => `${c.title} ${c.description}`),
  ...corporateChangeSituationCards.map((c) => `${c.title} ${c.description}`),
  ...corporateScopeRows.map((r) => `${r.area} ${r.note}`),
  ...corporateLegalExtraFaqs.map((f) => `${f.question} ${f.answer}`),
].join("\n");

const pairs: { label: string; other: string }[] = [
  { label: "/부산법인법무사 existing body", other: topicBlob("부산법인법무사") },
  { label: "/부산기업법률자문", other: businessBlob("부산기업법률자문") },
  { label: "/부산기업법무사", other: topicBlob("부산기업법무사") },
];

console.log("=== Corporate Legal Similarity (stripped nouns) ===");
let fail = false;
for (const pair of pairs) {
  const score = jaccard(newCopy, pair.other);
  const band =
    score >= 0.7 ? "HIGH" : score >= 0.55 ? "REVIEW" : "acceptable";
  console.log(`${pair.label}: ${score.toFixed(3)} [${band}]`);
  if (band === "HIGH") fail = true;
}
if (fail) {
  console.error("HIGH similarity — CREATE_NEW/중복 모듈 금지");
  process.exit(1);
}
