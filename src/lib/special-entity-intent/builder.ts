import { consultationCopy } from "@/lib/consultation";
import { officeLocation } from "@/lib/office-location";
import { getSpecialEntityContent } from "@/lib/special-entity-intent/content";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

export function buildSpecialEntityIntentPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const content = getSpecialEntityContent(key);
  if (!content) return null;

  const keywords = [
    content.primaryKeyword,
    ...content.secondaryKeywords,
    ...content.questionKeywords,
  ];

  const contactHref = `/contact?from=${encodeURIComponent(config.slug)}&topic=${encodeURIComponent(content.title)}`;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "special-entity-intent",
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
        content.legalProfile?.regionalNotes?.join(" ") ??
        "법인 주사무소 소재지 관할 등기소 기준으로 접수하며, 부산 해운대·센텀 다옴법무사사무소에서 상담·수임을 진행합니다.",
      practicalNotes: [
        `사무소: ${officeLocation.fullAddress}`,
        content.scopeNotice,
        content.legalProfile
          ? `근거 법률: ${content.legalProfile.legalBasis.join(", ")} · 최종 검토: ${content.legalProfile.lastLegalReview}`
          : "",
      ].filter(Boolean),
    },
    consultationCase: {
      title: content.ctaTitle,
      summary: content.ctaText,
      href: contactHref,
    },
    consultationCases: [
      {
        title: content.ctaTitle,
        summary: content.ctaText,
        href: contactHref,
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
      { href: "/특수비영리법인등기", label: "특수·비영리법인 허브" },
      { href: "/부산법인법무사", label: "부산 법인 법무사" },
      { href: "/법인등기", label: "법인등기 허브" },
    ],
  };
}
