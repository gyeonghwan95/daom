import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import { districtProfiles } from "./districts";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import { getPreservationRegistrationContent } from "./preservation-registration-content";

export function buildPreservationRegistrationPage(
  config: LocalLandingConfig,
): LocalLandingPage | null {
  const content = getPreservationRegistrationContent();
  const district = districtProfiles[config.regionKey];
  if (!district) return null;

  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "preservation-registration",
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
    whenNeeded: content.buildingTypes.map((b) => b.title),
    jurisdictionGuide: getJurisdictionGuide(config),
    consultationCase: {
      title: `${config.regionLabel} 신축 상가 보존등기 상담`,
      summary:
        "수영구 근린생활시설 신축 후 사용승인을 받은 건축주가 보존등기 서류를 정리하며 상담한 사례입니다. 건축물대장과 토지 등기를 대조해 일반건물 보존등기 순서와 예상 비용을 안내했습니다.",
      href: "/services/cases/centum-ownership-transfer-case",
    },
    consultationCases: [],
    legalIssues: content.commonProblems,
    precautions: [content.documentsNote, content.comparisonNote],
    procedures: content.procedures,
    documents: content.documents,
    costGuide:
      "신축건물 보존등기 비용은 건물 종류·집합건물 여부·대지권 정리·세금·국민주택채권 매입 여부에 따라 달라질 수 있습니다. 법무사 수임료와 등록면허세·취득세 등은 별도이며, 상담 시 항목별로 구분해 안내합니다.",
    faqs: content.faqs,
    lawyerOpinion: `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 부산 신축건물 보존등기 사건을 상담합니다. 건축주·건축사사무소·시행사에서 넘어온 자료를 등기 실무 서류와 연결해 보정을 줄이는 방향으로 안내합니다. ${officeLocation.fullAddress}에 위치한 사무소에서 해운대·센텀·재송동·수영·연제·동래·남구·기장 등 부산 전역 의뢰를 받습니다.`,
    directionsNote:
      district.directionsFromOffice ??
      `다옴법무사사무소는 ${officeLocation.fullAddress}에 있습니다. 네이버 예약 후 방문 상담이 가능합니다.`,
    ctaDescription: consultationCopy.default,
    relatedBlogHrefs: [
      {
        href: "/blog/new-apartment-ownership-transfer",
        label: "신축 아파트 소유권이전 절차",
      },
      {
        href: "/blog/busan-real-estate-registration-documents",
        label: "부산 부동산등기 필요서류",
      },
    ],
    relatedServiceLinks: content.internalLinks,
    relatedRegionLinks: [],
  };
}
