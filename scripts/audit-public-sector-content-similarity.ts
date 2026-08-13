/**
 * Public-sector vs Champion content similarity.
 * Strips institution/geo/office nouns, then Jaccard on remaining tokens.
 * Internal 70+ = HIGH_DUPLICATE_RISK (not a Naver score).
 *
 * Usage: npx --yes tsx scripts/audit-public-sector-content-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { inquiryPageContent } from "../src/lib/b2b/pages/inquiry";
import { partnersPageContent } from "../src/lib/b2b/pages/partners";
import { getPublicAgencyRegistrationContent } from "../src/lib/local-landing/public-agency-registration-content";
import { getSearchIntentContent } from "../src/lib/local-landing/search-intent";

const OUT = path.join(
  process.cwd(),
  "reports/seo/public-sector-content-similarity.json",
);

const STRIP = [
  /공공기관/g,
  /공기업/g,
  /지방공기업/g,
  /지자체/g,
  /출자\s*·?\s*출연/g,
  /공사/g,
  /공단/g,
  /재단/g,
  /센터/g,
  /협회/g,
  /조합/g,
  /비영리/g,
  /부산광역시?/g,
  /해운대/g,
  /센텀/g,
  /다옴법무사사무소/g,
  /안윤정/g,
  /법무사/g,
  /등기/g,
  /법인/g,
  /부동산/g,
  /\s+/g,
];

const PUBLIC_SLUGS = [
  "공공기관법인등기",
  "공공기관부동산등기",
  "공공기관촉탁등기",
  "공공기관이전등기",
  "공기업등기",
  "촉탁등기",
  "지방공기업등기",
];

const CHAMPION_FILES: Array<{ id: string; rel: string }> = [
  { id: "/부산법무사", rel: "src/lib/local-landing/flagship-busan-lawyer.ts" },
  {
    id: "/부산법인법무사",
    rel: "src/lib/local-landing/keyword-topics.ts",
  },
  {
    id: "/부산법무사추천",
    rel: "src/lib/local-landing/selection/topics/busan-recommend.ts",
  },
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
      .filter((t) => t.length > 1),
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

function band(score: number): string {
  const p = Math.round(score * 100);
  if (p >= 70) return "HIGH_DUPLICATE_RISK";
  if (p >= 55) return "REVIEW";
  return "acceptable";
}

type Doc = { id: string; body: string };

function hubBody(): string {
  const c = getPublicAgencyRegistrationContent();
  return [
    ...c.heroParagraphs,
    ...c.whatIsParagraphs,
    ...c.summaryBullets,
    ...c.institutionTypes.map((i) => `${i.title} ${i.description}`),
    ...c.corporateTasks.map((t) => `${t.title} ${t.whenNeeded} ${t.caution}`),
    ...c.realEstateTasks.map((t) => `${t.title} ${t.whenNeeded} ${t.caution}`),
    ...c.faqs.map((f) => `${f.question} ${f.answer}`),
    ...c.procurementParagraphs,
    ...(c.roleIntentCards?.map((r) => `${r.title} ${r.description}`) ?? []),
    ...(c.scopeRows?.map((r) => `${r.topic} ${r.note}`) ?? []),
    ...(c.quoteCheckItems?.map((q) => `${q.label} ${q.hint}`) ?? []),
    ...(c.inquiryProcessSteps ?? []),
    ...(c.staffMinuteChecklist ?? []),
  ].join("\n");
}

function searchIntentBody(slug: string): string | null {
  const c = getSearchIntentContent(slug);
  if (!c) return null;
  return [
    ...c.heroParagraphs,
    ...c.summaryBullets,
    ...c.searchIntents,
    ...c.whenNeeded,
    ...c.procedures,
    ...c.commonMistakes,
    ...c.faqs.map((f) => `${f.question} ${f.answer}`),
    ...(c.proseSections?.flatMap((s) => [s.title, ...s.paragraphs]) ?? []),
  ].join("\n");
}

function main() {
  const docs: Doc[] = [];

  docs.push({ id: "/공공기관등기업무", body: hubBody() });
  docs.push({
    id: "/협업문의",
    body: [
      inquiryPageContent.h1,
      ...inquiryPageContent.heroParagraphs,
      ...inquiryPageContent.faqs.map((f) => `${f.question} ${f.answer}`),
    ].join("\n"),
  });
  docs.push({
    id: "/partners",
    body: [
      partnersPageContent.h1,
      ...partnersPageContent.heroParagraphs,
      ...partnersPageContent.faqs.map((f) => `${f.question} ${f.answer}`),
    ].join("\n"),
  });

  for (const slug of PUBLIC_SLUGS) {
    const body = searchIntentBody(slug);
    if (body) docs.push({ id: `/${slug}`, body });
  }

  for (const file of CHAMPION_FILES) {
    const abs = path.join(process.cwd(), file.rel);
    if (!fs.existsSync(abs)) continue;
    docs.push({ id: file.id, body: fs.readFileSync(abs, "utf8") });
  }

  const pairs: Array<{
    a: string;
    b: string;
    similarity: number;
    band: string;
  }> = [];

  for (let i = 0; i < docs.length; i += 1) {
    for (let j = i + 1; j < docs.length; j += 1) {
      const score = jaccard(docs[i]!.body, docs[j]!.body);
      pairs.push({
        a: docs[i]!.id,
        b: docs[j]!.id,
        similarity: Math.round(score * 1000) / 10,
        band: band(score),
      });
    }
  }

  pairs.sort((x, y) => y.similarity - x.similarity);

  const championHits = pairs.filter(
    (p) =>
      (p.a === "/부산법무사" ||
        p.b === "/부산법무사" ||
        p.a === "/부산법인법무사" ||
        p.b === "/부산법인법무사" ||
        p.a === "/부산법무사추천" ||
        p.b === "/부산법무사추천") &&
      p.band !== "acceptable",
  );

  const high = pairs.filter((p) => p.band === "HIGH_DUPLICATE_RISK");

  const report = {
    generatedAt: new Date().toISOString(),
    docs: docs.map((d) => ({ id: d.id, chars: d.body.length })),
    highDuplicateCount: high.length,
    championReviewCount: championHits.length,
    championHits,
    high,
    pairs: pairs.slice(0, 80),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");

  console.log(`Wrote ${OUT}`);
  console.log(`HIGH_DUPLICATE_RISK (all pairs): ${high.length}`);
  console.log(`Champion REVIEW+: ${championHits.length}`);
  if (championHits.length) {
    for (const h of championHits.slice(0, 15)) {
      console.log(`  ${h.a} ↔ ${h.b}  ${h.similarity}  ${h.band}`);
    }
  }
  const championHigh = championHits.filter((h) => h.band === "HIGH_DUPLICATE_RISK");
  if (championHigh.length) {
    console.error("Champion HIGH_DUPLICATE_RISK — stop create/strengthen dump.");
    process.exitCode = 1;
  }
}

main();
