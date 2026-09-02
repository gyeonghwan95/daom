/**
 * 내부 의도 감사 — 기대 owner가 후보 URL 중 1위인지 확인.
 * 검색엔진 순위를 추정·보장하지 않는다.
 * 실행: npx --yes tsx scripts/inheritance-intent-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import type { LocalLandingConfig } from "../src/types/local-landing";
import { buildKeywordHubPage } from "../src/lib/local-landing/keyword-builder";
import { buildBusanInheritanceRegistrationPage } from "../src/lib/local-landing/inheritance-registration-busan";
import { buildBusanInheritanceRenunciationPage } from "../src/lib/local-landing/inheritance-renunciation-busan";
import { buildBusanQualifiedAcceptancePage } from "../src/lib/local-landing/qualified-acceptance-busan";
import { HOME_H1, HOME_METADATA_TITLE } from "../src/lib/seo/metadata";
import { 부산법무사상담 } from "../src/lib/local-landing/selection/topics/busan-consult";
import { getInheritanceArticleSummary } from "../src/lib/inheritance/article-summaries";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "seo/inheritance");

const busan: Pick<
  LocalLandingConfig,
  "regionKey" | "regionLabel" | "neighborhoods"
> = {
  regionKey: "busan",
  regionLabel: "부산",
  neighborhoods: ["해운대구", "센텀"],
};

type Candidate = {
  path: string;
  title: string;
  h1: string;
  body: string;
};

const EXPECTED: { query: string; owner: string }[] = [
  { query: "부산 상속전문 법무사", owner: "/부산상속법무사" },
  { query: "부산 상속 전문 법무사", owner: "/부산상속법무사" },
  { query: "부산 상속 법무사", owner: "/부산상속법무사" },
  { query: "부산 법무사 상속", owner: "/부산상속법무사" },
  { query: "부산 상속포기 법무사", owner: "/부산상속포기" },
  { query: "부산 상속포기", owner: "/부산상속포기" },
  { query: "부산 한정승인 법무사", owner: "/부산한정승인" },
  { query: "부산 한정승인", owner: "/부산한정승인" },
  { query: "부산 상속등기 법무사", owner: "/부산상속등기" },
  { query: "부산 상속등기", owner: "/부산상속등기" },
  { query: "부산 법무사 상담", owner: "/부산법무사상담" },
  { query: "부산 법무사", owner: "/" },
];

function compact(s: string): string {
  return s.replace(/\s+/g, "");
}

const NOINDEX_PATHS = new Set(["/부산상속전문법무사"]);

const TITLE_MODIFIERS = ["상담", "추천"];

function score(candidate: Candidate, query: string): number {
  const hay = `${candidate.title}\n${candidate.h1}\n${candidate.body}`;
  const hayCompact = compact(hay);
  const queryCompact = compact(query);
  let n = 0;
  if (hayCompact.includes(queryCompact)) n += 80;
  if (compact(candidate.title).includes(queryCompact)) n += 40;
  if (compact(candidate.h1).includes(queryCompact)) n += 30;
  if (candidate.path !== "/" && queryCompact.includes(compact(candidate.path.slice(1)))) {
    n += 20;
  }
  for (const token of query.split(/\s+/).filter((t) => t.length > 1)) {
    const count = hay.split(token).length - 1;
    n += Math.min(count, 8) * 4;
  }
  for (const modifier of TITLE_MODIFIERS) {
    if (!query.includes(modifier) && (candidate.title.includes(modifier) || candidate.h1.includes(modifier))) {
      n -= 60;
    }
  }
  if (candidate.path === "/" && query === "부산 법무사") {
    n += 80;
  }
  return n;
}

function fromLanding(page: {
  path: string;
  title: string;
  metaTitle?: string;
  h1: string;
  description: string;
  problemStatement: string;
  summaryParagraphs?: string[];
  faqs?: { question: string; answer: string }[];
  extraPageSections?: { title: string; body: string }[];
}): Candidate {
  const extra = getInheritanceArticleSummary(page.path.replace(/^\//, ""));
  return {
    path: page.path,
    title: page.metaTitle ?? page.title,
    h1: page.h1,
    body: [
      page.description,
      page.problemStatement,
      ...(page.summaryParagraphs ?? []),
      ...(page.extraPageSections ?? []).map((s) => `${s.title} ${s.body}`),
      ...(page.faqs ?? []).map((f) => `${f.question} ${f.answer}`),
      extra?.conclusion ?? "",
    ].join("\n"),
  };
}

function candidates(): Candidate[] {
  const champion = buildKeywordHubPage({
    slug: "부산상속법무사",
    keywordKey: "부산상속법무사",
    pageType: "keyword-hub",
    serviceSlug: "inheritance-registration",
    ...busan,
  } as LocalLandingConfig)!;
  const registration = buildBusanInheritanceRegistrationPage({
    slug: "부산상속등기",
    serviceSlug: "inheritance-registration",
    ...busan,
  } as LocalLandingConfig);
  const renunciation = buildBusanInheritanceRenunciationPage({
    slug: "부산상속포기",
    serviceSlug: "inheritance-renunciation",
    ...busan,
  } as LocalLandingConfig);
  const qualified = buildBusanQualifiedAcceptancePage({
    slug: "부산한정승인",
    serviceSlug: "qualified-acceptance",
    ...busan,
  } as LocalLandingConfig);

  return [
    fromLanding(champion),
    fromLanding(registration),
    fromLanding(renunciation),
    fromLanding(qualified),
    {
      path: "/",
      title: HOME_METADATA_TITLE,
      h1: HOME_H1,
      body: "부산 법무사 안윤정 다옴법무사사무소 해운대 센텀 상속등기 부동산등기 법인등기 개인회생 파산",
    },
    {
      path: "/부산법무사상담",
      title: 부산법무사상담.metaTitle,
      h1: 부산법무사상담.h1,
      body: [
        ...부산법무사상담.heroParagraphs,
        ...부산법무사상담.faqs.map((f) => f.question + f.answer),
      ].join("\n"),
    },
    {
      path: "/상속",
      title: "상속등기·포기·한정승인｜전국·부산",
      h1: "상속 종합 안내",
      body: "전국 상속 절차 개요. 부산 생활권 절차 선택은 부산 상속 법무사 페이지에서 이어진다.",
    },
    {
      path: "/전국상속등기",
      title: "전국 상속등기",
      h1: "전국 상속등기",
      body: "타 지역 상속부동산 비대면 등기. 부산 로컬 오너 페이지와 역할을 나눈다.",
    },
    {
      path: "/부산상속전문법무사",
      title: "부산 상속전문 법무사｜등기·포기·한정승인 첫 분기",
      h1: "부산 상속전문 법무사 — 상속 절차 첫 분기 안내",
      body: "noindex 브리지. 대표 안내는 부산 상속 법무사 페이지로 이어진다.",
    },
  ];
}

function csvEscape(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const list = candidates();
  const failures: string[] = [];
  const lines = [
    "query,expectedOwner,internalRank1,score,pass,note",
  ];

  for (const row of EXPECTED) {
    const ranked = list
      .filter((c) => !NOINDEX_PATHS.has(c.path))
      .map((c) => ({ path: c.path, score: score(c, row.query) }))
      .sort((a, b) => b.score - a.score);
    const top = ranked[0]!;
    const pass = top.path === row.owner;
    if (!pass) {
      failures.push(
        `${row.query}: expected ${row.owner}, internal #1 ${top.path} (${top.score})`,
      );
    }
    lines.push(
      [
        csvEscape(row.query),
        csvEscape(row.owner),
        csvEscape(top.path),
        csvEscape(top.score),
        pass ? "PASS" : "FAIL",
        pass
          ? "내부 텍스트 신호 기준. 네이버 순위가 아님."
          : "owner 신호가 약함. title/H1 변경 없이 본문·내부링크만 보강.",
      ].join(","),
    );
  }

  const out = path.join(OUT_DIR, "intent-audit.csv");
  fs.writeFileSync(out, `${lines.join("\n")}\n`, "utf8");
  console.log(lines.join("\n"));
  if (failures.length > 0) {
    console.error("\nFAIL\n" + failures.join("\n"));
    process.exit(1);
  }
  console.log("\nPASS — expected owners are internal rank 1");
}

main();
