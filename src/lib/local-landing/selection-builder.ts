import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import { districtProfiles } from "./districts";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import { getSelectionHubContent } from "./selection";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";

function buildLawyerOpinion(regionLabel: string, title: string): string {
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${regionLabel} ${title} 관련 상담을 진행합니다. 등기부·계약서·가족관계를 함께 보며 상담 전 확인할 절차와 서류를 항목별로 정리해 드립니다.`;
}

function buildDirectionsNote(config: LocalLandingConfig): string {
  const district = districtProfiles[config.regionKey];
  return (
    district?.directionsFromOffice ??
    `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. ${config.regionLabel}에서 센텀시티역·벡스코 인근으로 방문하실 수 있으며, 네이버 예약 후 상담해 주세요.`
  );
}

export function buildSelectionHubPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const content = getSelectionHubContent(key);
  if (!content) return null;

  const district = districtProfiles[config.regionKey];
  if (!district) return null;

  const consultationCase = {
    title: `${config.regionLabel} ${content.title} 참고 사례`,
    summary: `유사 사건 상담 시 필요 서류·예상 기간·비용을 단계별로 안내한 사례입니다.`,
    href: config.relatedCaseSlug
      ? `/services/cases/${config.relatedCaseSlug}`
      : content.relatedLinks.find((l) => l.href.includes("/cases/"))?.href,
  };

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "selection-hub",
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
    whenNeeded: content.searchIntents,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase,
    consultationCases: [consultationCase],
    legalIssues: content.selectionCriteria,
    precautions: content.summaryBullets,
    procedures: content.selectionCriteria,
    documents: content.preparationDocs,
    costGuide: content.preparationNote,
    faqs: content.faqs,
    lawyerOpinion: buildLawyerOpinion(config.regionLabel, content.title),
    directionsNote: buildDirectionsNote(config),
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: [],
    relatedServiceLinks: content.relatedLinks,
    relatedRegionLinks: [],
  };
}
