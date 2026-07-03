import { getAllContent } from "@/lib/content/loader";
import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import { districtProfiles } from "./districts";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import { getKeywordTopic } from "./keyword-topics";

function getRelatedBlogPosts(
  serviceSlug: string,
  limit = 3,
): { href: string; label: string }[] {
  return getAllContent("blog")
    .filter(
      (post) =>
        post.relatedServices?.includes(serviceSlug) ||
        post.area?.includes("부산") ||
        post.area?.includes("해운대"),
    )
    .slice(0, limit)
    .map((post) => ({ href: post.href, label: post.title }));
}

function buildLawyerOpinion(regionLabel: string, title: string): string {
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${regionLabel} ${title} 사건을 직접 상담·진행합니다. 등기부·계약서·가족관계를 함께 보며 ‘지금 무엇부터 해야 하는지’를 먼저 정리해 드립니다. 부산 의뢰인께는 관할 등기소·필요 서류·예상 비용을 항목별로 설명하고, 기한이 있는 사건은 우선순위를 표시해 안내합니다.`;
}

function buildDirectionsNote(config: LocalLandingConfig): string {
  const district = districtProfiles[config.regionKey];
  return (
    district?.directionsFromOffice ??
    `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. ${config.regionLabel}에서 센텀시티역·벡스코 인근으로 방문하실 수 있으며, 네이버 예약 후 상담해 주세요.`
  );
}

export function buildKeywordHubPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.keywordKey ?? config.slug;
  const topic = getKeywordTopic(key);
  if (!topic) return null;

  const district = districtProfiles[config.regionKey];
  if (!district) return null;

  const consultationCase = {
    title: `${config.regionLabel} ${topic.title} 상담 사례`,
    summary: `최근 ${config.regionLabel}에서 상담한 사례입니다. ${config.caseAngle ?? topic.caseAngle ?? topic.title}. 의뢰인 상황에 맞춰 필요 서류·예상 기간·비용을 단계별로 안내하고 진행했습니다.`,
    href: config.relatedCaseSlug ?? topic.relatedCaseSlug
      ? `/services/cases/${config.relatedCaseSlug ?? topic.relatedCaseSlug}`
      : topic.relatedCaseLinks[0]?.href,
  };

  const consultationCases = [
    consultationCase,
    {
      title: `${config.regionLabel} 서류 준비 상담`,
      summary: `등기부·계약서를 미리 검토해 누락 서류를 줄이고 접수 일정을 맞춘 사례입니다.`,
    },
    {
      title: `${config.regionLabel} 원격 진행 사례`,
      summary: `카카오톡 상담 후 방문 없이 서류를 받아 진행한 사례입니다.`,
      href: consultationCase.href,
    },
  ];

  const internalLinks = [
    ...topic.relatedServiceLinks,
    ...topic.relatedFaqLinks,
    ...topic.relatedCaseLinks,
    ...topic.relatedKeywordLinks,
  ];

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "keyword-hub",
    serviceSlug: topic.serviceSlug,
    title: topic.title,
    h1: topic.h1,
    metaTitle: topic.metaTitle,
    description: topic.metaDescription,
    summaryParagraphs: topic.summaryParagraphs,
    costFactors: topic.costFactors,
    primaryKeywords: topic.primaryKeywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: topic.problemStatement,
    whenNeeded: topic.whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase,
    consultationCases,
    legalIssues: topic.lawyerNeededCases,
    precautions: topic.precautions,
    procedures: topic.procedures,
    documents: topic.documents,
    costGuide: topic.costGuide,
    faqs: topic.faqs,
    lawyerOpinion: buildLawyerOpinion(config.regionLabel, topic.title),
    directionsNote: buildDirectionsNote(config),
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: getRelatedBlogPosts(topic.serviceSlug),
    relatedServiceLinks: internalLinks,
    relatedRegionLinks: [],
  };
}
