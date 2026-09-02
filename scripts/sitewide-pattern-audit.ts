/**
 * 상속 SEO 작업과 같은 유형의 사이트 전역 전수조사.
 * 네이버 순위를 추정하지 않는다. 내부 PageData 신호만 본다.
 * 실행: npx --yes tsx scripts/sitewide-pattern-audit.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { isNoIndexPath } from "../src/lib/seo/index-policy";
import {
  HOME_H1,
  HOME_METADATA_DESCRIPTION,
  HOME_METADATA_TITLE,
} from "../src/lib/seo/metadata";
import { getChampionArticleSummary, shouldDeferNationwideBanner } from "../src/lib/local-landing/champion-article-summaries";
import type { PageData } from "../src/lib/pageData/types";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "seo/sitewide-pattern-audit.json");

const META_SEO = [
  "검색어에",
  "검색 키워드보다",
  "이 페이지는 자격 표방",
  "입증하기 어려운 전문 표방",
  "thin 페이지",
  "색인",
  "canonical",
  "noindex",
];

const AUTO_CASE = /(진행 안내|참고 사례|서류 준비|원격 진행)$/;

const DUP_REGION = /(부산 부산|해운대 해운대|센텀 센텀|동래 동래|수영 수영|연제 연제)/;

const CHAMPION_CANDIDATES = [
  "/",
  "/부산상속법무사",
  "/부산상속등기",
  "/부산상속포기",
  "/부산한정승인",
  "/부산법무사상담",
  "/부산법무사추천",
  "/부산법무사",
  "/부산법인법무사",
  "/부산법인등기",
  "/부산등기법무사",
  "/부산부동산등기",
  "/부산개인회생",
  "/개인회생파산",
  "/전세사기피해대응절차",
  "/상속",
  "/전국상속등기",
];

type Finding = {
  path: string;
  category: string;
  issue: string;
  detail: string;
  severity: "high" | "medium" | "low";
};

function blob(page: PageData): string {
  return [
    page.metaTitle,
    page.h1,
    page.intro,
    ...page.introParagraphs,
    page.consultationExample.title,
    page.consultationExample.body,
    ...page.faqs.map((f) => `${f.question} ${f.answer}`),
    ...page.sections.map((s) => `${s.title} ${s.body}`),
  ].join("\n");
}

function main() {
  const pages = getAllPageData();
  const findings: Finding[] = [];
  const stats = {
    totalPages: pages.length,
    indexable: 0,
    noindex: 0,
    faqEq3: 0,
    faqLt3: 0,
    linksGt16: 0,
    linksLt6: 0,
    autoCase: 0,
    dupRegion: 0,
    metaSeo: 0,
    dedicatedSummary: 0,
    summaryCopiesIntro: 0,
    duplicateTitles: 0,
    duplicateH1s: 0,
  };

  const titleMap = new Map<string, string[]>();
  const h1Map = new Map<string, string[]>();

  for (const page of pages) {
    const indexable = isIndexablePagePath(page.path) && !isNoIndexPath(page.path);
    if (indexable) stats.indexable += 1;
    else stats.noindex += 1;

    const text = blob(page);
    if (DUP_REGION.test(text)) {
      stats.dupRegion += 1;
      findings.push({
        path: page.path,
        category: page.category,
        issue: "duplicate-region",
        detail: text.match(DUP_REGION)?.[0] ?? "",
        severity: "high",
      });
    }

    for (const phrase of META_SEO) {
      if (text.includes(phrase)) {
        stats.metaSeo += 1;
        findings.push({
          path: page.path,
          category: page.category,
        issue: "meta-seo-copy",
          detail: phrase,
          severity: phrase === "검색어에" || phrase === "thin 페이지" ? "medium" : "low",
        });
        break;
      }
    }

    if (AUTO_CASE.test(page.consultationExample.title)) {
      stats.autoCase += 1;
      findings.push({
        path: page.path,
        category: page.category,
        issue: "auto-generated-case-title",
        detail: page.consultationExample.title,
        severity: "medium",
      });
    }

    if (page.faqs.length === 3) stats.faqEq3 += 1;
    if (page.faqs.length < 3) {
      stats.faqLt3 += 1;
      if (page.category === "local" || page.category === "service") {
        findings.push({
          path: page.path,
          category: page.category,
          issue: "thin-faq",
          detail: `faqs=${page.faqs.length}`,
          severity: "low",
        });
      }
    }

    if (page.internalLinks.length > 16) {
      stats.linksGt16 += 1;
      findings.push({
        path: page.path,
        category: page.category,
        issue: "link-overflow",
        detail: `internalLinks=${page.internalLinks.length}`,
        severity: "low",
      });
    }
    if (page.internalLinks.length < 6 && indexable && page.category !== "glossary") {
      stats.linksLt6 += 1;
    }

    const hasDedicated = Boolean(getChampionArticleSummary(page.slug));
    if (hasDedicated) stats.dedicatedSummary += 1;
    else stats.summaryCopiesIntro += 1;

    const t = page.metaTitle.trim();
    const h = page.h1.trim();
    titleMap.set(t, [...(titleMap.get(t) ?? []), page.path]);
    h1Map.set(h, [...(h1Map.get(h) ?? []), page.path]);
  }

  const home = pages.find((p) => p.path === "/");
  if (!home) {
    findings.push({
      path: "/",
      category: "core",
      issue: "missing-home",
      detail: "HOME PageData missing",
      severity: "high",
    });
  } else {
    if (home.metaTitle !== HOME_METADATA_TITLE) {
      findings.push({
        path: "/",
        category: "core",
        issue: "home-title-drift",
        detail: home.metaTitle,
        severity: "high",
      });
    }
    if (home.h1 !== HOME_H1) {
      findings.push({
        path: "/",
        category: "core",
        issue: "home-h1-drift",
        detail: home.h1,
        severity: "high",
      });
    }
    if (home.metaDescription !== HOME_METADATA_DESCRIPTION) {
      findings.push({
        path: "/",
        category: "core",
        issue: "home-description-drift",
        detail: home.metaDescription.slice(0, 80),
        severity: "high",
      });
    }
  }

  const championSnapshot = CHAMPION_CANDIDATES.map((p) => {
    const page = pages.find((row) => row.path === p);
    return page
      ? {
          path: p,
          title: page.metaTitle,
          h1: page.h1,
          faqs: page.faqs.length,
          links: page.internalLinks.length,
          caseTitle: page.consultationExample.title,
          dedicatedSummary: Boolean(getChampionArticleSummary(page.slug)),
          nationwideDeferred: shouldDeferNationwideBanner(page.slug),
          uniqueSectionTitles: page.sections
            .map((s) => s.title)
            .filter((t) => t.length > 8)
            .slice(0, 6),
        }
      : { path: p, missing: true };
  });

  const dupTitles = [...titleMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([title, paths]) => ({ title, paths }));
  const dupH1s = [...h1Map.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([h1, paths]) => ({ h1, paths }));
  stats.duplicateTitles = dupTitles.length;
  stats.duplicateH1s = dupH1s.length;

  const inboundLostFromConsult = [
    "/부산법무사무소",
    "/부산법무사비용",
    "/about",
    "/부산상속등기전문",
    "/부산부동산등기전문",
    "/부산법인등기전문",
    "/부산증여등기",
    "/부산법률상담",
    "/전세사기피해대응절차",
    "/개인회생파산",
    "/무슨법률업무인지모를때",
  ];

  const report = {
    generated: "2026-09-02",
    note: "내부 PageData 전수. 네이버 순위·노출 숫자는 없음.",
    stats,
    championSnapshot,
    inboundRiskFromConsultTrim: inboundLostFromConsult,
    duplicateTitles: dupTitles.slice(0, 40),
    duplicateH1s: dupH1s.slice(0, 40),
    findings: findings.sort((a, b) => {
      const rank = { high: 0, medium: 1, low: 2 };
      return rank[a.severity] - rank[b.severity];
    }),
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log("pages", stats.totalPages, "indexable", stats.indexable);
  console.log("dupRegion", stats.dupRegion, "metaSeo", stats.metaSeo, "autoCase", stats.autoCase);
  console.log("faqEq3", stats.faqEq3, "linksGt16", stats.linksGt16);
  console.log("dedicatedSummary", stats.dedicatedSummary, "summaryCopiesIntro", stats.summaryCopiesIntro);
  console.log("dupTitles", stats.duplicateTitles, "dupH1s", stats.duplicateH1s);
  const high = findings.filter((f) => f.severity === "high");
  const med = findings.filter((f) => f.severity === "medium");
  console.log("findings high", high.length, "medium", med.length, "total", findings.length);
  for (const f of [...high, ...med].slice(0, 80)) {
    console.log(`[${f.severity}] ${f.path} ${f.issue} :: ${f.detail}`);
  }
  console.log("Wrote", OUT);
}

main();
