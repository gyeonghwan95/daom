/**
 * Local page / overlay content similarity (region names stripped).
 * Internal 70+ = HIGH DUPLICATE RISK — not a Naver score.
 *
 * Usage: npx --yes tsx scripts/audit-local-content-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { LOCAL_CHAMPION_OVERLAYS, stripLocalNames } from "../src/data/seo/local-champion-overlays";
import { getSeoLandingSpecBySlug } from "../src/lib/seo-landing/combinations";
import { buildSeoLandingContent } from "../src/lib/seo-landing/content";

const OUT = path.join(process.cwd(), "reports/seo/local-content-similarity.json");

function tokens(s: string): Set<string> {
  return new Set(
    s
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
  for (const t of ta) if (tb.has(t)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function band(score: number): string {
  const p = Math.round(score * 100);
  if (p >= 70) return "HIGH_DUPLICATE_RISK";
  if (p >= 55) return "REVIEW";
  return "acceptable";
}

type Doc = { id: string; path: string; body: string };

function main() {
  const docs: Doc[] = [];
  const seen = new Set<string>();

  function pushDoc(doc: Doc) {
    if (seen.has(doc.path)) return;
    seen.add(doc.path);
    docs.push(doc);
  }

  for (const overlay of Object.values(LOCAL_CHAMPION_OVERLAYS)) {
    const body = [
      ...overlay.introParagraphs,
      ...overlay.sections.map((s) => `${s.title}\n${s.body}`),
      ...(overlay.faqs?.map((f) => `${f.question} ${f.answer}`) ?? []),
    ].join("\n");
    pushDoc({
      id: overlay.regionId,
      path: `/${overlay.slug}`,
      body: stripLocalNames(body),
    });
  }

  const sampleSlugs = [
    "민락동법무사",
    "양정동법무사",
    "수영구법무사",
    "부산진구법무사",
    "해운대법무사",
    "동래구법무사",
    "금정구법무사",
    "사상구법무사",
    "기장법무사",
    "남구법무사",
    "해운대상속등기",
    "동래구상속포기",
    "수영구부동산등기",
    "부산진구법인등기",
  ];

  for (const slug of sampleSlugs) {
    const spec = getSeoLandingSpecBySlug(slug);
    if (!spec) continue;
    const content = buildSeoLandingContent(spec);
    const body = [
      content.intro,
      ...content.introParagraphs,
      ...content.sections.map((s) => `${s.title}\n${s.body}`),
      ...content.faqs.map((f) => `${f.question} ${f.answer}`),
    ].join("\n");
    pushDoc({
      id: `template:${slug}`,
      path: spec.path,
      body: stripLocalNames(body),
    });
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
        a: docs[i]!.path,
        b: docs[j]!.path,
        similarity: Math.round(score * 1000) / 10,
        band: band(score),
      });
    }
  }

  pairs.sort((x, y) => y.similarity - x.similarity);
  const highRisk = pairs.filter((p) => p.band === "HIGH_DUPLICATE_RISK");

  const payload = {
    generatedAt: new Date().toISOString(),
    method: "jaccard-after-region-name-strip",
    documentCount: docs.length,
    highRiskCount: highRisk.length,
    reviewCount: pairs.filter((p) => p.band === "REVIEW").length,
    topPairs: pairs.slice(0, 30),
    highRisk,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(
    JSON.stringify(
      { out: OUT, highRisk: highRisk.length, top: pairs[0] ?? null },
      null,
      2,
    ),
  );
  if (highRisk.length > 0) process.exitCode = 0;
}

main();
