import { consultationCopy } from "@/lib/consultation";
import { officeLocation } from "@/lib/office-location";
import { getBusinessContent } from "@/lib/business/content";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

export function buildBusinessPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const content = getBusinessContent(key);
  if (!content) return null;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "business",
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
    whenNeeded: content.situations.length
      ? content.situations
      : content.summaryItems.map((item) => `${item.label}: ${item.value}`),
    jurisdictionGuide: {
      title: "상담·진행 범위",
      jurisdictionNote:
        "부산 해운대·센텀 사무소를 기준으로 상담하며, 법인등기·기업 부동산등기·신청서류 작성을 중심으로 지원합니다.",
      practicalNotes: [
        `사무소: ${officeLocation.fullAddress}`,
        content.scopeNotice ??
          "소송대리·세무·노무·특허 등은 별도 전문가 검토가 필요할 수 있습니다.",
      ],
    },
    consultationCase: {
      title: content.ctaTitle,
      summary: content.ctaText,
      href: "/기업업무문의",
    },
    consultationCases: [
      {
        title: content.ctaTitle,
        summary: content.ctaText,
        href: "/기업업무문의",
      },
    ],
    legalIssues: content.supportItems.slice(0, 10),
    precautions: [
      content.scopeNotice ??
        "포괄적 법률자문·상시 고문·회수 보장을 의미하지 않습니다.",
      ...content.commonMistakes.slice(0, 3),
    ],
    procedures: content.procedures,
    documents: content.documents,
    costGuide: content.costFactors.length
      ? `비용은 ${content.costFactors.join(", ")} 등에 따라 달라질 수 있습니다.`
      : "업무 범위 확인 후 안내합니다.",
    faqs: content.faqs,
    lawyerOpinion: content.heroParagraphs[0] ?? content.heroIntro,
    directionsNote: `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다.`,
    ctaDescription: content.ctaText || consultationCopy.contact,
    relatedBlogHrefs: [],
    relatedServiceLinks: content.relatedLinks,
    relatedRegionLinks: content.lectureLinks ?? [],
  };
}
