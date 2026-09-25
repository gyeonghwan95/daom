import { getAllContent } from "@/lib/content/loader";
import { consultationCopy } from "@/lib/consultation";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import { districtProfiles } from "./districts";
import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import { getJurisdictionGuide } from "./expansion/builder-expansion";
import {
  busanInheritanceHubReviewedLabel,
  championExtraFaqs,
  championExtraRelatedLinks,
  championExtraSummaryParagraphs,
  championExtraWhenNeeded,
} from "./inheritance-champion-modules";
import { getKeywordTopic } from "./keyword-topics";
import { corporateLegalExtraFaqs } from "./corporate-legal-operations-modules";
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
  const topic = withRegionLabel(regionLabel, title);
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
  const isInheritanceChampion = topic.slug === "부산상속법무사";
  const isCorporateLegalOps = topic.slug === "부산법인법무사";
  const topicTitleWithRegion = withRegionLabel(config.regionLabel, topic.title);

  const consultationCase = isInheritanceChampion
    ? {
        title: "해운대 아파트 상속등기",
        summary:
          "해운대구 아파트 상속인 3명 사건. 협의 내용과 해외 거주 상속인 서류를 확인한 뒤 배우자 명의로 상속등기를 진행했습니다.",
        href: "/services/cases/haeundae-inheritance-registration-case",
      }
    : isRegistryHub
      ? {
          title: "센텀 오피스텔 매매 소유권이전",
          summary:
            "센텀 일대 오피스텔 매매에 따른 소유권이전등기. 등기부·잔금일·취득세 일정을 맞춰 접수했습니다.",
          href: "/services/cases/centum-ownership-transfer-case",
        }
      : isCorporateLegalOps
        ? {
            title: "수영구 법인설립등기 사례",
            summary:
              "수영구 본점 1인 대표 주식회사 설립등기. 정관·자본금·본점 사용 승낙을 확인한 뒤 설립등기를 접수했습니다.",
            href: "/services/cases/suyeong-company-establishment-case",
          }
        : {
            title: `${topicTitleWithRegion} 진행 안내`,
            summary: `${config.regionLabel}에서 ${config.caseAngle ?? topic.caseAngle ?? topic.title}을 진행할 때는 필요 서류·기간·비용을 사건 내용에 맞춰 확인합니다.`,
            href: config.relatedCaseSlug ?? topic.relatedCaseSlug
              ? `/services/cases/${config.relatedCaseSlug ?? topic.relatedCaseSlug}`
              : topic.relatedCaseLinks[0]?.href,
          };

  const consultationCases = isInheritanceChampion
    ? [
        consultationCase,
        {
          title: "채무 불명확 한정승인 상담",
          summary:
            "동래 거주 의뢰인이 부모님 채무를 정확히 모르는 상태에서 상담하셨습니다. 재산·채무 조사 범위를 정한 뒤 한정승인 신고와 이후 상속등기 순서를 안내한 사례입니다.",
          href: "/services/cases/dongnae-qualified-acceptance-consultation",
        },
        {
          title: "채무 과다 상속포기 상담",
          summary:
            "재송동 인근 의뢰인이 채무가 재산보다 많은 상황을 상담하셨습니다. 후순위 효과를 안내한 뒤 상속포기 신고를 준비한 사례입니다.",
          href: "/services/cases/jaesong-inheritance-renunciation-consultation",
        },
      ]
    : isRegistryHub
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
      : isCorporateLegalOps
        ? [
            consultationCase,
            {
              title: "연제구 임원변경등기 사례",
              summary:
                "연제구 소재 법인이 대표이사 변경 후 등기 기한이 임박해 상담하셨습니다. 의사록·취임승낙서를 점검해 기한 내 접수를 준비한 사례입니다.",
              href: "/services/cases/yeonje-director-change-case",
            },
          ]
        : [
            consultationCase,
            {
              title: `${config.regionLabel} 서류 준비`,
              summary: `등기부·계약서를 미리 검토하면 누락 서류와 접수 일정을 맞추기 쉽습니다.`,
            },
            {
              title: `${config.regionLabel} 원격 진행`,
              summary: `카카오톡 상담 후 방문 없이 서류를 받아 진행할 수 있는 사건이 있습니다.`,
              href: consultationCase.href,
            },
          ];

  const summaryParagraphs = isInheritanceChampion
    ? [...topic.summaryParagraphs, ...championExtraSummaryParagraphs]
    : topic.summaryParagraphs;
  const whenNeeded = isInheritanceChampion
    ? championExtraWhenNeeded.length > 0
      ? [...topic.whenNeeded, ...championExtraWhenNeeded]
      : topic.whenNeeded
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
  const renunciationOwnerLink =
    config.serviceSlug === "inheritance-renunciation"
      ? [
          {
            href: "/부산상속포기",
            label: "부산 전체 상속포기 기한·후순위 안내",
          },
        ]
      : [];

  const championPrimaryLinks = [
    { href: "/부산상속등기", label: "부산 상속등기 — 서류와 진행 순서" },
    { href: "/부산한정승인", label: "부산 한정승인 — 상속채무가 걱정될 때" },
    { href: "/부산상속포기", label: "부산 상속포기 안내" },
    { href: "/상속", label: "상속 종합 허브" },
    {
      href: "/contact/inquiry?field=inheritance-registration",
      label: "등기·포기·한정 중 무엇부터 확인할지",
    },
  ];

  const internalLinks = isInheritanceChampion
    ? championPrimaryLinks
    : [
        ...topic.relatedServiceLinks,
        ...renunciationOwnerLink,
        ...corporateLegalExtraLinks,
        ...topic.relatedFaqLinks,
        ...topic.relatedCaseLinks,
        ...topic.relatedKeywordLinks,
      ];

  const lawyerOpinion = isInheritanceChampion
    ? `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 상속등기·상속포기·한정승인 등 법무사가 수행할 수 있는 상속 관련 절차를 사안에 따라 확인합니다. 등기부·가족관계·채무 자료를 함께 보며 ‘지금 무엇부터 해야 하는지’를 먼저 정리하고, 관할 등기소·가정법원·필요 서류·예상 비용을 항목별로 안내합니다. 작성·검토: ${lawyerProfileMeta.fullTitle}(다옴법무사사무소). 최종확인일 ${busanInheritanceHubReviewedLabel}.`
    : isRegistryHub
      ? `${lawyerProfileMeta.fullTitle}는 해운대·센텀에서 부동산·상속·법인등기를 직접 상담·진행합니다. 등기 종류가 같아도 등기부 상태에 따라 순서가 달라질 수 있어, 계약서나 현황을 확인한 뒤 지금 필요한 등기부터 안내합니다.`
      : buildLawyerOpinion(config.regionLabel, topic.title);

  const ctaDescription = isInheritanceChampion
    ? "사망일·상속인 구성·부동산·채무 여부를 알려주시면 먼저 확인할 절차를 구분합니다."
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
            title: "지금 어떤 상황인가요?",
            body: "가까운 항목을 고르면 다음 안내가 갈립니다. 상속포기 기한·후순위 상세는 부산 상속포기 안내에서, 한정승인은 한정승인 안내에서 이어집니다.",
            items: [
              "A. 부동산 명의를 바꾸려 함 → 상속등기",
              "B. 빚이 걱정됨 → 상속포기 / 한정승인",
              "C. 3개월이 지났거나 임박함 → 포기·한정·특별한정승인 확인",
              "D. 가족관계가 복잡함 → 미성년 / 해외 / 연락두절 / 대습 / 재상속",
              "E. 오래된 부동산·여러 세대 명의 → 권리관계부터 확인",
            ],
            links: [
              { href: "/부산상속등기", label: "부동산 명의이전(상속등기)" },
              { href: "/부산상속포기", label: "부산 상속포기 — 3개월·후순위" },
              { href: "/부산한정승인", label: "한정승인 안내" },
              { href: "/특별한정승인", label: "특별한정승인 안내" },
            ],
          },
          {
            title: "상속에서 가장 먼저 확인할 3가지",
            body: "장례·사망신고가 끝나도 부동산 명의는 자동으로 바뀌지 않습니다. 등기 서류보다 아래 세 가지를 먼저 맞춥니다.",
            items: [
              "1. 사망일·인지일 — 포기·한정승인 3개월 기산",
              "2. 상속인 구성 — 배우자·자녀·대습·재혼",
              "3. 알고 있는 재산 vs 채무 — 등기인지 승인 방식인지",
            ],
            links: [
              { href: "/사망자재산채무조회", label: "재산·채무 조회 안내" },
              { href: "/부모님사망후해야할일", label: "부모님 사망 후 해야 할 일" },
            ],
          },
          {
            title: "상속등기·상속포기·한정승인은 어떻게 다른가",
            body: "세 절차는 목적·관할·기한이 다릅니다. 이 페이지에서는 깊이 들어가지 않고 갈래만 가른 뒤 각 안내로 보냅니다.",
            items: [
              "상속등기 — 등기소 명의이전. 채무 걱정이 거의 없을 때",
              "상속포기 — 가정법원 신고. 상속 자체를 받지 않을 때",
              "한정승인 — 가정법원 신고. 재산 한도로만 채무를 부담할 때",
              "창구: 등기소(명의이전) / 가정법원(포기·한정)",
            ],
            links: [
              { href: "/부산상속등기", label: "부산 상속등기" },
              { href: "/부산상속포기", label: "부산 상속포기" },
              { href: "/부산한정승인", label: "부산 한정승인" },
            ],
          },
          {
            title: "부산에서 상속전문 법무사를 찾을 때 확인할 것",
            body: "공인 ‘전문’ 자격처럼 표방하지 않습니다. 검색 의도는 대개 ‘상황이 달라져도 절차를 가릴 수 있는가’입니다. 아래 기준으로 보시면 됩니다.",
            items: [
              "상속등기만 필요한지, 포기·한정이 먼저인지 구분하는지",
              "3개월 기한을 등기·세금 일정과 따로 보는지",
              "미성년·해외·연락두절·대습을 어떻게 안내하는지",
              "오래된 미등기·상속 후 매도까지 순서를 설명하는지",
            ],
            links: [
              { href: "/미성년상속인", label: "미성년 상속인" },
              { href: "/해외거주상속인", label: "해외 거주 상속인" },
              { href: "/연락두절상속인", label: "연락두절 상속인" },
            ],
          },
          {
            title: "상속인이 복잡하거나 오래된 부동산일 때",
            body: "미성년은 특별대리, 해외는 위임·인증, 대습·재혼은 상속인 범위 재확인, 연락두절은 등기·승인 전 별도 검토가 필요할 수 있습니다. 오래된 명의는 중간 상속·등기부 이력부터 맞춥니다.",
            items: [
              "미성년·해외·연락두절 — 해당 안내로 이동",
              "대습·재혼가정 — 가족관계부터 재확인",
              "특정 명의·협의분할 — 협의서와 상속등기",
              "상속 후 매도 — 등기·잔금·취득세 순서",
              "오래된 미등기 — 권리관계·중간 상속 확인",
            ],
            links: [
              ...championExtraRelatedLinks,
              { href: "/재혼가정상속", label: "재혼가정 상속" },
            ],
          },
          {
            title: "필요한 최소 정보와 상담 방식",
            body: `상담 전에는 긴 서류 목록보다 사망일·상속인·알고 있는 재산·채무만 있으면 됩니다. 다옴법무사사무소는 ${officeLocation.fullAddress}에 있으며 안윤정 법무사가 직접 가릅니다. 상속인이 다른 지역·해외에 있어도 자료 검토·서류 전달 방식을 안내할 수 있습니다.`,
            items: [
              "최소 정보: 사망일·가족관계·재산·채무·처분 여부",
              "방문·전화·카카오톡 중 편한 채널",
              "관할은 사건 유형(등기소/가정법원)에 따라 확인",
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
