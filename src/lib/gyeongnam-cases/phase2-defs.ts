import type { GyeongnamLandingDef } from "./types";

/**
 * 2·3차 후보 — 고유 콘텐츠 미완성이면 published:false
 * 빈 페이지로 공개하지 않음
 */
function draft(
  partial: Omit<GyeongnamLandingDef, "published"> & { published?: boolean },
): GyeongnamLandingDef {
  return {
    ...partial,
    published: false,
  };
}

const PLACEHOLDER_FAQ = [
  {
    question: "이 지역 페이지는 언제 공개되나요?",
    answer:
      "고유 상담 상황·FAQ·서류·비용 안내가 품질 기준(80점)을 충족하면 공개합니다. 현재는 상위 경남·시 페이지에서 안내합니다.",
  },
  {
    question: "지금은 어디로 문의하면 되나요?",
    answer:
      "경남 법무사 업무 허브 또는 김해·양산·창원 상속등기 페이지에서 상담을 신청해 주세요.",
  },
  {
    question: "경남에 지점이 있나요?",
    answer:
      "없습니다. 부산 해운대 사무소이며 관할·비대면 가능 여부를 검토합니다.",
  },
];

export const phase2GyeongnamDefs: GyeongnamLandingDef[] = [
  draft({
    slug: "주촌상속등기법무사",
    regionName: "주촌",
    parentRegion: "경남 김해",
    regionType: "생활권",
    pageType: "inheritance",
    priority: 2,
    primaryKeyword: "김해 주촌 상속등기",
    secondaryKeywords: ["주촌 아파트 상속"],
    seoTitle: "김해 주촌 상속등기｜신축 아파트와 토지 상속 절차",
    metaDescription:
      "김해 주촌 상속등기 안내 후보. 고유 콘텐츠 보강 후 공개 예정입니다.",
    h1: "김해 주촌 신축 아파트·토지 상속등기",
    heroDescription:
      "주촌 생활권 신축 아파트와 인근 토지가 함께 상속되는 경우를 위한 페이지입니다. 공개 전 상위 김해 상속등기 안내를 이용해 주세요.",
    officeDisclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 주촌·김해에 별도 지점이 있는 것은 아닙니다.",
    propertyTypes: ["아파트", "토지"],
    scenarioTitles: ["신축 아파트 상속", "토지 동시 상속"],
    scenarioBodies: [
      "일반적인 상담 유형으로, 입주·잔금 일정과 상속등기 순서를 맞춥니다.",
      "아파트와 토지 서류를 분리해 누락을 줄입니다.",
    ],
    uniqueFaqs: PLACEHOLDER_FAQ,
    relatedRegionSlugs: ["김해상속등기법무사", "경남법무사업무"],
    relatedServiceSlugs: ["경남상속등기법무사"],
    ctaTitle: "김해 상속등기로 문의",
    ctaDescription: "주촌 주소와 상속인 수만 알려주셔도 됩니다.",
    jurisdictionNote: "상속등기는 관할 특례 적용 여부를 사건별로 검토합니다.",
    visitHint: "가까운 경우 부산 방문 상담도 가능합니다.",
    remoteHint: "서류 사진으로 먼저 검토할 수 있습니다.",
  }),
  draft({
    slug: "진영상속등기법무사",
    regionName: "진영",
    parentRegion: "경남 김해",
    regionType: "생활권",
    pageType: "inheritance",
    priority: 2,
    primaryKeyword: "김해 진영 상속등기",
    secondaryKeywords: ["진영 농지 상속"],
    seoTitle: "김해 진영 상속등기 법무사｜아파트·농지·공장 부동산",
    metaDescription: "김해 진영 상속등기 후보 페이지. 품질 보강 후 공개.",
    h1: "진영 아파트·농지·공장 상속등기",
    heroDescription:
      "진영권 아파트와 농지·공장 부동산이 섞인 상속을 위한 후보 페이지입니다. 현재는 김해 상속등기 안내를 이용해 주세요.",
    officeDisclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 진영에 별도 지점이 있는 것은 아닙니다.",
    propertyTypes: ["아파트", "농지", "공장"],
    scenarioTitles: ["농지·아파트 혼합", "공장 토지·건물"],
    scenarioBodies: [
      "일반적인 상담 유형으로 지번 목록부터 맞춥니다.",
      "사업 관련 권리는 등기와 구분해 안내합니다.",
    ],
    uniqueFaqs: PLACEHOLDER_FAQ,
    relatedRegionSlugs: ["김해상속등기법무사", "경남법무사업무"],
    relatedServiceSlugs: ["경남상속등기법무사"],
    ctaTitle: "김해 상속등기로 문의",
    ctaDescription: "진영 부동산 종류를 알려주세요.",
    jurisdictionNote: "상속등기 관할 특례는 사건별 확인이 필요합니다.",
    visitHint: "방문이 편하면 부산 일정을 안내합니다.",
    remoteHint: "비대면으로 개요를 먼저 확인할 수 있습니다.",
  }),
  draft({
    slug: "통영상속등기법무사",
    regionName: "통영",
    parentRegion: "경남",
    regionType: "시",
    pageType: "inheritance",
    priority: 2,
    primaryKeyword: "통영 상속등기 법무사",
    secondaryKeywords: ["통영 토지 상속"],
    seoTitle: "통영 상속등기 법무사｜죽림·무전·도서지역 부동산 정리",
    metaDescription: "통영 상속등기 후보. 고유 FAQ·상황 보강 후 공개.",
    h1: "통영 죽림·도서지역 상속부동산 정리",
    heroDescription:
      "통영 죽림·도서지역 부동산과 육지 거주 상속인을 위한 후보 페이지입니다. 공개 전에는 경남 상속등기 안내를 이용해 주세요.",
    officeDisclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 통영에 별도 지점이 있는 것은 아닙니다.",
    propertyTypes: ["아파트", "토지", "도서 부동산"],
    scenarioTitles: ["도서지역 부동산", "육지 거주 상속인"],
    scenarioBodies: [
      "일반적인 상담 유형으로 방문 횟수를 줄이는 서류 순서를 안내합니다.",
      "상속인 거주지와 부동산 소재지를 먼저 맞춥니다.",
    ],
    uniqueFaqs: PLACEHOLDER_FAQ,
    relatedRegionSlugs: ["경남상속등기법무사", "경남법무사업무"],
    relatedServiceSlugs: ["전국비대면법무사"],
    ctaTitle: "경남 상속등기로 문의",
    ctaDescription: "통영 어느 권역인지 알려주세요.",
    jurisdictionNote: "상속등기 관할 특례·비대면 범위를 검토합니다.",
    visitHint: "원본 단계가 있으면 사전 안내합니다.",
    remoteHint: "초기에는 사진·개요로 상담 가능합니다.",
  }),
  draft({
    slug: "김해상속포기한정승인",
    regionName: "김해",
    parentRegion: "경남",
    regionType: "시",
    pageType: "renunciation",
    priority: 2,
    primaryKeyword: "김해 상속포기 한정승인",
    secondaryKeywords: ["김해 한정승인"],
    seoTitle: "김해 상속포기·한정승인｜부모님 채무를 뒤늦게 확인했다면",
    metaDescription:
      "김해 상속포기·한정승인 후보. 법정 관할 법원 신청임을 명시하며 품질 보강 후 공개.",
    h1: "김해에서 상속포기·한정승인을 검토할 때",
    heroDescription:
      "상속포기·한정승인은 법정 관할 법원에 신청됩니다. 비대면 상담은 가능하나 「아무 법원에나」와는 다릅니다. 공개 전 업무안내·상담을 이용해 주세요.",
    officeDisclosure:
      "다옴법무사사무소는 부산 해운대구에 있으며 김해에 별도 지점이 있는 것은 아닙니다.",
    propertyTypes: ["채무·재산 목록"],
    scenarioTitles: ["채무를 뒤늦게 확인", "재산·빚을 아직 모름"],
    scenarioBodies: [
      "일반적인 상담 유형으로 기한과 관할을 먼저 확인합니다.",
      "한정승인·포기 선택 기준을 서류 개요로 안내합니다.",
    ],
    uniqueFaqs: PLACEHOLDER_FAQ,
    relatedRegionSlugs: ["김해상속등기법무사", "경남법무사업무"],
    relatedServiceSlugs: ["/services/inheritance-renunciation"],
    ctaTitle: "상속포기·한정승인 상담",
    ctaDescription: "사망일과 채무 인지 시점만 알려주셔도 됩니다.",
    jurisdictionNote:
      "상속포기·한정승인은 법정 관할 법원이 유지됩니다. 상담·서류 조율은 비대면 가능한 경우가 많습니다.",
    visitHint: "관할·기한 설명은 방문·통화 모두 가능합니다.",
    remoteHint: "초기 상담은 비대면으로 시작할 수 있습니다.",
  }),
];
