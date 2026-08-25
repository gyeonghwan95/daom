/**
 * WAVE3 — sample SEO landing pair similarity → seo-audit/
 * Usage: npx --yes tsx scripts/audit-seo-landing-similarity.ts
 */
import fs from "node:fs";
import path from "node:path";
import { buildSeoLandingSpecs } from "../src/lib/seo-landing/combinations";
import { buildSeoLandingContent } from "../src/lib/seo-landing/content";

const OUT_DIR = path.join(process.cwd(), "seo-audit");
const OUT_JSON = path.join(OUT_DIR, "wave34-seo-landing-similarity.json");
const OUT_CSV = path.join(OUT_DIR, "wave34-rebuild-c-sample.csv");

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

function stripGeo(s: string): string {
  return s
    .replace(
      /부산|해운대|센텀|동래|수영|사상|금정|기장|남구|북구|중구|서구|연제|부산진|강서|사하|영도|다옴법무사사무소|안윤정/g,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function band(score: number): string {
  const p = Math.round(score * 100);
  if (p >= 70) return "HIGH_DUPLICATE_RISK";
  if (p >= 55) return "REVIEW";
  return "acceptable";
}

function main() {
  const specs = buildSeoLandingSpecs();
  const byType = new Map<string, typeof specs>();
  for (const s of specs) {
    const list = byType.get(s.type) ?? [];
    list.push(s);
    byType.set(s.type, list);
  }

  // Sample up to 40 region-lawyer + 30 region-service for pair audit
  const sample = [
    ...(byType.get("region-lawyer") ?? []).slice(0, 40),
    ...(byType.get("region-service") ?? []).slice(0, 30),
    ...(byType.get("service-intent") ?? []).slice(0, 20),
  ];

  const docs = sample.map((spec) => {
    const c = buildSeoLandingContent(spec);
    const body = stripGeo(
      [
        c.intro,
        ...c.introParagraphs,
        ...c.sections.map(
          (x) => `${x.body}\n${(x.items ?? []).join("\n")}`,
        ),
        ...c.faqs.map((f) => `${f.question} ${f.answer}`),
      ].join("\n"),
    );
    return { path: spec.path, type: spec.type, body };
  });

  const pairs: Array<{
    a: string;
    b: string;
    type: string;
    similarity: number;
    band: string;
  }> = [];

  for (let i = 0; i < docs.length; i += 1) {
    for (let j = i + 1; j < docs.length; j += 1) {
      if (docs[i]!.type !== docs[j]!.type) continue;
      const score = jaccard(docs[i]!.body, docs[j]!.body);
      pairs.push({
        a: docs[i]!.path,
        b: docs[j]!.path,
        type: docs[i]!.type,
        similarity: Math.round(score * 1000) / 10,
        band: band(score),
      });
    }
  }

  pairs.sort((x, y) => y.similarity - x.similarity);
  const high = pairs.filter((p) => p.band === "HIGH_DUPLICATE_RISK");
  const review = pairs.filter((p) => p.band === "REVIEW");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sampleCount: docs.length,
        pairCount: pairs.length,
        highRiskCount: high.length,
        reviewCount: review.length,
        topPairs: pairs.slice(0, 40),
      },
      null,
      2,
    ),
    "utf8",
  );

  const rebuildRows = [
    "path,status,notes",
    ...Array.from(new Set(high.flatMap((p) => [p.a, p.b])))
      .slice(0, 80)
      .map(
        (p) =>
          `${p},REBUILD-C,geo-stripped pair similarity HIGH — template differentiated WAVE3/4`,
      ),
  ];
  fs.writeFileSync(OUT_CSV, rebuildRows.join("\n") + "\n", "utf8");

  console.log(
    JSON.stringify(
      {
        outJson: OUT_JSON,
        outCsv: OUT_CSV,
        sampleCount: docs.length,
        highRisk: high.length,
        review: review.length,
        top: pairs.slice(0, 5),
      },
      null,
      2,
    ),
  );
}

main();
