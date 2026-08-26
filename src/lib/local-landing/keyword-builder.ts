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
  const topic = title.includes(regionLabel) ? title : `${regionLabel} ${title}`;
  return `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 ${topic} 사건을 직접 상담·진행합니다. 등기부·계약서·가족관계를 함께 보며 ‘지금 무엇부터 해야 하는지’를 먼저 정리해 드립니다. 부산 의뢰인께는 관할 등기소·필요 서류·예상 비용을 항목별로 설명하고, 기한이 있는 사건은 우선순위를 표시해 안내합니다.`;
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

  const isRegistryHub = topic.slug === "부산등기법무사";

  const consultationCase = isRegistryHub
    ? {
        title: "센텀 오피스텔 매매 소유권이전",
        summary:
          "센텀 일대 오피스텔 매매에 따른 소유권이전등기. 등기부·잔금일·취득세 일정을 맞춰 접수했습니다.",
        href: "/services/cases/centum-ownership-transfer-case",
      }
    : {
        title: `${config.regionLabel} ${topic.title} 상담 사례`,
        summary: `최근 ${config.regionLabel}에서 상담한 사례입니다. ${config.caseAngle ?? topic.caseAngle ?? topic.title}. 의뢰인 상황에 맞춰 필요 서류·예상 기간·비용을 단계별로 안내하고 진행했습니다.`,
        href: config.relatedCaseSlug ?? topic.relatedCaseSlug
          ? `/services/cases/${config.relatedCaseSlug ?? topic.relatedCaseSlug}`
          : topic.relatedCaseLinks[0]?.href,
      };

  const consultationCases = isRegistryHub
    ? [
        {
          title: "센텀 오피스텔 매매 소유권이전",
          summary:
            "센텀 일대 오피스텔 매매에 따른 소유권이전등기. 등기부·잔금일·취득세 일정을 맞춰 접수했습니다.",
          href: "/services/cases/centum-ownership-transfer-case",
        },
        {
          title: "해운대 아파트 상속등기",
          summary:
            "해운대구 아파트 상속인 3명 사건. 협의 내용과 해외 거주 상속인 서류를 확인한 뒤 배우자 명의로 상속등기를 진행했습니다.",
          href: "/services/cases/haeundae-inheritance-registration-case",
        },
        {
          title: "수영구 주식회사 설립등기",
          summary:
            "수영구 본점 1인 대표 주식회사 설립등기. 정관·자본금·본점 사용 승낙을 확인한 뒤 설립등기를 접수했습니다.",
          href: "/services/cases/suyeong-company-establishment-case",
        },
      ]
    : [
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
  const procedures = topic.procedures;
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
    : isRegistryHub
      ? `${lawyerProfileMeta.fullTitle}는 해운대·센텀에서 부동산·상속·법인등기를 직접 상담·진행합니다. 등기 종류가 같아도 등기부 상태에 따라 순서가 달라질 수 있어, 계약서나 현황을 확인한 뒤 지금 필요한 등기부터 안내합니다.`
      : buildLawyerOpinion(config.regionLabel, topic.title);

  const ctaDescription = isInheritanceChampion
    ? "내 상속 상황에 필요한 절차를 확인하고 싶으시면 사망일·상속인·확인된 재산·채무만 남겨 주세요. 준비서류와 다음 단계부터 안내합니다."
    : isCorporateLegalOps
      ? "대표·임원·본점·목적·자본 등 회사에 생긴 변경과 등기부 현황만 남겨 주시면, 필요한 등기와 준비서류부터 확인합니다."
      : isRegistryHub
        ? "등기부, 계약서 또는 현재 상황만 남겨 주시면 먼저 해야 할 등기와 준비서류를 구분합니다. 처음부터 모든 서류를 준비할 필요는 없습니다."
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
    extraPageSections: isInheritanceChampion
      ? [
          {
            title: "지금 필요한 상속 절차",
            body: "부동산 명의이전, 채무 걱정, 가족 간 분배는 준비서류와 기한이 다릅니다. 검색어 나열이 아니라 지금 상황에 가까운 안내로 이어가시면 됩니다.",
            items: [
              "부동산만 정리 → 상속등기",
              "빚이 걱정 → 상속포기·한정승인",
              "가족끼리 나누기 → 협의분할",
              "해외 상속인 → 특수 상속 안내",
              "3개월이 임박 → 포기·한정승인 기한 확인",
            ],
            links: [
              { href: "/부산상속등기", label: "부동산 명의이전(상속등기)" },
              { href: "/부산상속포기", label: "상속포기 안내" },
              { href: "/부산한정승인", label: "한정승인 안내" },
              { href: "/상속", label: "상속 종합 허브" },
            ],
          },
        ]
      : isRegistryHub
        ? [
            {
              title: "어떤 등기가 필요하신가요?",
              body: "원인에 따라 준비서류와 순서가 달라집니다. 부산에서 법무사에게 등기를 맡길 때는 아래 유형부터 고르시면 됩니다.",
              items: [
                "매매 잔금 → 소유권이전",
                "부모→자녀 → 증여등기",
                "상속 부동산 → 상속등기",
                "대출 상환 → 근저당말소",
                "회사 변경 → 법인등기",
              ],
              links: [
                { href: "/부산소유권이전등기", label: "소유권이전등기" },
                { href: "/부산상속등기", label: "상속등기" },
                { href: "/부산근저당말소등기", label: "근저당말소" },
                { href: "/부산법인등기", label: "법인등기" },
              ],
            },
          ]
        : [],
    relatedBlogHrefs: getRelatedBlogPosts(topic.serviceSlug),
    relatedServiceLinks: internalLinks,
    relatedRegionLinks: [],
  };
}
