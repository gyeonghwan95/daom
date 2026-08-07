/**
 * 양산 클러스터 품질·중복 검사
 * 실행: npx --yes tsx scripts/audit-yangsan-content.ts
 */
import {
  getAllGyeongnamDefs,
  getPublishedGyeongnamDefs,
  scoreGyeongnamLanding,
} from "../src/lib/gyeongnam-cases";
import { phaseYangsanClusterDefs } from "../src/lib/gyeongnam-cases/phase-yangsan-cluster";

function stripRegion(text: string): string {
  return text
    .replace(/양산시?/g, "[REGION]")
    .replace(/물금|증산|사송|웅상|동면|원동|상북|하북/g, "[AREA]")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenJaccard(a: string, b: string): number {
  const ta = new Set(stripRegion(a).split(/\s+/).filter((t) => t.length > 1));
  const tb = new Set(stripRegion(b).split(/\s+/).filter((t) => t.length > 1));
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function main() {
  const all = getAllGyeongnamDefs();
  const published = getPublishedGyeongnamDefs();
  const yangsan = published.filter(
    (d) =>
      d.regionName === "양산" ||
      d.parentRegion === "양산" ||
      /양산|물금|증산|사송/.test(d.slug),
  );

  console.log("=== Yangsan Content Audit ===");
  console.log(`published gyeongnam: ${published.length}`);
  console.log(`yangsan-related published: ${yangsan.length}`);
  console.log(`phase-yangsan-cluster defs: ${phaseYangsanClusterDefs.length}`);

  const issues: string[] = [];
  const titles = new Map<string, string>();

  for (const def of yangsan) {
    const score = scoreGyeongnamLanding(def, all);
    if (score.total < 80) {
      issues.push(`quality ${score.total} < 80: /업무사례/${def.slug}`);
    }
    const t = def.seoTitle.trim();
    if (titles.has(t)) {
      issues.push(`동일 title: ${def.slug} ↔ ${titles.get(t)}`);
    } else titles.set(t, def.slug);
  }

  console.log("\n[Phase cluster nearest similarity]");
  for (const page of phaseYangsanClusterDefs) {
    let best = { slug: "", sim: 0 };
    for (const other of yangsan) {
      if (other.slug === page.slug) continue;
      const sim = tokenJaccard(page.heroDescription, other.heroDescription);
      if (sim > best.sim) best = { slug: other.slug, sim };
    }
    console.log(
      `/${page.slug} → nearest /${best.slug} (${(best.sim * 100).toFixed(1)}%) score=${scoreGyeongnamLanding(page, all).total}`,
    );
    if (best.sim >= 0.8) {
      issues.push(`region-stripped similarity ${(best.sim * 100).toFixed(0)}%: ${page.slug} ≈ ${best.slug}`);
    }
  }

  // 읍·동 법무사 클론 금지 신호
  for (const def of all) {
    if (/^(물금|웅상|덕계|동면|평산)법무사$/.test(def.slug)) {
      issues.push(`지역명만 바꾼 법무사 클론 후보: ${def.slug}`);
    }
  }

  console.log(`\nissues: ${issues.length}`);
  for (const i of issues) console.log(`[issue] ${i}`);
  if (issues.some((i) => i.includes("quality") || i.includes("동일 title") || i.includes("similarity"))) {
    process.exitCode = 1;
  }
}

main();
