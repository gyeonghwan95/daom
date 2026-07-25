import { consultationCopy } from "@/lib/consultation";
import { getConsultLanding } from "@/lib/consult-wizard/landings";
import { officeLocation } from "@/lib/office-location";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

export function buildConsultLandingPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const content = getConsultLanding(config.keywordKey ?? config.slug);
  if (!content) return null;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "consult-landing",
    serviceSlug: content.serviceSlug,
    title: content.title,
    h1: content.h1,
    metaTitle: content.metaTitle,
    description: content.metaDescription,
    summaryParagraphs: content.paragraphs,
    primaryKeywords: [content.title, "법무사 상담", "간편 상담"],
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: content.paragraphs[0] ?? content.metaDescription,
    whenNeeded: content.bullets,
    jurisdictionGuide: {
      title: "상담 안내",
      jurisdictionNote:
        "남겨주신 상황을 확인한 뒤 관할·서류·절차를 안내합니다. 확정 견적은 사건 확인 후입니다.",
      practicalNotes: content.prepItems,
    },
    consultationCase: {
      title: "간편 상담",
      summary: "상황 선택과 연락처만으로 문의할 수 있습니다.",
      href: "/상담",
    },
    consultationCases: [],
    legalIssues: content.bullets,
    precautions: [
      "주민등록번호·계좌 비밀번호 등 민감정보는 남기지 마세요.",
      "이 안내는 일반 정보이며 개별 법률 자문·수임 확정이 아닙니다.",
    ],
    procedures: content.prepItems,
    documents: content.prepItems,
    costGuide:
      "상담 문의 자체는 상황 확인을 위한 것이며, 수임료·공과금은 사건 확인 후 구분해 안내합니다.",
    costFactors: [],
    faqs: content.faqs,
    lawyerOpinion:
      "업무명을 몰라도, 서류가 없어도 현재 상황만 알려 주시면 됩니다. 필요한 절차를 확인한 뒤 안내드립니다.",
    directionsNote: `사무소는 ${officeLocation.fullAddress}입니다.`,
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: [],
    relatedServiceLinks: content.relatedLinks,
    relatedRegionLinks: [],
  };
}
