import { consultationCopy } from "@/lib/consultation";
import { officeLocation } from "@/lib/office-location";
import { getBuildingContent } from "@/lib/building-intent/content";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

export function buildBuildingIntentPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const content = getBuildingContent(key);
  if (!content) return null;

  const keywords = [
    content.primaryKeyword,
    ...content.secondaryKeywords,
    ...content.questionKeywords,
  ];

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "building-intent",
    serviceSlug: config.serviceSlug,
    title: content.title,
    h1: content.h1,
    metaTitle: content.metaTitle,
    description: content.metaDescription,
    summaryParagraphs: [content.heroIntro, ...content.heroParagraphs],
    primaryKeywords: keywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: content.conclusion,
    whenNeeded: content.whoNeedsThis,
    jurisdictionGuide: {
      title: "관할·업무 범위",
      jurisdictionNote:
        "부동산 소재지 관할 등기소 기준으로 접수하며, 부산 해운대·센텀 다옴법무사사무소에서 상담·수임을 진행합니다.",
      practicalNotes: [
        `사무소: ${officeLocation.fullAddress}`,
        content.scopeNotice,
      ],
    },
    consultationCase: {
      title: content.ctaTitle,
      summary: content.ctaText,
      href: "/contact/inquiry?field=real-estate-registration",
    },
    consultationCases: [
      {
        title: content.ctaTitle,
        summary: content.ctaText,
        href: "/contact/inquiry?field=real-estate-registration",
      },
    ],
    legalIssues: content.decisionBodies,
    precautions: [
      ...content.penaltyRisks.slice(0, 2),
      ...content.commonConfusions.slice(0, 2),
    ],
    procedures: content.procedures,
    documents: content.documents,
    costGuide: content.costFactors.length
      ? `비용은 ${content.costFactors.join(", ")} 등에 따라 달라질 수 있습니다.`
      : "업무 범위 확인 후 안내합니다.",
    costFactors: content.costFactors,
    faqs: content.faqs,
    lawyerOpinion: content.conclusion,
    directionsNote: `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다.`,
    ctaDescription: content.ctaText || consultationCopy.contact,
    relatedBlogHrefs: [],
    relatedServiceLinks: content.relatedLinks,
    relatedRegionLinks: [
      { href: "/부산건물등기", label: "부산 건물등기" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
    ],
  };
}
