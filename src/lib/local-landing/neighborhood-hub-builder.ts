import { getAllContent } from "@/lib/content/loader";
import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import { districtProfiles } from "./districts";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import { getNeighborhoodTopic } from "./neighborhood-hub-topics";
import { buildStationSectionsForHost } from "@/lib/seo/station-sections";
import { withConsultHubLink } from "@/lib/seo/consult-hub-link";
import { withRegionLabel } from "./region-label";

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
  const labeled = withRegionLabel(regionLabel, title);
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${labeled} 상담을 직접 진행합니다. 관할·기한·서류는 확인된 범위만 안내합니다.`;
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
    title: `${config.regionLabel}에서 상담이 필요한 대표 상황`,
    summary: `${config.regionLabel}에서 ${config.caseAngle ?? topic.caseAngle ?? topic.title}을 검토할 때는 관할·필요 서류·일정을 사건 내용에 맞춰 확인합니다. 가상의 절차 예시이며 실제 사건 기록이 아닙니다.`,
    href: config.relatedCaseSlug ?? topic.relatedCaseSlug
      ? `/services/cases/${config.relatedCaseSlug ?? topic.relatedCaseSlug}`
      : undefined,
  };

  const consultationCases = [
    consultationCase,
    {
      title: `${config.regionLabel} 서류 준비`,
      summary: `등기부·계약서를 미리 보면 누락 서류와 접수 일정을 맞추기 쉽습니다. 일반적 진행 안내이며 특정 의뢰 기록이 아닙니다.`,
    },
  ];

  const internalLinks = withConsultHubLink(config.slug, [
    ...topic.serviceLinks,
    ...topic.relatedPageLinks,
    ...(topic.relatedGuPage ? [topic.relatedGuPage] : []),
  ]);

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
    relatedRegionLinks: topic.relatedGuPage ? [topic.relatedGuPage] : [],
    neighborhoodLivingArea: topic.livingAreaBody,
    breadcrumbParent: topic.relatedGuPage,
    stationSections: buildStationSectionsForHost(`/${config.slug}`),
  };
}
