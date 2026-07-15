import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import { districtProfiles } from "./districts";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import { getSearchIntentContent } from "./search-intent";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

function buildLawyerOpinion(regionLabel: string, title: string): string {
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${regionLabel} ${title} 관련 상담을 진행합니다. 검색 키워드보다 서류·기한·관할을 기준으로 실무 절차를 안내합니다.`;
}

function buildDirectionsNote(config: LocalLandingConfig): string {
  const district = districtProfiles[config.regionKey];
  return (
    district?.directionsFromOffice ??
    `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. ${config.regionLabel}에서 센텀시티역·벡스코 인근으로 방문하실 수 있으며, 예약 후 상담해 주세요.`
  );
}

export function buildSearchIntentPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const content = getSearchIntentContent(key);
  if (!content) return null;

  const district = districtProfiles[config.regionKey];
  if (!district) return null;

  const consultationCase = {
    title: `${config.regionLabel} ${content.title} 참고 사례`,
    summary: `유사 상담 시 필요 서류·예상 기간·비용을 단계별로 안내한 사례입니다.`,
    href:
      content.relatedCaseLinks[0]?.href ??
      (config.relatedCaseSlug
        ? `/services/cases/${config.relatedCaseSlug}`
        : undefined),
  };

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "search-intent",
    serviceSlug: content.serviceSlug,
    title: content.title,
    h1: content.h1,
    metaTitle: content.metaTitle,
    description: content.metaDescription,
    summaryParagraphs: content.heroParagraphs,
    primaryKeywords: content.primaryKeywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: content.heroParagraphs[0] ?? content.metaDescription,
    whenNeeded: content.whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase,
    consultationCases: [consultationCase],
    legalIssues: content.commonMistakes,
    precautions: content.summaryBullets,
    procedures: content.procedures,
    documents: content.documents,
    costGuide: content.documentsNote,
    faqs: content.faqs,
    lawyerOpinion: buildLawyerOpinion(config.regionLabel, content.title),
    directionsNote: buildDirectionsNote(config),
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: [],
    relatedServiceLinks: content.relatedServiceLinks,
    relatedRegionLinks: content.relatedGuideLinks,
  };
}
