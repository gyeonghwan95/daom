import { consultationCopy } from "@/lib/consultation";
import { officeLocation } from "@/lib/office-location";
import { getLectureContent } from "@/lib/lectures/pages";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

export function buildLecturePage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const content = getLectureContent(key);
  if (!content) return null;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "lecture",
    serviceSlug: config.serviceSlug,
    title: content.title,
    h1: content.h1,
    metaTitle: content.metaTitle,
    description: content.metaDescription,
    summaryParagraphs: [content.heroIntro, ...content.heroParagraphs],
    primaryKeywords: content.primaryKeywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: content.heroIntro,
    whenNeeded: content.summaryItems.map(
      (item) => `${item.label}: ${item.value}`,
    ),
    jurisdictionGuide: {
      title: "출강·교육 진행 범위",
      jurisdictionNote:
        "부산 해운대·센텀 사무소를 기준으로 부산 지역 출강을 우선하며, 인근 지역·온라인은 일정에 따라 협의합니다.",
      practicalNotes: [
        `사무소: ${officeLocation.fullAddress}`,
        "법정의무·지정 자격교육은 본 안내 범위에 포함하지 않습니다.",
      ],
    },
    consultationCase: {
      title: "기관 맞춤 강의 기획",
      summary: content.ctaText,
      href: "/강의문의",
    },
    consultationCases: [
      {
        title: "기관 맞춤 강의 기획",
        summary: content.ctaText,
        href: "/강의문의",
      },
    ],
    legalIssues: content.modules.slice(0, 8),
    precautions: content.disclaimer
      ? [content.disclaimer]
      : [
          "강의 성사·효과를 보장하지 않습니다.",
          "법정의무교육을 대체하지 않습니다.",
        ],
    procedures: content.processSteps,
    documents: content.preparationChecklist,
    costGuide:
      "강의료는 시간·형식·이동·자료 범위에 따라 기관 기준과 협의합니다. 고정 단가를 단정하지 않습니다.",
    faqs: content.faqs,
    lawyerOpinion: content.heroParagraphs[0] ?? content.heroIntro,
    directionsNote: `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. 강의는 기관 장소 출강 또는 온라인으로 진행할 수 있습니다.`,
    ctaDescription: content.ctaText || consultationCopy.footerNote,
    relatedBlogHrefs: [],
    relatedServiceLinks: content.relatedServiceLinks,
    relatedRegionLinks: content.relatedLectureLinks,
  };
}
