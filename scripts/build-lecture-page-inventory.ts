/**
 * Lecture page inventory for SEO coverage.
 * Usage: npx --yes tsx scripts/build-lecture-page-inventory.ts
 */
import fs from "node:fs";
import path from "node:path";
import { lecturePages } from "../src/lib/lectures/content";
import { getLectureHistorySummaries } from "../src/data/lectures/history-summaries";
import { getVerifiedLectureHistory } from "../src/data/lectures/history";

const OUT = path.join(process.cwd(), "reports/seo/lecture-page-inventory.json");

function main() {
  const pages = lecturePages.map((p) => ({
    url: `/${p.slug}`,
    title: p.title,
    metaTitle: p.metaTitle,
    h1: p.h1,
    description: p.metaDescription,
    kind: p.kind,
    primaryIntent: p.eyebrow,
    audience: p.audienceCards.map((a) => a.title),
    topic: p.topicCards.map((t) => t.title),
    format: p.formats.map((f) => f.title),
    region: "부산",
    actualLectureHistory: p.historyIds,
    cta: { title: p.ctaTitle, inquiry: Boolean(p.showInquiryForm) },
    internalLinks: [
      ...p.relatedLectureLinks.map((l) => l.href),
      ...p.relatedServiceLinks.map((l) => l.href),
    ],
    canonical: `/${p.slug}`,
    indexability: "indexable",
    rankingProtection: "UNKNOWN_PERFORMANCE",
    primaryKeywords: p.primaryKeywords ?? [],
  }));

  const history = getVerifiedLectureHistory().map((h) => ({
    ...getLectureHistorySummaries().find((s) => s.id === h.id),
    title: h.title,
    institution: h.institution,
    slug: `/강의이력/${h.slug}`,
  }));

  const report = {
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    verifiedHistoryCount: history.length,
    pages,
    history,
    champions: {
      LECTURE_MAIN_HUB: "/법률강의",
      LECTURE_HIRING: "/부산법률강사",
      CORPORATE: "/기업법률교육",
      PUBLIC: "/공공기관법률교육",
      WORKSHOP_SEMINAR: "/법률강의 + /부산법률강사 (no new URL)",
      STARTUP: "/창업법률교육",
      JEONSE: "/전세사기예방교육",
      YOUTH: "/청년생활법률특강",
      TOPIC_DISCOVERY: "/기관특강주제추천",
      CONVERSION: "/강의문의",
    },
    createNew: 0,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${OUT} (${pages.length} pages, ${history.length} history)`);
}

main();
