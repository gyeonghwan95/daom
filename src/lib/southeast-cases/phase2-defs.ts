import type { SoutheastLandingDef } from "./types";

/** 2·3차 후보 — 품질 미달 시 비공개 */
function draft(
  partial: Omit<SoutheastLandingDef, "published">,
): SoutheastLandingDef {
  return { ...partial, published: false };
}

const FAQ = [
  {
    question: "이 페이지는 언제 공개되나요?",
    answer:
      "고유 상담 상황·FAQ·서류·비용 안내가 품질 기준을 충족하면 공개합니다. 지금은 상위 허브·시 페이지를 이용해 주세요.",
  },
  {
    question: "지금은 어디로 문의하면 되나요?",
    answer: "울산·대구·경북 업무 허브 또는 해당 시 상속등기 페이지에서 상담을 신청해 주세요.",
  },
  {
    question: "해당 지역에 지점이 있나요?",
    answer:
      "없습니다. 부산 해운대 사무소이며 관할·비대면 가능 여부를 검토합니다.",
  },
];

export const southeastPhase2Defs: SoutheastLandingDef[] = [
  draft({
    slug: "울산방어동상속등기",
    regionGroup: "울산",
    regionName: "방어동",
    parentRegion: "울산 동구",
    regionType: "동",
    pageType: "inheritance",
    priority: 2,
    primaryKeyword: "울산 방어동 상속등기",
    secondaryKeywords: ["방어동 아파트 상속"],
    seoTitle: "울산 방어동 상속등기｜아파트·주택 비대면 진행",
    metaDescription: "울산 방어동 상속등기 후보. 품질 보강 후 공개.",
    h1: "울산 방어동 아파트·주택 상속등기",
    heroDescription:
      "방어동 생활권 상속등기 후보 페이지입니다. 공개 전에는 울산 동구·울산 상속등기 안내를 이용해 주세요.",
    officeDisclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 울산 방어동에 별도 지점이 있는 것은 아닙니다.",
    legalScopeNotice: "상속등기 관할 특례는 사건별 확인이 필요합니다.",
    propertyTypes: ["아파트", "주택"],
    scenarioTitles: ["아파트 상속", "타지역 상속인"],
    scenarioBodies: [
      "일반적인 상담 유형으로 서류 개요를 먼저 확인합니다.",
      "상속인 거주지와 부동산 소재지를 맞춥니다.",
    ],
    uniqueFaqs: FAQ,
    relatedRegionSlugs: ["울산동구상속등기법무사", "울산법무사업무"],
    relatedServiceSlugs: ["울산상속등기법무사"],
    ctaTitle: "울산 상속등기로 문의",
    ctaDescription: "방어동 주소와 상속인 수만 알려주셔도 됩니다.",
    visitHint: "가까운 경우 부산 방문도 가능합니다.",
    remoteHint: "서류 사진으로 먼저 검토할 수 있습니다.",
  }),
  draft({
    slug: "영주상속등기법무사",
    regionGroup: "경북",
    regionName: "영주",
    parentRegion: "경북",
    regionType: "시",
    pageType: "inheritance",
    priority: 2,
    primaryKeyword: "영주 상속등기 법무사",
    secondaryKeywords: ["영주 토지 상속"],
    seoTitle: "영주 상속등기 법무사｜가흥·휴천·풍기 부동산",
    metaDescription: "영주 상속등기 후보. 고유 콘텐츠 보강 후 공개.",
    h1: "영주 가흥·풍기 상속부동산 정리",
    heroDescription:
      "영주 시내·풍기권 토지·주택 상속 후보 페이지입니다. 공개 전에는 경북 상속등기·토지상속 안내를 이용해 주세요.",
    officeDisclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 영주에 별도 지점이 있는 것은 아닙니다.",
    legalScopeNotice: "상속등기 관할 특례·비대면 범위를 사건별로 검토합니다.",
    propertyTypes: ["주택", "농지", "임야"],
    scenarioTitles: ["오래된 토지", "타지역 상속인"],
    scenarioBodies: [
      "일반적인 상담 유형으로 지번 목록부터 맞춥니다.",
      "상속인이 수도권·부산에 있어도 서류 순서를 안내합니다.",
    ],
    uniqueFaqs: FAQ,
    relatedRegionSlugs: ["경북법무사업무", "경북상속등기법무사"],
    relatedServiceSlugs: ["경북토지상속등기"],
    ctaTitle: "경북 상속등기로 문의",
    ctaDescription: "영주 어느 권역인지 알려주세요.",
    visitHint: "원본이 필요하면 사전 안내합니다.",
    remoteHint: "초기 상담은 비대면으로 가능합니다.",
  }),
  draft({
    slug: "울릉도상속등기법무사",
    regionGroup: "경북",
    regionName: "울릉",
    parentRegion: "경북",
    regionType: "군",
    pageType: "inheritance",
    priority: 3,
    primaryKeyword: "울릉도 상속등기 법무사",
    secondaryKeywords: ["울릉도 비대면 상속"],
    seoTitle: "울릉도 상속등기 법무사｜육지 거주 상속인의 비대면 진행",
    metaDescription: "울릉도 상속등기 후보. 품질 보강 후 공개.",
    h1: "울릉도 부동산 비대면 상속등기",
    heroDescription:
      "육지 거주 상속인의 울릉도 부동산 상속 후보 페이지입니다. 공개 전에는 경북 비대면·토지상속 안내를 이용해 주세요.",
    officeDisclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 울릉도에 별도 지점이 있는 것은 아닙니다.",
    legalScopeNotice: "상속등기 관할 특례와 원본 전달 방법을 사건별로 안내합니다.",
    propertyTypes: ["토지", "주택"],
    scenarioTitles: ["육지 거주 상속인", "여러 필지"],
    scenarioBodies: [
      "일반적인 상담 유형으로 방문 부담을 줄이는 서류 순서를 안내합니다.",
      "필지 누락을 막는 목록 작성이 중요합니다.",
    ],
    uniqueFaqs: FAQ,
    relatedRegionSlugs: ["경북법무사업무", "경북토지상속등기"],
    relatedServiceSlugs: ["전국비대면법무사"],
    ctaTitle: "경북 상속등기로 문의",
    ctaDescription: "울릉도 주소와 상속인 거주지를 알려주세요.",
    visitHint: "원본 단계는 사전 안내합니다.",
    remoteHint: "초기에는 비대면으로 개요를 확인합니다.",
  }),
  draft({
    slug: "울산상속포기한정승인",
    regionGroup: "울산",
    regionName: "울산",
    regionType: "광역시",
    pageType: "renunciation",
    priority: 2,
    primaryKeyword: "울산 상속포기 한정승인",
    secondaryKeywords: ["울산 한정승인"],
    seoTitle: "울산 상속포기·한정승인｜채무를 뒤늦게 확인했다면",
    metaDescription: "울산 상속포기·한정승인 후보. 법정 관할 명시 후 공개.",
    h1: "울산 상속포기·한정승인 검토",
    heroDescription:
      "상속포기·한정승인은 법정 관할 법원에 신청됩니다. 공개 전 업무안내·상담을 이용해 주세요.",
    officeDisclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 울산에 별도 지점이 있는 것은 아닙니다.",
    legalScopeNotice:
      "상속포기·한정승인은 법정 관할 법원이 유지됩니다. 상담·서류 조율은 비대면 가능한 경우가 많습니다.",
    propertyTypes: ["채무·재산 목록"],
    scenarioTitles: ["채무 뒤늦게 확인", "재산·빚 미확인"],
    scenarioBodies: [
      "일반적인 상담 유형으로 기한과 관할을 먼저 확인합니다.",
      "포기·한정승인 선택 기준을 안내합니다.",
    ],
    uniqueFaqs: FAQ,
    relatedRegionSlugs: ["울산법무사업무", "울산상속등기법무사"],
    relatedServiceSlugs: ["/services/inheritance-renunciation"],
    ctaTitle: "상속포기·한정승인 상담",
    ctaDescription: "사망일과 채무 인지 시점을 알려주세요.",
    visitHint: "관할 설명은 방문·통화 모두 가능합니다.",
    remoteHint: "초기 상담은 비대면으로 시작할 수 있습니다.",
  }),
];
