import { createPageData } from "@/lib/pageData/template-helpers";
import type { PageData } from "@/lib/pageData/types";
import type { LectureHistoryEntry } from "@/lib/lectures/types";
import {
  getLectureHistoryAudienceLabel,
  getLectureHistoryDisplayDate,
  buildLectureTrackRecordSummary,
} from "@/lib/lectures/history-helpers";
import {
  getAllLectureHistorySlugs,
  getLectureHistoryBySlug,
  getVerifiedLectureHistory,
} from "@/data/lectures/history";

export function buildLectureHistoryHubPageData(): PageData {
  const summary = buildLectureTrackRecordSummary();
  return createPageData({
    slug: "강의이력",
    path: "/강의이력",
    category: "pillar",
    title: "안윤정 법무사 강의 이력｜생활법률·전세사기·청년·창업 특강",
    metaTitle: "안윤정 법무사 강의 이력｜생활법률·전세사기·청년·창업 특강",
    metaDescription:
      "부산 시민, 청년, 학생, 자립준비청년, 예비창업자, 기업·기관 임직원을 대상으로 진행한 생활법률, 전세사기 예방, 디지털 법률, 창업 법률교육 이력을 안내합니다.",
    h1: "안윤정 법무사 강의·특강 이력",
    intro:
      "확인된 기관·일정·현장 사진만 바탕으로 강의 이력을 정리합니다. 네이버 블로그 원문은 참고 링크로만 연결하며, 본문을 복제하지 않습니다.",
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "법률 강의", href: "/법률강의" },
      { label: "강의 이력" },
    ],
    introParagraphs: [
      `확인된 강의 이력 ${summary.lectureCount}건을 기관·주제·대상별로 살펴볼 수 있습니다.`,
      "생활법률, 전세사기 예방, 청년·디지털·학교 진로, 기관 맞춤형 교육 이력을 확인한 뒤 강의 문의를 이어갈 수 있습니다.",
    ],
    primaryKeywords: [
      "안윤정 법무사 강의 이력",
      "부산 법률 특강",
      "부산 법무사 강의",
      "전세사기 예방교육",
      "청년 생활법률",
      "도서관 법률특강",
      "법무사 진로특강",
    ],
    internalLinks: [
      { href: "/법률강의", label: "법률 강의 안내" },
      { href: "/부산법무사강의", label: "부산 법무사 강의" },
      { href: "/부산도서관법률특강", label: "도서관 법률특강" },
      { href: "/부산기관법률특강", label: "기관 법률특강" },
      { href: "/강사소개", label: "강사 소개" },
      { href: "/강의문의", label: "강의 문의" },
      { href: "/전세사기예방교육", label: "전세사기 예방교육" },
      { href: "/청년생활법률특강", label: "청년 생활법률 특강" },
    ],
    ctaTitle: "기관 맞춤 강의를 준비하고 계신가요?",
    ctaText:
      "교육 대상과 희망 주제를 알려주시면, 확인된 이력을 바탕으로 구성을 협의할 수 있습니다.",
  });
}

export function buildLectureHistoryDetailPageData(
  entry: LectureHistoryEntry,
): PageData {
  const dateLabel = getLectureHistoryDisplayDate(entry);
  const audience = getLectureHistoryAudienceLabel(entry);
  return createPageData({
    slug: entry.slug,
    path: `/강의이력/${entry.slug}`,
    category: "pillar",
    title: `${entry.shortTitle ?? entry.title}｜안윤정 법무사 강의 이력`,
    metaTitle: `${entry.shortTitle ?? entry.title}｜안윤정 법무사 강의 이력`,
    metaDescription: `${entry.institution}에서 진행한 ${entry.title} 이력을 안내합니다. 대상: ${audience}. ${entry.summary.slice(0, 80)}`,
    h1: entry.title,
    intro: entry.summary,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: "법률 강의", href: "/법률강의" },
      { label: "강의 이력", href: "/강의이력" },
      { label: entry.shortTitle ?? entry.title },
    ],
    introParagraphs: [
      `${entry.institution} · ${dateLabel} · ${audience}`,
      entry.summary,
    ],
    primaryKeywords: [
      entry.institution,
      entry.title,
      ...entry.topics.slice(0, 4),
      "안윤정 법무사 강의",
    ],
    internalLinks: [
      { href: "/강의이력", label: "전체 강의 이력" },
      { href: "/강사소개", label: "강사 소개" },
      { href: "/강의문의", label: "강의 문의" },
      ...(entry.relatedLecturePages ?? []).slice(0, 4).map((href) => ({
        href,
        label: href.replace(/^\//, ""),
      })),
    ],
    ctaTitle: "비슷한 대상과 주제로 강의를 준비하고 계신가요?",
    ctaText:
      "기관 유형, 교육 대상, 희망 주제와 시간을 알려주시면 실제 진행 이력을 바탕으로 강의 구성을 협의할 수 있습니다.",
  });
}

export function buildAllLectureHistoryPageData(): PageData[] {
  const pages = [buildLectureHistoryHubPageData()];
  for (const entry of getVerifiedLectureHistory()) {
    pages.push(buildLectureHistoryDetailPageData(entry));
  }
  return pages;
}

export function getLectureHistoryPageDataBySlug(
  slug: string,
): PageData | undefined {
  if (slug === "강의이력") return buildLectureHistoryHubPageData();
  const entry = getLectureHistoryBySlug(slug);
  return entry ? buildLectureHistoryDetailPageData(entry) : undefined;
}

export function listLectureHistoryPaths(): string[] {
  return [
    "/강의이력",
    ...getAllLectureHistorySlugs().map((slug) => `/강의이력/${slug}`),
  ];
}
