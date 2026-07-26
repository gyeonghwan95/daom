import { consultationCopy } from "@/lib/consultation";
import { officeLocation } from "@/lib/office-location";
import { getCounselContent } from "@/lib/counsel-intent/content";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

export function buildCounselIntentPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const content = getCounselContent(key);
  if (!content) return null;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "counsel-intent",
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
    whenNeeded: content.situationCards.map(
      (card) => `${card.title}: ${card.description}`,
    ),
    jurisdictionGuide: {
      title: "상담·진행 범위",
      jurisdictionNote:
        "부산 해운대·센텀 다옴법무사사무소를 기준으로, 안윤정 법무사가 지원할 수 있는 등기·서류·절차를 안내합니다.",
      practicalNotes: [
        `사무소: ${officeLocation.fullAddress}`,
        content.scopeNotice,
      ],
    },
    consultationCase: {
      title: content.ctaTitle,
      summary: content.ctaText,
      href: "/contact",
    },
    consultationCases: [
      {
        title: content.ctaTitle,
        summary: content.ctaText,
        href: "/contact",
      },
    ],
    legalIssues: content.supportItems,
    precautions: [content.scopeNotice, ...content.commonMistakes.slice(0, 3)],
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
    relatedRegionLinks: [
      { href: "/부산기업법률자문", label: "기업 법률실무 지원" },
      { href: "/법률강의", label: "법률 강의·특강" },
    ],
  };
}
