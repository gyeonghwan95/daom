/**
 * Lecture page similarity after stripping geo/format/office nouns.
 * Usage: npx --yes tsx scripts/audit-lecture-content-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { lecturePages } from "../src/lib/lectures/content";

const OUT = path.join(
  process.cwd(),
  "reports/seo/lecture-content-similarity.json",
);

const STRIP = [
  /부산광역시?/g,
  /해운대/g,
  /센텀/g,
  /안윤정/g,
  /다옴법무사사무소/g,
  /강사/g,
  /특강/g,
  /워크숍/g,
  /워크샵/g,
  /세미나/g,
  /강의/g,
  /교육/g,
  /출강/g,
  /\s+/g,
];

const CHAMPION_COMPARE = new Set([
  "/부산법무사",
  "/부산법인법무사",
  "/부산법무사추천",
  "/부산법무사상담",
  "/부산법률상담",
]);

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

function band(score: number): string {
  const p = Math.round(score * 100);
  if (p >= 70) return "HIGH_DUPLICATE_RISK";
  if (p >= 55) return "REVIEW";
  return "acceptable";
}

function pageBody(p: (typeof lecturePages)[number]): string {
  return [
    p.heroIntro,
    ...p.heroParagraphs,
    ...(p.bodySections?.flatMap((s) => [s.title, ...s.paragraphs]) ?? []),
    ...p.faqs.map((f) => `${f.question} ${f.answer}`),
    ...p.modules,
    ...p.topicCards.map((t) => `${t.title} ${t.description}`),
  ].join("\n");
}

function main() {
  const docs = lecturePages.map((p) => ({
    id: `/${p.slug}`,
    body: pageBody(p),
  }));

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

  const high = pairs.filter((p) => p.band === "HIGH_DUPLICATE_RISK");
  const championHits = pairs.filter(
    (p) =>
      (CHAMPION_COMPARE.has(p.a) || CHAMPION_COMPARE.has(p.b)) &&
      p.band !== "acceptable",
  );

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pageCount: docs.length,
        highDuplicateCount: high.length,
        championReviewCount: championHits.length,
        high,
        championHits,
        pairs: pairs.slice(0, 40),
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Wrote ${OUT}`);
  console.log(`HIGH_DUPLICATE_RISK: ${high.length}`);
  console.log(`Champion REVIEW+: ${championHits.length}`);
  if (high.slice(0, 8).length) {
    for (const h of high.slice(0, 8)) {
      console.log(`  ${h.a} ↔ ${h.b}  ${h.similarity}`);
    }
  }
  if (championHits.some((h) => h.band === "HIGH_DUPLICATE_RISK")) {
    process.exitCode = 1;
  }
}

main();
