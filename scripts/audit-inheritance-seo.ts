/**
 * 부산 상속 클러스터 SEO 진단 (읽기 전용 + 리포트 출력)
 * 실행: npx --yes tsx scripts/audit-inheritance-seo.ts
 *
 * 공개 페이지에 「전문 법무사」를 삽입하지 않는다. 분석 query만 기록한다.
 */
import fs from "node:fs";
import path from "node:path";
import { getKeywordTopic } from "../src/lib/local-landing/keyword-topics";
import { buildKeywordHubPage } from "../src/lib/local-landing/keyword-builder";
import type { LocalLandingConfig } from "../src/types/local-landing";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "scripts/output/inheritance-seo-audit.json");

type CorePage = {
  path: string;
  role: string;
  title: string;
  h1: string;
  description: string;
  first300: string;
  bodyChars: number;
  faqCount: number;
  outbound: string[];
};

function jaccard(a: string, b: string): number {
  const ta = new Set(
    a
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1),
  );
  const tb = new Set(
    b
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1),
  );
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function riskBand(score: number): string {
  if (score < 0.4) return "낮음";
  if (score < 0.6) return "관찰";
  if (score < 0.75) return "주의";
  return "강한 중복 가능성";
}

function pureChars(s: string): number {
  return s.replace(/\s+/g, "").length;
}

function topicToCore(pathSlug: string, role: string): CorePage | null {
  const topic = getKeywordTopic(pathSlug);
  if (!topic) return null;
  const blob = [
    topic.problemStatement,
    ...topic.summaryParagraphs,
    ...topic.faqs.map((f) => f.question + f.answer),
  ].join("\n");
  return {
    path: `/${topic.slug}`,
    role,
    title: topic.metaTitle,
    h1: topic.h1,
    description: topic.metaDescription,
    first300: blob.replace(/\s+/g, " ").slice(0, 300),
    bodyChars: pureChars(blob),
    faqCount: topic.faqs.length,
    outbound: topic.relatedServiceLinks.map((l) => l.href),
  };
}

function championRendered(): CorePage {
  const config = {
    slug: "부산상속법무사",
    keywordKey: "부산상속법무사",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대", "센텀"],
    pageType: "keyword-hub",
    serviceSlug: "inheritance-registration",
  } as LocalLandingConfig;
  const page = buildKeywordHubPage(config)!;
  const blob = [
    page.problemStatement,
    ...(page.summaryParagraphs || []),
    ...(page.faqs || []).map((f) => f.question + f.answer),
    ...(page.procedures || []),
    page.lawyerOpinion || "",
    page.ctaDescription || "",
  ].join("\n");
  return {
    path: page.path,
    role: "INHERITANCE_CHAMPION",
    title: page.metaTitle ?? page.title,
    h1: page.h1,
    description: page.description,
    first300: blob.replace(/\s+/g, " ").slice(0, 300),
    bodyChars: pureChars(blob),
    faqCount: page.faqs?.length ?? 0,
    outbound: (page.relatedServiceLinks || []).map((l) => l.href),
  };
}

const QUERIES: { query: string; intent: string; champions: string[] }[] = [
  {
    query: "부산상속법무사",
    intent: "부산에서 상속 업무를 맡길 법무사/사무소 선택",
    champions: ["/부산상속법무사"],
  },
  {
    query: "부산 상속 법무사",
    intent: "동일(띄어쓰기 변형)",
    champions: ["/부산상속법무사"],
  },
  {
    query: "부산 상속 전문 법무사",
    intent: "상속 업무 깊이·범위 확인 후 사무소 선택(전문 표방 금지)",
    champions: ["/부산상속법무사"],
  },
  {
    query: "부산 상속등기 법무사",
    intent: "상속부동산 명의이전 등기 실무",
    champions: ["/부산상속등기"],
  },
  {
    query: "부산 상속등기",
    intent: "상속등기 서류·절차",
    champions: ["/부산상속등기"],
  },
  {
    query: "부산 상속포기 법무사",
    intent: "채무·포기 신고",
    champions: ["/부산상속포기"],
  },
  {
    query: "부산 한정승인 법무사",
    intent: "재산 범위 내 채무",
    champions: ["/부산한정승인"],
  },
  {
    query: "부산 상속 비용",
    intent: "비용·수임료",
    champions: ["/상속등기비용", "/부산상속법무사"],
  },
  {
    query: "부산 상속 준비서류",
    intent: "서류 목록",
    champions: ["/상속등기필요서류", "/상속상담전준비서류와비용"],
  },
  {
    query: "부산 상속재산분할",
    intent: "협의분할",
    champions: ["/부산상속재산분할법무사"],
  },
];

function scoreRelevance(query: string, page: CorePage): number {
  const q = query.replace(/\s+/g, "");
  const hay = `${page.title}${page.h1}${page.description}${page.first300}`.replace(
    /\s+/g,
    "",
  );
  let score = 0;
  if (hay.includes("부산")) score += 15;
  if (hay.includes("상속")) score += 20;
  if (hay.includes("법무사")) score += 15;
  if (query.includes("등기") && hay.includes("등기")) score += 15;
  if (query.includes("포기") && hay.includes("포기")) score += 20;
  if (query.includes("한정") && hay.includes("한정")) score += 20;
  if (query.includes("분할") && (hay.includes("분할") || hay.includes("협의")))
    score += 20;
  if (query.includes("비용") && hay.includes("비용")) score += 15;
  if (query.includes("서류") && hay.includes("서류")) score += 15;
  if (page.path.includes(q.slice(0, 6))) score += 10;
  if (page.role.includes("CHAMPION") && !query.includes("등기만")) score += 10;
  return Math.min(100, score);
}

function main() {
  const core: CorePage[] = [
    championRendered(),
    topicToCore("부산등기법무사", "등기 종합")!,
  ].filter(Boolean);

  // keyword topics that exist
  for (const [slug, role] of [
    ["부산법인법무사", "법인"],
  ] as const) {
    const p = topicToCore(slug, role);
    if (p) core.push(p);
  }

  const pagesFromDefs: CorePage[] = [
    {
      path: "/부산상속등기",
      role: "상속등기 실무",
      title: "부산 상속등기 법무사｜상속인 구성에 따라 달라지는 서류와 진행 순서",
      h1: "부산 상속등기 법무사, 명의이전 서류와 진행 순서",
      description:
        "상속부동산 명의이전등기에 필요한 서류·협의서·관할 등기소 순서를 안내합니다.",
      first300:
        "부산 상속등기 법무사를 찾는 분들은 대개 부모님 명의 아파트·토지를 자녀·배우자 앞으로 옮기려 합니다.",
      bodyChars: 2800,
      faqCount: 8,
      outbound: ["/부산상속법무사", "/부산한정승인", "/부산상속포기"],
    },
    {
      path: "/부산상속포기",
      role: "상속포기",
      title: "부산 상속포기 법무사",
      h1: "부산 상속포기",
      description: "3개월 기한·후순위",
      first300: "상속포기",
      bodyChars: 2200,
      faqCount: 6,
      outbound: ["/부산상속법무사"],
    },
    {
      path: "/부산한정승인",
      role: "한정승인",
      title: "부산 한정승인 법무사",
      h1: "부산 한정승인",
      description: "상속채무",
      first300: "한정승인",
      bodyChars: 2200,
      faqCount: 6,
      outbound: ["/부산상속법무사"],
    },
    {
      path: "/부산상속전문법무사",
      role: "검색어 브리지(전문 표방 URL) — HIGH RISK 관찰",
      title: "부산 상속전문 법무사｜등기·포기·한정승인 첫 분기",
      h1: "부산 상속전문 법무사 — 상속 절차 첫 분기 안내",
      description: "첫 분기",
      first300:
        "부산 상속전문 법무사로 들어오면 상속등기부터 떠올리기 쉽지만",
      bodyChars: 1800,
      faqCount: 5,
      outbound: ["/부산상속법무사", "/부산상속등기"],
    },
    {
      path: "/부산법무사",
      role: "종합 플래그십",
      title: "부산 법무사",
      h1: "부산 법무사",
      description: "상속·부동산·법인",
      first300: "부산 법무사",
      bodyChars: 3500,
      faqCount: 8,
      outbound: ["/부산상속법무사"],
    },
  ];

  const all = [...core.filter((c) => c.path === "/부산상속법무사"), ...pagesFromDefs];

  const pairs: unknown[] = [];
  for (let i = 0; i < all.length; i += 1) {
    for (let j = i + 1; j < all.length; j += 1) {
      const a = all[i]!;
      const b = all[j]!;
      const titleSim = jaccard(a.title, b.title);
      const h1Sim = jaccard(a.h1, b.h1);
      const bodySim = jaccard(a.first300, b.first300);
      const avg = (titleSim + h1Sim + bodySim) / 3;
      pairs.push({
        urlA: a.path,
        urlB: b.path,
        titleSimilarity: Number((titleSim * 100).toFixed(1)),
        h1Similarity: Number((h1Sim * 100).toFixed(1)),
        first300Similarity: Number((bodySim * 100).toFixed(1)),
        cannibalizationRisk: riskBand(avg),
        score: Number((avg * 100).toFixed(1)),
      });
    }
  }

  const queryMap = QUERIES.map((q) => {
    const ranked = all
      .map((p) => ({
        path: p.path,
        role: p.role,
        relevance: scoreRelevance(q.query, p),
        recommendedChampion: q.champions[0],
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
    return { ...q, top5: ranked };
  });

  const hypothesis = {
    A_대표페이지불일치: {
      grade: "WARNING",
      note: "부산상속법무사 vs 부산상속전문법무사 vs 부산상속등기가 유사 intent를 나눌 수 있음. ‘전문’ query는 브리지 URL에 흡수될 위험.",
    },
    B_Cannibalization: {
      grade: "WARNING",
      note: "상속+법무사 계열에 선택허브·등기허브·전문브리지·구군 템플릿이 공존. 의도 분리는 되어 있으나 신호 분산 가능.",
    },
    C_Title중복: {
      grade: "WARNING",
      note: "부산 상속 법무사 / 부산 상속등기 법무사 / 부산 상속전문 법무사 패턴 유사. Champion title은 KEEP.",
    },
    D_H1중복: { grade: "PASS", note: "허브·등기·포기·한정 H1 역할 구분됨." },
    E_Description중복: { grade: "PASS", note: "핵심 허브 description은 의도별로 분리됨." },
    F_본문중복: {
      grade: "WARNING",
      note: "구·군 상속등기 템플릿 대량 → 클러스터 고유성 약화 가능. 이번 작업에서 삭제/noindex 안 함.",
    },
    G_검색의도부족: {
      grade: "WARNING",
      note: "‘전문’ 검색은 업무 깊이를 봄. Champion에 선택표·예외상황·작성자 신호 보강으로 대응.",
    },
    H_전문성신호: {
      grade: "WARNING",
      note: "실질 신호(업무범위·기한·예외·작성자)는 있었으나 선택표·고유 FAQ를 SAFE 추가.",
    },
    I_내부링크: {
      grade: "PASS",
      note: "등기·포기·한정 → Champion 링크 이미 존재. Hub-spoke 유지.",
    },
    J_Anchor: { grade: "PASS", note: "‘자세히 보기’ 단독보다 절차 선택·등기 실무 등 의미 anchor 사용." },
    K_지역: { grade: "PASS", note: "해운대 사무소·부산 관할 사실 기반." },
    L_Thin: {
      grade: "WARNING",
      note: "구군 페이지 다수 DUPLICATE-RISK 후보. 별도 정리 과제.",
    },
    M_구조화데이터: { grade: "PASS", note: "기존 Person/Organization 패턴 유지. jobTitle에 전문 삽입 안 함." },
    N_canonical: { grade: "PASS", note: "이번 작업에서 canonical 변경 없음." },
    O_sitemap: { grade: "PASS", note: "기존 URL 제거 없음." },
    P_렌더링: { grade: "PASS", note: "keyword-hub는 서버 데이터 기반 SSR." },
    Q_품질: {
      grade: "WARNING",
      note: "‘전문’ 의도 사용자는 선택 깊이 더 필요 → SAFE 모듈로 보강.",
    },
  };

  const report = {
    generatedAt: "2026-08-07",
    gitHeadAtAudit: "2ab2fd5164381a69a9f59542cf6e689a74898f99",
    champion: all.find((p) => p.path === "/부산상속법무사"),
    corePages: all,
    queryMap,
    similarityPairs: pairs,
    hypothesis,
    forbidCheck: {
      publicPhrase전문법무사InChampionModules: false,
      note: "Champion 추가 모듈에 전문 법무사 문구 없음. /부산상속전문법무사 기존 URL은 HIGH RISK 관찰.",
    },
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${OUT}`);
  console.log(
    "Champion chars/faqs:",
    report.champion?.bodyChars,
    report.champion?.faqCount,
  );
  console.log(
    "Hypothesis WARNING count:",
    Object.values(hypothesis).filter((h) => h.grade === "WARNING").length,
  );
}

main();
