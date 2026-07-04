import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import { districtProfiles } from "./districts";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import { getPublicAgencyRegistrationContent } from "./public-agency-registration-content";

export function buildPublicAgencyRegistrationPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const content = getPublicAgencyRegistrationContent();
  const district = districtProfiles[config.regionKey];
  if (!district) return null;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "public-agency-registration",
    serviceSlug: config.serviceSlug,
    title: content.title,
    h1: content.h1,
    metaTitle: content.metaTitle,
    description: content.metaDescription,
    summaryParagraphs: content.heroParagraphs,
    primaryKeywords: content.primaryKeywords,
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement: content.whatIsParagraphs.join("\n\n"),
    whenNeeded: content.institutionTypes.map((t) => t.title),
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase: {
      title: "부산 공기업 임원변경·본점이전 등기 검토",
      summary:
        "부산 소재 출자·출연기관 담당자가 이사회 결의 후 임원변경등기와 본점이전등기를 함께 검토하며 상담한 사례입니다. 내부 결재문서와 정관을 대조해 첨부서류 목록과 접수 일정을 정리했습니다.",
      href: "/services/cases/suyeong-company-establishment-case",
    },
    consultationCases: [],
    legalIssues: content.commonProblems,
    precautions: [content.documentsNote, content.comparisonNote],
    procedures: content.procedures,
    documents: content.documents,
    costGuide:
      "공공기관 등기업무 비용은 등기 종류, 부동산 가액, 법인 변경 항목, 촉탁 여부, 보정 발생 여부에 따라 달라질 수 있습니다. 법무사 수임료와 등록면허세·취득세 등은 별도이며, 과업 범위 확인 후 견적을 안내합니다.",
    faqs: content.faqs,
    lawyerOpinion: `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 부산 공공기관·공기업·지방공기업 등기업무를 상담합니다. 내부 결재문서와 등기 실무 서류를 연결하고, 촉탁·일반 신청 여부를 사건별로 검토합니다. ${officeLocation.fullAddress}에서 부산 전역 공공기관 담당자 상담을 받습니다.`,
    directionsNote:
      district.directionsFromOffice ??
      `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다.`,
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: [
      {
        href: "/blog/director-change-registration-deadline-guide",
        label: "임원변경등기 기한 안내",
      },
      {
        href: "/blog/company-establishment-registration-checklist",
        label: "법인설립 등기 체크리스트",
      },
    ],
    relatedServiceLinks: content.internalLinks,
    relatedRegionLinks: [],
  };
}
