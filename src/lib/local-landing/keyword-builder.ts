import { getAllContent } from "@/lib/content/loader";
import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import { districtProfiles } from "./districts";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import {
  championExtraFaqs,
  championExtraRelatedLinks,
  championExtraSummaryParagraphs,
  championExtraWhenNeeded,
  championSituationMap,
} from "./inheritance-champion-modules";
import { getKeywordTopic } from "./keyword-topics";
import { corporateLegalExtraFaqs } from "./corporate-legal-operations-modules";

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

  const isInheritanceChampion = topic.slug === "부산상속법무사";
  const isCorporateLegalOps = topic.slug === "부산법인법무사";

  const summaryParagraphs = isInheritanceChampion
    ? [...topic.summaryParagraphs, ...championExtraSummaryParagraphs]
    : topic.summaryParagraphs;
  const whenNeeded = isInheritanceChampion
    ? [...topic.whenNeeded, ...championExtraWhenNeeded]
    : topic.whenNeeded;
  const procedures = isInheritanceChampion
    ? [
        "상황별 필요 절차 가리기(아래 선택표)",
        ...championSituationMap,
        ...topic.procedures,
      ]
    : topic.procedures;
  const faqs = isInheritanceChampion
    ? [...topic.faqs, ...championExtraFaqs]
    : isCorporateLegalOps
      ? [...topic.faqs, ...corporateLegalExtraFaqs]
      : topic.faqs;

  const corporateLegalExtraLinks = isCorporateLegalOps
    ? [
        { href: "/부산부동산등기", label: "회사 명의 부동산등기 안내" },
        { href: "/부산기업채권관리", label: "미수금·지급명령 신청서류" },
        { href: "/부산법인해산전확인사항", label: "해산 전 확인사항" },
        { href: "/부산사업목적변경등기", label: "사업목적 변경등기" },
      ]
    : [];

  const internalLinks = [
    ...topic.relatedServiceLinks,
    ...corporateLegalExtraLinks,
    ...(isInheritanceChampion ? championExtraRelatedLinks : []),
    ...topic.relatedFaqLinks,
    ...topic.relatedCaseLinks,
    ...topic.relatedKeywordLinks,
  ];

  const lawyerOpinion = isInheritanceChampion
    ? `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 상속등기·상속포기·한정승인 등 법무사가 수행할 수 있는 상속 관련 절차를 사안에 따라 확인합니다. 등기부·가족관계·채무 자료를 함께 보며 ‘지금 무엇부터 해야 하는지’를 먼저 정리하고, 관할 등기소·가정법원·필요 서류·예상 비용을 항목별로 안내합니다. 작성·검토: ${lawyerProfileMeta.fullTitle}(다옴법무사사무소). 최종확인일 2026-08-07.`
    : buildLawyerOpinion(config.regionLabel, topic.title);

  const ctaDescription = isInheritanceChampion
    ? "내 상속 상황에 필요한 절차를 확인하고 싶으시면 사망일·상속인·확인된 재산·채무만 남겨 주세요. 준비서류와 다음 단계부터 안내합니다."
    : isCorporateLegalOps
      ? "대표·임원·본점·목적·자본 등 회사에 생긴 변경과 등기부 현황만 남겨 주시면, 필요한 등기와 준비서류부터 확인합니다."
      : consultationCopy.default;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "keyword-hub",
    serviceSlug: topic.serviceSlug,
    title: topic.title,
    h1: topic.h1,
    metaTitle: topic.metaTitle,
    description: topic.metaDescription,
    summaryParagraphs,
    costFactors: topic.costFactors,
    primaryKeywords: topic.primaryKeywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: topic.problemStatement,
    whenNeeded,
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase,
    consultationCases,
    legalIssues: topic.lawyerNeededCases,
    precautions: topic.precautions,
    procedures,
    documents: topic.documents,
    costGuide: topic.costGuide,
    faqs,
    lawyerOpinion,
    directionsNote: buildDirectionsNote(config),
    ctaDescription,
    relatedBlogHrefs: getRelatedBlogPosts(topic.serviceSlug),
    relatedServiceLinks: internalLinks,
    relatedRegionLinks: [],
  };
}
