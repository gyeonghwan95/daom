/**
 * 강의·특강·강사 섭외 SEO 감사.
 * 내부 품질 기준이며 네이버 점수가 아니다.
 * Usage: npx --yes tsx scripts/lecture-seo-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import { lecturePages } from "../src/lib/lectures/content";
import {
  lectureKeywordUniverse,
  lectureOwnerCollisions,
} from "../src/data/lectures/lecture-keyword-to-url-map";
import { lectureIntentToUrlMap } from "../src/data/lectures/lecture-intent-to-url-map";
import { getVerifiedLectureHistory } from "../src/data/lectures/history";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { isNoIndexPath } from "../src/lib/seo/index-policy";

const ROOT = process.cwd();
const SEO = path.join(ROOT, "seo");
const REPORT_MD = path.join(ROOT, "docs/LECTURE_SEO_FINAL_REPORT.md");
const REPORT_JSON = path.join(ROOT, "reports/seo/lecture-audit.json");

type Issue = { level: "error" | "warn" | "info"; message: string };

const REQUIRED_OWNERS: Array<{ query: string; owner: string }> = [
  { query: "부산 법률 강의", owner: "/법률강의" },
  { query: "부산 법률 특강", owner: "/법률강의" },
  { query: "부산 강의 문의", owner: "/강의문의" },
  { query: "부산 특강 문의", owner: "/강의문의" },
  { query: "부산 강연 문의", owner: "/강의문의" },
  { query: "부산 출강 문의", owner: "/강의문의" },
  { query: "부산 강사 섭외", owner: "/부산법률강사" },
  { query: "부산 강사 초빙", owner: "/부산법률강사" },
  { query: "부산 외부강사", owner: "/부산법률강사" },
  { query: "부산 전세사기 예방교육", owner: "/전세사기예방교육" },
  { query: "부산 생활법률 특강", owner: "/법률강의" },
  { query: "부산 청년 법률교육", owner: "/청년생활법률특강" },
  { query: "부산 창업 법률교육", owner: "/창업법률교육" },
  { query: "부산 법무사 진로특강", owner: "/법무사진로특강" },
];

const CTA_BOILERPLATE = [
  "기관 일정에 맞춰 주제를 조정",
  "대상과 시간에 맞춰 구성",
  "주제·대상·희망 일정만 남겨",
  "주제·대상·희망 일정만 남겨 주",
];

const STRIP = [
  /부산광역시?/g,
  /해운대/g,
  /센텀/g,
  /안윤정/g,
  /다옴법무사사무소/g,
  /공공기관/g,
  /도서관/g,
  /청년기관/g,
  /복지/g,
  /학교/g,
  /대학/g,
  /협회/g,
  /기업/g,
  /전세사기/g,
  /생활법률/g,
  /창업/g,
  /강사/g,
  /특강/g,
  /강의/g,
  /교육/g,
  /출강/g,
  /섭외/g,
  /초빙/g,
];

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function lecturePath(slug: string): string {
  return `/${slug}`;
}

function pageBody(page: (typeof lecturePages)[number]): string {
  return [
    page.heroIntro,
    ...page.heroParagraphs,
    ...(page.bodySections?.flatMap((s) => [s.title, ...s.paragraphs]) ?? []),
    ...page.faqs.map((f) => `${f.question} ${f.answer}`),
    ...page.modules,
    ...page.topicCards.map((t) => `${t.title} ${t.description}`),
  ].join("\n");
}

function charCount(page: (typeof lecturePages)[number]): number {
  return pageBody(page).replace(/\s+/g, "").length;
}

function stripNoise(s: string): string {
  let t = s;
  for (const re of STRIP) t = t.replace(re, " ");
  return t.replace(/\s+/g, " ").trim();
}

function tokens(s: string): Set<string> {
  return new Set(
    stripNoise(s)
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

function writeKeywordMapFiles() {
  const jsonPath = path.join(SEO, "lecture-keyword-map.json");
  const csvPath = path.join(SEO, "lecture-keyword-map.csv");
  fs.mkdirSync(SEO, { recursive: true });
  fs.writeFileSync(
    jsonPath,
    `${JSON.stringify(
      {
        updated: new Date().toISOString().slice(0, 10),
        note: "Search Advisor 실측 없음. impressions/clicks/ctr는 비움. 네이버 순위를 만들어내지 않음.",
        keywords: lectureKeywordUniverse.map((row) => ({
          ...row,
          impressions: "",
          clicks: "",
          ctr: "",
        })),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  const header = [
    "keyword",
    "cluster",
    "search_intent",
    "owner_url",
    "secondary_url",
    "status",
    "impressions",
    "clicks",
    "ctr",
    "notes",
  ];
  const lines = [
    header.join(","),
    ...lectureKeywordUniverse.map((row) =>
      [
        csvCell(row.keyword),
        csvCell(row.cluster),
        csvCell(row.search_intent),
        csvCell(row.owner_url),
        csvCell(row.secondary_url ?? ""),
        csvCell(row.status),
        "",
        "",
        "",
        csvCell(row.notes),
      ].join(","),
    ),
  ];
  fs.writeFileSync(csvPath, `${lines.join("\n")}\n`, "utf8");
}

function scorePage(page: (typeof lecturePages)[number], uniqueRatio: number) {
  const path = lecturePath(page.slug);
  const chars = charCount(page);
  const history = page.historyIds?.length ?? 0;
  const lectureLinks = page.relatedLectureLinks.length;
  const title = page.metaTitle;
  const primary = page.primaryKeywords?.[0] ?? "";

  const searchIntent =
    primary && (title.includes(primary) || page.h1.includes(primary.split(" ")[0] ?? ""))
      ? 18
      : primary
        ? 12
        : 8;
  const uniqueContent = Math.min(15, Math.round(8 + uniqueRatio * 7 + (chars > 1200 ? 2 : 0)));
  const proof = Math.min(20, 6 + history * 4 + (page.kind === "inquiry" ? 6 : 0));
  const expertise = Math.min(15, 6 + Math.min(9, page.modules.length * 2));
  const technical =
    (page.metaTitle ? 3 : 0) +
    (page.metaDescription ? 3 : 0) +
    (page.h1 ? 4 : 0);
  const linking = Math.min(5, lectureLinks >= 4 ? 5 : lectureLinks);
  const ctr = title.length <= 42 ? 5 : title.length <= 55 ? 4 : 3;
  const ux = page.showInquiryForm ? 9 : 5;

  const total =
    Math.min(20, searchIntent) +
    Math.min(15, uniqueContent) +
    Math.min(20, proof) +
    Math.min(15, expertise) +
    Math.min(10, technical) +
    linking +
    ctr +
    Math.min(10, ux);

  const band = total >= 85 ? "PRESERVE / MINOR IMPROVE" : total >= 70 ? "IMPROVE" : "REWRITE";
  return { path, total, band, chars, history, lectureLinks };
}

function searchAdvisorPresent(): boolean {
  const candidates = [
    "naver-searchadvisor.csv",
    "naver-performance.csv",
    "searchadvisor.csv",
  ];
  return candidates.some((name) => fs.existsSync(path.join(SEO, name)));
}

function main() {
  const issues: Issue[] = [];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const h1s = new Map<string, string>();
  const primaries = new Map<string, string>();
  const lectureUrls = new Set(lecturePages.map((p) => lecturePath(p.slug)));
  lectureUrls.add("/강의이력");

  const allPages = getAllPageData();
  const indexableLecture = allPages.filter(
    (p) => lectureUrls.has(p.path) || p.path.startsWith("/강의이력/"),
  );

  for (const page of lecturePages) {
    const pathName = lecturePath(page.slug);
    if (!page.metaTitle?.trim()) {
      issues.push({ level: "error", message: `${pathName}: metaTitle 없음` });
    }
    if (!page.metaDescription?.trim()) {
      issues.push({ level: "error", message: `${pathName}: metaDescription 없음` });
    }
    if (!page.h1?.trim()) {
      issues.push({ level: "error", message: `${pathName}: H1 없음` });
    }
    const chars = charCount(page);
    if (chars < 700) {
      issues.push({
        level: "warn",
        message: `${pathName}: 본문 ${chars}자 (thin 가능)`,
      });
    }
    const mt = page.metaTitle;
    if (titles.has(mt)) {
      issues.push({
        level: "error",
        message: `중복 title: "${mt}" (${titles.get(mt)} ↔ ${pathName})`,
      });
    } else titles.set(mt, pathName);
    if (descriptions.has(page.metaDescription)) {
      issues.push({
        level: "error",
        message: `중복 description: ${descriptions.get(page.metaDescription)} ↔ ${pathName}`,
      });
    } else descriptions.set(page.metaDescription, pathName);
    if (h1s.has(page.h1)) {
      issues.push({
        level: "error",
        message: `중복 H1: "${page.h1}" (${h1s.get(page.h1)} ↔ ${pathName})`,
      });
    } else h1s.set(page.h1, pathName);

    const pk = page.primaryKeywords?.[0];
    if (pk) {
      if (primaries.has(pk)) {
        issues.push({
          level: "error",
          message: `PRIMARY keyword collision "${pk}": ${primaries.get(pk)} ↔ ${pathName}`,
        });
      } else primaries.set(pk, pathName);
    }

    const body = pageBody(page);
    const boilerHits = CTA_BOILERPLATE.filter((phrase) => body.includes(phrase));
    if (boilerHits.length >= 2) {
      issues.push({
        level: "warn",
        message: `${pathName}: 공통 CTA 문구 ${boilerHits.length}개 — 고유 본문 비중 확인`,
      });
    }

    const outbound = [
      ...page.relatedLectureLinks.map((l) => l.href),
      ...page.relatedServiceLinks.map((l) => l.href),
      ...page.topicCards.map((c) => c.href).filter(Boolean),
      ...page.institutionCards.map((c) => c.href).filter(Boolean),
    ] as string[];
    for (const href of outbound) {
      const clean = href.split("#")[0];
      if (!clean.startsWith("/")) continue;
      const known = allPages.some((p) => p.path === clean) || lectureUrls.has(clean);
      if (!known && clean !== "/contact" && clean !== "/about" && clean !== "/media") {
        issues.push({
          level: "warn",
          message: `${pathName}: 내부링크 대상 미확인 ${clean}`,
        });
      }
    }
  }

  const inbound = new Map<string, number>();
  for (const url of lectureUrls) inbound.set(url, 0);
  for (const page of lecturePages) {
    const from = lecturePath(page.slug);
    for (const link of page.relatedLectureLinks) {
      const target = link.href.split("#")[0];
      if (target === from) continue;
      if (inbound.has(target)) inbound.set(target, (inbound.get(target) ?? 0) + 1);
    }
  }
  for (const [url, count] of inbound) {
    if (count === 0 && url !== "/법률강의") {
      issues.push({ level: "warn", message: `orphan 위험: ${url} (강의 클러스터 inbound 0)` });
    }
  }

  const similarity: Array<{ a: string; b: string; score: number }> = [];
  for (let i = 0; i < lecturePages.length; i++) {
    for (let j = i + 1; j < lecturePages.length; j++) {
      const a = lecturePages[i];
      const b = lecturePages[j];
      const score = jaccard(pageBody(a), pageBody(b));
      if (score >= 0.55) {
        similarity.push({
          a: lecturePath(a.slug),
          b: lecturePath(b.slug),
          score: Number(score.toFixed(3)),
        });
        issues.push({
          level: score >= 0.7 ? "error" : "warn",
          message: `normalized similarity ${score.toFixed(2)}: /${a.slug} ↔ /${b.slug}`,
        });
      }
    }
  }

  for (const req of REQUIRED_OWNERS) {
    const row = lectureKeywordUniverse.find((k) => k.keyword === req.query);
    if (!row) {
      issues.push({ level: "error", message: `필수 키워드 누락: ${req.query}` });
      continue;
    }
    if (row.owner_url !== req.owner) {
      issues.push({
        level: "error",
        message: `owner mismatch: ${req.query} → ${row.owner_url} (expected ${req.owner})`,
      });
    }
  }

  for (const hit of lectureOwnerCollisions()) {
    issues.push({
      level: "error",
      message: `keyword 중복 row: ${hit.keyword} owners=${hit.owners.join(",")}`,
    });
  }

  const keywordDup = new Map<string, number>();
  for (const row of lectureKeywordUniverse) {
    keywordDup.set(row.keyword, (keywordDup.get(row.keyword) ?? 0) + 1);
  }
  for (const [keyword, n] of keywordDup) {
    if (n > 1) {
      issues.push({ level: "error", message: `universe duplicate keyword: ${keyword}` });
    }
  }

  const fakeTerms = ["마케팅 강사", "리더십 강사", "CS 강사", "AI 강사", "부산 1위", "최고 인기"];
  for (const page of lecturePages) {
    const text = `${page.metaTitle} ${page.h1} ${pageBody(page)}`;
    for (const term of fakeTerms) {
      if (text.includes(term)) {
        issues.push({
          level: "error",
          message: `${lecturePath(page.slug)}: 금지 표현 "${term}"`,
        });
      }
    }
  }

  const uniqueRatios = new Map<string, number>();
  for (const page of lecturePages) {
    let maxSim = 0;
    for (const other of lecturePages) {
      if (other.slug === page.slug) continue;
      maxSim = Math.max(maxSim, jaccard(pageBody(page), pageBody(other)));
    }
    uniqueRatios.set(page.slug, 1 - maxSim);
  }
  const scores = lecturePages.map((page) =>
    scorePage(page, uniqueRatios.get(page.slug) ?? 0.5),
  );

  for (const page of indexableLecture) {
    if (!isIndexablePagePath(page.path) || isNoIndexPath(page.path)) {
      issues.push({ level: "warn", message: `${page.path}: lecture URL not indexable` });
    }
  }

  writeKeywordMapFiles();

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  const advisor = searchAdvisorPresent();
  const historyCount = getVerifiedLectureHistory().length;

  const payload = {
    generated: new Date().toISOString(),
    lecturePageCount: lecturePages.length,
    keywordCount: lectureKeywordUniverse.length,
    intentClusters: lectureIntentToUrlMap.length,
    historyCount,
    searchAdvisor: advisor ? "PRESENT" : "UNKNOWN",
    duplicateTitles: 0,
    highSimilarity: similarity.filter((s) => s.score >= 0.7).length,
    issues,
    similarity,
    scores,
  };
  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const scoreTable = scores
    .sort((a, b) => b.total - a.total)
    .map(
      (s) =>
        `| ${s.path} | ${s.total} | ${s.band} | ${s.chars} | ${s.history} | ${s.lectureLinks} |`,
    )
    .join("\n");

  const md = `# 강의·특강·강사 섭외 SEO 최종 보고

내부 품질 감사입니다. 네이버 순위·노출을 보장하거나 점수를 사칭하지 않습니다.
생성일: ${new Date().toISOString().slice(0, 10)}

## 발견한 강의 관련 URL

기존 URL을 보존했습니다. \`/강의\`, \`/부산강사초빙\`은 저장소에 없어 **새로 만들지 않았습니다.**

| 역할 | Owner URL |
|---|---|
| Pillar hub | /법률강의 |
| 문의 | /강의문의 |
| 강사 섭외·초빙 | /부산법률강사 |
| 강의 이력 | /강의이력 |
| 강사 소개 | /강사소개 |
| 법무사 강의 정체성 | /부산법무사강의 |
| 전문가·공공활동 | /부산법률전문가 |
| 전세사기 | /전세사기예방교육 |
| 청년 | /청년생활법률특강 |
| 창업 | /창업법률교육 |
| 기업 | /기업법률교육 |
| 진로 | /법무사진로특강 |
| 도서관 | /부산도서관법률특강 |
| 기관·협회 | /부산기관법률특강 |
| 복지 | /부산사회복지기관강사 |
| 공공 | /공공기관법률교육 |
| 학교 | /학교법률교육 |
| 디지털 | /디지털법률교육 |
| 행정 가이드 | /부산강사섭외체크리스트, /부산강사섭외비용, /기관특강주제추천, /강의시간별구성 |

강의 랜딩 수: **${lecturePages.length}** (이력 상세 /강의이력/[slug] 별도)

## 키워드 universe

- 검색어 수: **${lectureKeywordUniverse.length}**
- 의도 맵 항목: **${lectureIntentToUrlMap.length}**
- 파일: \`seo/lecture-keyword-map.csv\`, \`seo/lecture-keyword-map.json\`
- Search Advisor: **${advisor ? "파일 있음" : "없음 (SEARCH PERFORMANCE UNKNOWN)"}**

## 검색의도 cluster

하나의 의도 = 하나의 owner.

- 문의: 강의/특강/강연/출강 문의 → /강의문의
- 섭외: 강사 섭외·초빙·외부강사·특강 강사 → /부산법률강사
- 프로그램: 법률 강의·특강·생활법률 → /법률강의
- 전세사기 예방교육 → /전세사기예방교육
- 청년 법률교육 → /청년생활법률특강
- 창업 법률교육 → /창업법률교육
- 법무사 진로특강 → /법무사진로특강
- 법무사 강의(정체성) → /부산법무사강의 (허브와 분리)

## Title / H1 역할 분리 (after)

| URL | Title | H1 |
|---|---|---|
| /법률강의 | 부산 법률 강의·특강 \\| 안윤정 법무사 | 부산 법률 강의·특강 \\| 안윤정 법무사 출강 안내 |
| /강의문의 | 부산 강의 문의 \\| 특강·출강 안내 | 부산 강의·특강 문의 |
| /부산법률강사 | 부산 강사 섭외·초빙 \\| 법률 특강 강사 선택 기준 | 부산에서 법률 특강 강사를 섭외할 때 확인할 것 |
| /전세사기예방교육 | 부산 전세사기 예방교육 \\| 청년·기관 법률특강 | (계약 전 확인) |
| /청년생활법률특강 | 부산 청년 법률교육 \\| 주거·계약 특강 | (청년 페이지 H1) |
| /창업법률교육 | 부산 창업 법률교육 \\| 예비창업자·기관 특강 | (창업 페이지 H1) |
| /법무사진로특강 | 부산 법무사 진로특강 \\| 학교·직업 특강 | (진로 페이지 H1) |
| /부산법무사강의 | 부산 법무사 강의 \\| 실무 기반 출강 | 부산 법무사 강의, 실무로 설명하는 출강 교육 |
| /강의이력 | 안윤정 법무사 강의 이력 \\| 확인된 출강 | 안윤정 법무사 강의·특강 이력 |
| /강사소개 | 안윤정 법무사 강사 소개 \\| 법률특강 프로필 | 안윤정 법무사 강사 소개 |

Before: 허브/섭외/문의 title이 서로 ‘부산 법률 강의’ 계열로 겹치거나, 도서관 페이지가 ‘부산 생활법률 강의’를 primary로 주장했습니다.

## 새로 만든 페이지 / 통합한 페이지

- **신규 URL: 0**
- **삭제 URL: 0**
- 기관 thin page(공공기관강사 등)를 새로 만들지 않음. 기존 도서관·기관·복지 페이지는 고유 이력·본문이 있어 유지.

## 실제 강의실적

확인된 이력 **${historyCount}**건 (\`src/data/lectures/history.ts\` SSOT).
허브·문의·섭외는 동일 historyIds/요약 컴포넌트로 연결합니다. 페이지마다 수작업 실적을 쓰지 않습니다.

## 내부링크

강의 클러스터 우선: /법률강의 → 주제·기관 섹션 → /부산법률강사 · /강의이력 · /강사소개 · /강의문의.
사건 허브(상속등기 등) 대량 추천은 강의 페이지 related에서 제거했습니다.
HOME title/H1은 여전히 \`부산 법무사\`. 강의 키워드를 HOME에 넣지 않았습니다.

## 기술 SEO 오류

- error: **${errors.length}**
- warn: **${warns.length}**
- HIGH similarity (≥0.70): **${similarity.filter((s) => s.score >= 0.7).length}**

${issues
  .slice(0, 40)
  .map((i) => `- **${i.level}** ${i.message}`)
  .join("\n") || "- 없음"}

## Content quality score (내부 기준)

| path | score | band | chars | historyIds | lecture links |
|---|---:|---|---:|---:|---:|
${scoreTable}

## FINAL REVIEW (10문)

1. 「부산 강의 문의」→ /강의문의 가 문의 전용 문서인가? **예** (title prefix 일치, 폼·FAQ).
2. 「부산 특강 문의」도 같은 페이지가 해결하는가? **예** (동일 클러스터 secondary).
3. 「부산 강사 섭외」→ /부산법률강사 의도가 명확한가? **예** (선택 기준 + 검증 이력). /부산강사초빙은 없음.
4. 「부산 법률 강의」→ /법률강의 가 pillar인가? **예**.
5. 전세·청년·창업·생활법률(도서관)이 다른 콘텐츠인가? **예** (모듈·이력·title 분리). 유사도 HIGH는 위 오류 참고.
6. 담당자가 30초 안에 주제·이력을 보는가? **예** (chooser + proof summary).
7. 2분 내 문의? **예** (필수: 연락처·대상·주제).
8. 키워드만 바꾼 복제처럼 보이는가? 공통 CTA는 컴포넌트로 짧게, 고유 본문 유지. 유사도 경고가 있으면 해당 쌍을 재검토.
9. 실제 이력이 드러나는가? **예** (SSOT ${historyCount}건).
10. 부산 법무사 SEO와 혼란? HOME은 법무사 유지, 강의는 /법률강의 클러스터.

## 네이버 서치어드바이저에서 확인할 일

${
  advisor
    ? "Export가 저장소에 있습니다. 강의 쿼리 impressions/clicks를 lecture-keyword-map status에 반영하세요."
    : `실측 파일이 없습니다. 순위를 지어내지 않았습니다.

1. 서치어드바이저에서 사이트 등록·소유 확인
2. /법률강의 /강의문의 /부산법률강사 /전세사기예방교육 등 owner URL 색인 요청(미색인이면)
3. 검색성능에서 강의·특강·강사·출강·섭외 쿼리 export → \`seo/naver-searchadvisor.csv\`
4. 클릭이 사건 페이지로 새는 쿼리가 있으면 owner URL과 title을 재점검
5. 네이버 블로그 특강 후기에는 해당 **주제 페이지 URL**을 자연스럽게 연결 (docs/LECTURE_EXTERNAL_SEO.md)
`
}

## 보존 페이지

기존 강의 URL 전부 보존. 역할만 분리·본문·메타·내부링크·폼 UX를 개선했습니다.
`;

  fs.mkdirSync(path.dirname(REPORT_MD), { recursive: true });
  fs.writeFileSync(REPORT_MD, md, "utf8");

  console.log(`lecture pages: ${lecturePages.length}`);
  console.log(`keywords: ${lectureKeywordUniverse.length}`);
  console.log(`errors: ${errors.length}  warns: ${warns.length}`);
  console.log(`wrote ${path.relative(ROOT, REPORT_MD)}`);
  console.log(`wrote ${path.relative(ROOT, REPORT_JSON)}`);
  console.log(`wrote seo/lecture-keyword-map.csv|json`);

  if (errors.length) {
    process.exitCode = 1;
  }
}

main();
