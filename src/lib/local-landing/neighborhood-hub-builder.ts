import { getAllContent } from "@/lib/content/loader";
import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import { districtProfiles } from "./districts";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import { getNeighborhoodTopic } from "./neighborhood-hub-topics";

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
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${regionLabel} ${title} 사건을 직접 상담·진행합니다. ${regionLabel} 생활권 특성에 맞춰 관할 등기소·법원과 필요 서류를 먼저 정리해 드립니다. 부산 전역 의뢰인께는 절차·비용을 항목별로 설명하며, 급한 기한이 있으면 우선순위를 표시합니다.`;
}

function buildDirectionsNote(config: LocalLandingConfig): string {
  const district = districtProfiles[config.regionKey];
  return (
    district?.directionsFromOffice ??
    `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. ${config.regionLabel}에서 센텀시티역·벡스코 인근으로 방문하실 수 있으며, 네이버 예약 후 상담해 주세요.`
  );
}

export function buildNeighborhoodHubPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const key = config.neighborhoodKey ?? config.slug;
  const topic = getNeighborhoodTopic(key);
  if (!topic) return null;

  const district = districtProfiles[config.regionKey];
  if (!district) return null;

  const consultationCase = {
    title: `${config.regionLabel} ${topic.title} 상담 사례`,
    summary: `최근 ${config.regionLabel}에서 상담한 사례입니다. ${config.caseAngle ?? topic.caseAngle ?? topic.title}. 의뢰인 상황에 맞춰 관할·필요 서류·예상 비용을 단계별로 안내했습니다.`,
    href: config.relatedCaseSlug ?? topic.relatedCaseSlug
      ? `/services/cases/${config.relatedCaseSlug ?? topic.relatedCaseSlug}`
      : undefined,
  };

  const consultationCases = [
    consultationCase,
    {
      title: `${config.regionLabel} 서류 준비 상담`,
      summary: `등기부·계약서를 미리 검토해 누락 서류를 줄이고 접수 일정을 맞춘 사례입니다.`,
    },
    {
      title: `${config.regionLabel} 원격 진행`,
      summary: `카카오톡 상담 후 방문 없이 서류를 받아 진행한 사례입니다.`,
      href: consultationCase.href,
    },
  ];

  const internalLinks = [
    ...topic.serviceLinks,
    ...topic.relatedPageLinks,
    ...(topic.relatedGuPage ? [topic.relatedGuPage] : []),
  ];

  const jurisdictionFromDistrict = getJurisdictionGuide(config);

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "neighborhood-hub",
    serviceSlug: topic.serviceSlug,
    title: topic.title,
    h1: topic.h1,
    metaTitle: topic.metaTitle,
    description: topic.metaDescription,
    summaryParagraphs: topic.summaryParagraphs,
    primaryKeywords: topic.primaryKeywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: topic.problemStatement,
    whenNeeded: topic.consultationTypes,
    jurisdictionGuide: {
      title: topic.registryGuide.title,
      address: jurisdictionFromDistrict.address,
      accessNote: jurisdictionFromDistrict.accessNote,
      jurisdictionNote: topic.registryGuide.body,
      practicalNotes: topic.registryGuide.notes,
    },
    consultationCase,
    consultationCases,
    legalIssues: topic.consultationTypes.slice(0, 4).map(
      (t) => `${config.regionLabel}에서 ${t}를 검토 중이시라면 상담을 권합니다.`,
    ),
    precautions: topic.registryGuide.notes,
    procedures: topic.procedures,
    documents: topic.documents,
    costGuide: `${config.regionLabel} 의뢰 사건도 사건 유형별로 법무사 수임료·등기 수수료·세금을 분리해 안내합니다. ${topic.livingAreaBody.slice(0, 120)}…`,
    faqs: topic.faqs,
    lawyerOpinion: buildLawyerOpinion(config.regionLabel, topic.title),
    directionsNote: buildDirectionsNote(config),
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: getRelatedBlogPosts(config.serviceSlug),
    relatedServiceLinks: internalLinks,
    relatedRegionLinks: [],
    neighborhoodLivingArea: topic.livingAreaBody,
  };
}
