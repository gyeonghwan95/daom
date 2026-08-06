/**
 * 법인 클러스터 본문 유사도(간단 문자 Jaccard) 검사.
 * 실행: npx --yes tsx scripts/check-corporate-content-similarity.ts
 */
import { corporatePages } from "../src/lib/corporate-intent/content";

function textOf(page: (typeof corporatePages)[number]): string {
  return [
    page.heroIntro,
    ...page.heroParagraphs,
    page.conclusion,
    ...page.whoNeedsThis,
    ...page.procedures,
    ...page.documents,
  ]
    .join(" ")
    .replace(/\s+/g, "");
}

function jaccard(a: string, b: string): number {
  const ta = new Set(a.split(""));
  const tb = new Set(b.split(""));
  let inter = 0;
  for (const ch of ta) if (tb.has(ch)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function main() {
  const threshold = 0.9;
  const hits: string[] = [];

  for (let i = 0; i < corporatePages.length; i++) {
    for (let j = i + 1; j < corporatePages.length; j++) {
      const a = corporatePages[i];
      const b = corporatePages[j];
      const sim = jaccard(textOf(a), textOf(b));
      if (sim >= threshold) {
        hits.push(
          `유사도 ${sim.toFixed(2)}: /${a.slug} ↔ /${b.slug}`,
        );
      }
    }
  }

  console.log("=== Corporate Content Similarity ===");
  console.log(`pages: ${corporatePages.length}, threshold: ${threshold}`);
  console.log(`high-similarity pairs: ${hits.length}`);
  for (const hit of hits) console.log(`[warn] ${hit}`);
  if (hits.length > 0) process.exitCode = 1;
}

main();
