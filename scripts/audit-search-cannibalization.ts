/**
 * Query-cluster cannibalization audit — TOP candidates per target query.
 * Usage: npx --yes tsx scripts/audit-search-cannibalization.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  getChampionForTargetQuery,
  PAGE_RELATIONS,
} from "../src/data/seo/page-relations";
import { getSeoLandingSpecBySlug } from "../src/lib/seo-landing/combinations";
import { buildSeoLandingContent } from "../src/lib/seo-landing/content";
import { buildBusanLawyerFlagshipPage } from "../src/lib/local-landing/flagship-busan-lawyer";
import type { LocalLandingConfig } from "../src/types/local-landing";

const OUT = path.join(process.cwd(), "reports/seo/search-cannibalization-audit.json");

const TARGET_QUERIES = [
  "민락 법무사",
  "민락동 법무사",
  "민락역 법무사",
  "장산 법무사",
  "장산역 법무사",
  "전포동 법무사",
  "전포역 법무사",
  "양정 법무",
  "양정 법무사",
  "양정역 법무사",
  "복산동 법무사",
  "동래 복산동 법무사",
  "부산 법무사",
  "부산 저렴한 법무사",
  "부산 법무사 비용",
  "부산 법무사 추천",
  "부산 은행 법무사",
  "부산 은행 등기 법무사",
  "부산 잔금 법무사",
  "부산 근저당 법무사",
  "부산 아파트 잔금 등기",
  "부산 주택담보대출 등기",
  "대출 다 갚았는데 근저당",
  "잔금날 등기",
];

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1),
  );
}

function relevance(query: string, title: string, h1: string, body: string): number {
  const q = tokens(query);
  const doc = tokens(`${title} ${h1} ${body}`);
  let hit = 0;
  for (const t of q) if (doc.has(t)) hit += 1;
  return q.size === 0 ? 0 : hit / q.size;
}

type Candidate = { path: string; title: string; score: number };

function docForPath(path: string): { title: string; h1: string; body: string } | null {
  const slug = path.replace(/^\//, "");
  if (slug === "부산법무사") {
    const page = buildBusanLawyerFlagshipPage({
      slug: "부산법무사",
      regionKey: "busan",
      regionLabel: "부산",
      neighborhoods: [],
      serviceSlug: "inheritance-registration",
      pageType: "region-hub",
    } as LocalLandingConfig);
    return {
      title: page.metaTitle ?? page.title,
      h1: page.h1,
      body: [...(page.summaryParagraphs ?? []), page.problemStatement].join("\n"),
    };
  }
  const spec = getSeoLandingSpecBySlug(slug);
  if (spec) {
    const c = buildSeoLandingContent(spec);
    return {
      title: spec.title,
      h1: spec.h1,
      body: [c.intro, ...c.introParagraphs].join("\n"),
    };
  }
  const rel = PAGE_RELATIONS.find((p) => p.path === path);
  if (rel) {
    return { title: path, h1: path, body: (rel.notes ?? "") + rel.relatedPages.join(" ") };
  }
  return null;
}

function candidatesForQuery(query: string): Candidate[] {
  const pool = new Set<string>();
  for (const rel of PAGE_RELATIONS) {
    pool.add(rel.path);
    for (const r of rel.relatedPages) pool.add(r);
  }
  pool.add("/부산법무사");
  pool.add("/부산부동산등기");
  pool.add("/부산상속법무사");
  pool.add("/해운대법무사");
  pool.add("/수영구법무사");
  pool.add("/부산진구법무사");
  pool.add("/동래구법무사");
  pool.add("/좌동법무사");
  pool.add("/전포동법무사");

  const scored: Candidate[] = [];
  for (const p of pool) {
    const doc = docForPath(p);
    if (!doc) continue;
    scored.push({
      path: p,
      title: doc.title,
      score: Math.round(relevance(query, doc.title, doc.h1, doc.body) * 1000) / 10,
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5);
}

function main() {
  const rows = TARGET_QUERIES.map((query) => {
    const champion = getChampionForTargetQuery(query);
    const top = candidatesForQuery(query);
    const topScore = top[0]?.score ?? 0;
    const secondScore = top[1]?.score ?? 0;
    const cannibalizationRisk =
      top.length >= 2 &&
      top[0]!.path !== champion.champion &&
      secondScore >= topScore * 0.85
        ? "CANNIBALIZATION_RISK"
        : top[0]?.path !== champion.champion && topScore > 40
          ? "CHAMPION_SIGNAL_WEAK"
          : "OK";

    return {
      query,
      intent: champion.intent,
      champion: champion.champion,
      topCandidates: top,
      cannibalizationRisk,
      action:
        cannibalizationRisk === "CANNIBALIZATION_RISK"
          ? "STRENGTHEN_CHAMPION_INTERNAL_LINKS"
          : "KEEP_CHAMPION",
    };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    queryCount: rows.length,
    cannibalizationFlags: rows.filter((r) => r.cannibalizationRisk !== "OK").length,
    rows,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ out: OUT, flags: payload.cannibalizationFlags }, null, 2));
}

main();
