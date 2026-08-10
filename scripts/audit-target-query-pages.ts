/**
 * 우선 Query 6종 → Champion 선정·점수·원인 진단
 * 실행: npx --yes tsx scripts/audit-target-query-pages.ts
 *
 * 공개 페이지에 「전문 법무사」를 삽입하지 않는다. targetQuery는 분석용.
 */
import fs from "node:fs";
import path from "node:path";
import { buildKeywordHubPage } from "../src/lib/local-landing/keyword-builder";
import { buildBusanLawyerFlagshipPage } from "../src/lib/local-landing/flagship-busan-lawyer";
import { buildBusanInheritanceRenunciationPage } from "../src/lib/local-landing/inheritance-renunciation-busan";
import { buildBusanCorporateRegistrationPage } from "../src/lib/local-landing/corporate-registration-busan";
import type { LocalLandingConfig, LocalLandingPage } from "../src/types/local-landing";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, "reports/seo/priority-query-audit.json");
const OUT_HTML = path.join(ROOT, "reports/seo/priority-query-audit.html");

type ScoreBreakdown = {
  titleMatch: number;
  h1Match: number;
  first300: number;
  h2Coverage: number;
  intentMatch: number;
  uniqueInfo: number;
  internalAuthority: number;
  businessRelevance: number;
  trust: number;
  technical: number;
  total: number;
};

type Candidate = {
  path: string;
  role: string;
  title: string;
  h1: string;
  description: string;
  bodyChars: number;
  faqCount: number;
  outbound: number;
  scores: ScoreBreakdown;
  cannibalizationRisk: string;
  championCandidate: boolean;
};

function jaccard(a: string, b: string): number {
  const tok = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter((t) => t.length > 1),
    );
  const ta = tok(a);
  const tb = tok(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function clamp10(n: number): number {
  return Math.max(0, Math.min(10, Math.round(n)));
}

function baseConfig(slug: string): LocalLandingConfig {
  return {
    slug,
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: [],
    serviceSlug: "corporate-registration",
    pageType: "keyword-hub",
  } as LocalLandingConfig;
}

function pageBlob(p: LocalLandingPage): string {
  return [
    p.problemStatement,
    ...(p.summaryParagraphs ?? []),
    ...(p.procedures ?? []),
    ...(p.whenNeeded ?? []),
    ...(p.faqs ?? []).map((f) => f.question + f.answer),
  ].join("\n");
}

function scorePage(
  page: LocalLandingPage,
  query: string,
  intentHints: string[],
  outboundBoost: number,
): ScoreBreakdown {
  const blob = pageBlob(page);
  const first300 = blob.replace(/\s+/g, " ").slice(0, 300);
  const q = query.replace(/\s+/g, "");
  const title = page.metaTitle || page.title;
  const h1 = page.h1;

  const titleMatch = clamp10(jaccard(title, query) * 12 + (title.includes("부산") ? 2 : 0));
  const h1Match = clamp10(jaccard(h1, query) * 12);
  const first300Score = clamp10(
    intentHints.reduce((acc, h) => acc + (first300.includes(h) ? 2 : 0), 0) +
      (first300.includes("부산") ? 1 : 0),
  );
  const h2Coverage = clamp10(
    intentHints.filter((h) => blob.includes(h)).length * 1.5,
  );
  const intentMatch = clamp10(
    intentHints.filter((h) => blob.includes(h)).length * 2.2 +
      (blob.replace(/\s+/g, "").includes(q.slice(0, 6)) ? 2 : 0),
  );
  const uniqueInfo = clamp10((page.faqs?.length ?? 0) / 2 + (page.procedures?.length ?? 0) / 3);
  const internalAuthority = clamp10(
    ((page.relatedServiceLinks?.length ?? 0) + outboundBoost) / 3,
  );
  const businessRelevance = clamp10(
    blob.includes("다옴") || blob.includes("안윤정") ? 8 : 4,
  );
  const trust = clamp10(
    (blob.includes("최종확인일") || blob.includes("작성·검토") ? 3 : 0) +
      (blob.includes("법무사") ? 2 : 0),
  );
  const technical = 5; // static SSG assumed for landing pages

  const total =
    titleMatch +
    h1Match +
    first300Score +
    h2Coverage +
    intentMatch * 2 + // Intent Match 20
    uniqueInfo +
    internalAuthority +
    businessRelevance +
    trust +
    technical;

  return {
    titleMatch,
    h1Match,
    first300: first300Score,
    h2Coverage,
    intentMatch: intentMatch * 2,
    uniqueInfo,
    internalAuthority,
    businessRelevance,
    trust,
    technical,
    total: Math.min(100, total),
  };
}

function toCandidate(
  page: LocalLandingPage,
  role: string,
  query: string,
  hints: string[],
  champion: boolean,
): Candidate {
  const blob = pageBlob(page);
  return {
    path: page.path,
    role,
    title: page.metaTitle || page.title,
    h1: page.h1,
    description: page.description,
    bodyChars: blob.replace(/\s+/g, "").length,
    faqCount: page.faqs?.length ?? 0,
    outbound: page.relatedServiceLinks?.length ?? 0,
    scores: scorePage(page, query, hints, 0),
    cannibalizationRisk: "see pair audit",
    championCandidate: champion,
  };
}

function loadPage(slug: string): LocalLandingPage | null {
  if (slug === "부산법무사") {
    return buildBusanLawyerFlagshipPage(baseConfig(slug));
  }
  if (slug === "부산상속포기") {
    return buildBusanInheritanceRenunciationPage({
      ...baseConfig(slug),
      serviceSlug: "inheritance-renunciation",
      pageType: "service-region",
    } as LocalLandingConfig);
  }
  if (slug === "부산법인등기") {
    try {
      return buildBusanCorporateRegistrationPage({
        ...baseConfig(slug),
        serviceSlug: "corporate-registration",
        pageType: "service-region",
      } as LocalLandingConfig);
    } catch {
      return null;
    }
  }
  return buildKeywordHubPage({
    ...baseConfig(slug),
    keywordKey: slug,
  });
}

const QUERIES = [
  {
    query: "부산 법인 법무사",
    intent: "CORPORATE_PROVIDER",
    champion: "/부산법인법무사",
    candidates: [
      "부산법인법무사",
      "부산법인등기",
      "부산법인전문법무사",
      "부산기업법무사",
      "법인변경등기",
    ],
    hints: ["설립", "임원변경", "본점이전", "증자", "해산", "정관", "법인"],
    diagnosis: {
      primary: "CANNIBALIZATION",
      secondary: "WEAK-CHAMPION",
      notes:
        "법인 허브·등기·전문·기업 페이지가 신호를 나눔. Champion=/부산법인법무사 로 집중(전문 phrase 미사용).",
    },
  },
  {
    query: "부산 법인전문 법무사",
    intent: "CORPORATE_PROVIDER_DEPTH",
    champion: "/부산법인법무사",
    candidates: ["부산법인법무사", "부산법인전문법무사", "부산법인등기전문", "부산법인등기"],
    hints: ["설립", "임원변경", "본점이전", "정관", "의사록", "과태료", "법인"],
    diagnosis: {
      primary: "CANNIBALIZATION",
      secondary: "AUTHORITY/CONTENT-GAP",
      notes: "exact phrase 공개 삽입 금지. 업무 깊이 모듈로 Intent 충족.",
    },
  },
  {
    query: "부산 법무사 법인전문",
    intent: "CORPORATE_PROVIDER_DEPTH",
    champion: "/부산법인법무사",
    candidates: ["부산법인법무사", "부산법인전문법무사", "부산법무사"],
    hints: ["법인", "설립", "임원", "본점", "해산"],
    diagnosis: {
      primary: "CANNIBALIZATION",
      secondary: "WEAK-CHAMPION",
      notes: "Query2와 동일 Champion.",
    },
  },
  {
    query: "부산 상속포기 법무사",
    intent: "INHERITANCE_RENUNCIATION",
    champion: "/부산상속포기",
    candidates: ["부산상속포기", "부산상속법무사", "부산한정승인", "부산상속법무사추천"],
    hints: ["상속포기", "3개월", "후순위", "가정법원", "한정승인", "처분"],
    diagnosis: {
      primary: "AUTHORITY/CONTENT-GAP",
      secondary: "WEAK-CHAMPION",
      notes: "독립 페이지 존재. 신규 불필요. 타임라인·FAQ SAFE 보강.",
    },
  },
  {
    query: "부산 상속 법무사 추천",
    intent: "INHERITANCE_PROVIDER_SELECTION",
    champion: "/부산상속법무사",
    candidates: ["부산상속법무사", "부산상속법무사추천", "부산상속전문법무사", "부산법무사"],
    hints: ["상속등기", "상속포기", "한정승인", "맡기기", "절차", "선택"],
    diagnosis: {
      primary: "CANNIBALIZATION",
      secondary: "AUTHORITY/CONTENT-GAP",
      notes: "별도 추천 URL 신규 금지. Champion에 선택 기준 모듈 유지·강화.",
    },
  },
  {
    query: "부산 법무사 추천",
    intent: "BUSAN_PROVIDER_SELECTION",
    champion: "/부산법무사",
    candidates: ["부산법무사", "부산법무사추천", "부산상속법무사", "부산법인법무사"],
    hints: ["상속", "법인", "부동산", "회생", "선택", "업무"],
    diagnosis: {
      primary: "CANNIBALIZATION",
      secondary: "WEAK-CHAMPION",
      notes: "Flagship=/부산법무사. /부산법무사추천은 선택기준 Spoke로 KEEP.",
    },
  },
] as const;

function main() {
  const published = new Set(getAllPublishedPaths());
  const results = QUERIES.map((q) => {
    const cands: Candidate[] = [];
    for (const slug of q.candidates) {
      const page = loadPage(slug);
      if (!page) continue;
      const isChamp = `/${slug}` === q.champion || page.path === q.champion;
      cands.push(toCandidate(page, slug, q.query, [...q.hints], isChamp));
    }
    cands.sort((a, b) => b.scores.total - a.scores.total);
    return {
      query: q.query,
      intent: q.intent,
      champion: q.champion,
      championPublished: published.has(q.champion),
      diagnosis: q.diagnosis,
      newPageNeeded: false,
      topCandidates: cands.slice(0, 5),
    };
  });

  const champions = {
    corporate: "/부산법인법무사",
    renunciation: "/부산상속포기",
    inheritance: "/부산상속법무사",
    busanMain: "/부산법무사",
  };

  const report = {
    generatedAt: new Date().toISOString(),
    frozenPaths: published.size,
    champions,
    queries: results,
    linkGraph: {
      home: "/",
      busanMain: champions.busanMain,
      corporate: {
        hub: champions.corporate,
        spokes: [
          "/부산법인설립등기",
          "/부산임원변경등기",
          "/부산본점이전등기",
          "/부산사업목적변경등기",
          "/부산유상증자등기",
          "/부산법인해산청산등기",
        ],
      },
      inheritance: {
        hub: champions.inheritance,
        spokes: [
          "/부산상속등기",
          "/부산상속포기",
          "/부산한정승인",
          "/부산상속재산분할법무사",
        ],
      },
    },
    rules: {
      noUrlDelete: true,
      noSpecialistPhraseOnChampions: true,
      noNewRecommendUrls: true,
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), "utf8");

  const rows = results
    .map((r) => {
      const top = r.topCandidates
        .map(
          (c) =>
            `<tr><td>${c.path}</td><td>${c.scores.total}</td><td>${c.scores.intentMatch}</td><td>${c.faqCount}</td><td>${c.championCandidate ? "YES" : ""}</td></tr>`,
        )
        .join("");
      return `<h2>${r.query}</h2><p>Champion: <b>${r.champion}</b> · ${r.diagnosis.primary} / ${r.diagnosis.secondary}</p><table border="1" cellpadding="4"><tr><th>URL</th><th>Total</th><th>Intent</th><th>FAQ</th><th>Champ?</th></tr>${top}</table>`;
    })
    .join("\n");

  fs.writeFileSync(
    OUT_HTML,
    `<!doctype html><html lang="ko"><meta charset="utf-8"><title>Priority Query Audit</title><body><h1>Priority Query Audit 2026-08-10</h1>${rows}</body></html>`,
    "utf8",
  );

  console.log("Wrote", OUT_JSON);
  console.log("Wrote", OUT_HTML);
  for (const r of results) {
    console.log(
      r.query,
      "→",
      r.champion,
      "top=",
      r.topCandidates[0]?.path,
      r.topCandidates[0]?.scores.total,
    );
  }
}

main();
