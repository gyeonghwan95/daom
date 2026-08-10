/**
 * 우선 클러스터 URL pair 유사도·캐니벌 리스크
 * 실행: npx --yes tsx scripts/audit-seo-cannibalization.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getKeywordTopic } from "../src/lib/local-landing/keyword-topics";
import { buildBusanLawyerFlagshipPage } from "../src/lib/local-landing/flagship-busan-lawyer";
import { buildBusanInheritanceRenunciationPage } from "../src/lib/local-landing/inheritance-renunciation-busan";
import type { LocalLandingConfig } from "../src/types/local-landing";

const OUT = path.join(process.cwd(), "reports/seo/cannibalization-pairs.json");

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

function risk(score: number): string {
  const p = Math.round(score * 100);
  if (p < 40) return "LOW";
  if (p < 60) return "WATCH";
  if (p < 75) return "CAUTION";
  return "HIGH";
}

function actionFor(riskBand: string, sameIntent: boolean): string {
  if (riskBand === "HIGH" && sameIntent) return "STRENGTHEN-HUB";
  if (riskBand === "CAUTION") return "INTERNAL-LINK-TO-CHAMPION";
  if (riskBand === "WATCH") return "STOP-NEW-PAGES";
  return "KEEP-BOTH";
}

type Doc = { path: string; title: string; h1: string; body: string; intent: string };

function fromTopic(slug: string, intent: string): Doc | null {
  const t = getKeywordTopic(slug);
  if (!t) return null;
  return {
    path: `/${t.slug}`,
    title: t.metaTitle,
    h1: t.h1,
    body: [t.problemStatement, ...t.summaryParagraphs].join("\n"),
    intent,
  };
}

function main() {
  const docs: Doc[] = [];
  const topicPairs: [string, string][] = [
    ["부산법인법무사", "CORPORATE_HUB"],
    ["부산상속법무사", "INHERITANCE_HUB"],
  ];
  for (const [slug, intent] of topicPairs) {
    const d = fromTopic(slug, intent);
    if (d) docs.push(d);
  }

  const flagship = buildBusanLawyerFlagshipPage({
    slug: "부산법무사",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: [],
    serviceSlug: "inheritance-registration",
    pageType: "region-hub",
  } as LocalLandingConfig);
  docs.push({
    path: flagship.path,
    title: flagship.metaTitle || flagship.title,
    h1: flagship.h1,
    body: (flagship.summaryParagraphs ?? []).join("\n"),
    intent: "BUSAN_MAIN",
  });

  const ren = buildBusanInheritanceRenunciationPage({
    slug: "부산상속포기",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: [],
    serviceSlug: "inheritance-renunciation",
    pageType: "service-region",
  } as LocalLandingConfig);
  docs.push({
    path: ren.path,
    title: ren.metaTitle || ren.title,
    h1: ren.h1,
    body: (ren.summaryParagraphs ?? []).join("\n"),
    intent: "INHERITANCE_RENUNCIATION",
  });

  // Static known cannibal pairs (specialist bridges — content may not be in keyword topics)
  const staticPairs = [
    {
      a: "/부산법인법무사",
      b: "/부산법인전문법무사",
      intentSimilarity: 0.85,
      note: "동일 Provider Selection. Champion 집중, 브리지 삭제 금지",
      action: "STRENGTHEN-HUB",
    },
    {
      a: "/부산법인법무사",
      b: "/부산기업법무사",
      intentSimilarity: 0.7,
      note: "기업 vs 법인 허브 유사",
      action: "INTERNAL-LINK-TO-CHAMPION",
    },
    {
      a: "/부산상속법무사",
      b: "/부산상속전문법무사",
      intentSimilarity: 0.8,
      note: "전문 브리지 — title HIGH RISK",
      action: "STRENGTHEN-HUB",
    },
    {
      a: "/부산상속법무사",
      b: "/부산상속법무사추천",
      intentSimilarity: 0.75,
      note: "추천 Spoke KEEP, Champion=/부산상속법무사",
      action: "INTERNAL-LINK-TO-CHAMPION",
    },
    {
      a: "/부산법무사",
      b: "/부산법무사추천",
      intentSimilarity: 0.7,
      note: "추천 Spoke KEEP",
      action: "INTERNAL-LINK-TO-CHAMPION",
    },
    {
      a: "/부산상속포기",
      b: "/부산한정승인",
      intentSimilarity: 0.45,
      note: "Intent 분리 PASS",
      action: "KEEP-BOTH",
    },
  ];

  const computed = [];
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const a = docs[i]!;
      const b = docs[j]!;
      const titleSim = jaccard(a.title, b.title);
      const h1Sim = jaccard(a.h1, b.h1);
      const bodySim = jaccard(a.body.slice(0, 500), b.body.slice(0, 500));
      const intentSim = a.intent === b.intent ? 1 : jaccard(a.intent, b.intent);
      const composite = titleSim * 0.2 + h1Sim * 0.2 + bodySim * 0.4 + intentSim * 0.2;
      const band = risk(composite);
      computed.push({
        urlA: a.path,
        urlB: b.path,
        titleSimilarity: Math.round(titleSim * 100),
        h1Similarity: Math.round(h1Sim * 100),
        bodySimilarity: Math.round(bodySim * 100),
        intentSimilarity: Math.round(intentSim * 100),
        risk: band,
        action: actionFor(band, a.intent === b.intent),
      });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    computedPairs: computed,
    curatedPairs: staticPairs,
    policy: "DELETE/REDIRECT 자동 수행 금지. HIGH도 MANUAL-REVIEW.",
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote", OUT, "computed", computed.length, "curated", staticPairs.length);
}

main();
