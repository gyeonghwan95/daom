/**
 * B2G / 공공기관 Search Intent Registry
 * Scores are internal decision aids — not Naver volumes.
 * Trend: TREND_DATA_UNAVAILABLE (no fabricated search counts).
 *
 * Role split:
 * - PUBLIC_SECTOR_CHAMPION `/공공기관등기업무` — 정보·업무범위 Hub
 * - `/협업문의?partner=public` — 전환(문의서)
 * - `/partners` — 협업 분야 탐색
 * - `/공공기관법률교육` — 교육 Hub
 * - `/부산법인법무사` — 일반 법인절차 Champion (기관 페이지와 경쟁 금지)
 * - `/부산법무사` — 일반 소비자 Champion (기관 페이지와 경쟁 금지)
 */

export const PUBLIC_SECTOR_CHAMPION = "/공공기관등기업무";
export const PUBLIC_SECTOR_CONVERSION = "/협업문의";
export const PUBLIC_SECTOR_PARTNERS_HUB = "/partners";
export const PUBLIC_SECTOR_LECTURE_HUB = "/공공기관법률교육";
export const PUBLIC_SECTOR_LECTURE_SPECIAL = "/부산기관법률특강";
export const CORPORATE_CHAMPION = "/부산법인법무사";
export const BUSAN_GENERAL_CHAMPION = "/부산법무사";

export type PublicSectorCoverage =
  | "strong"
  | "partial"
  | "weak"
  | "missing"
  | "UNKNOWN_PERFORMANCE";

export type PublicSectorLegalScope =
  | "DIRECT"
  | "RELATED"
  | "SUPPORT"
  | "INFORMATION_ONLY"
  | "OUT_OF_SCOPE";

export type PublicSectorAction =
  | "KEEP"
  | "ADD_SECTION"
  | "ADD_FAQ"
  | "STRENGTHEN"
  | "CREATE_NEW"
  | "DO_NOT_TARGET"
  | "INTERNAL_LINK";

export type PublicSectorInstitutionType =
  | "공공기관"
  | "공기업"
  | "지방공기업"
  | "지자체"
  | "공사"
  | "공단"
  | "재단"
  | "출자출연기관"
  | "교육기관"
  | "학교법인"
  | "협회"
  | "조합"
  | "비영리기관"
  | "센터"
  | "mixed";

export type PublicSectorStaffRole =
  | "총무"
  | "법무"
  | "계약"
  | "재산관리"
  | "시설"
  | "보상"
  | "경영지원"
  | "이사회"
  | "인사"
  | "사업"
  | "교육"
  | "mixed";

export type PublicSectorQueryCluster =
  | "institution-general"
  | "registration-general"
  | "corporate-change"
  | "real-estate-property"
  | "commissioned-registration"
  | "procurement-quote"
  | "lecture-education"
  | "problem-language";

export type PublicSectorIntent = {
  id: string;
  queryCluster: PublicSectorQueryCluster;
  query: string;
  aliases?: string[];
  institutionType: PublicSectorInstitutionType | PublicSectorInstitutionType[];
  staffRole: PublicSectorStaffRole | PublicSectorStaffRole[];
  task: string;
  searchIntent: string;
  currentUrl: string;
  coverage: PublicSectorCoverage;
  businessFit: 0 | 5 | 10 | 15 | 20;
  legalScope: PublicSectorLegalScope;
  cannibalizationRisk: "LOW" | "MED" | "HIGH";
  opportunityScore: number;
  recommendedAction: PublicSectorAction;
  notes?: string;
};

/** Paths that can be grouped as PUBLIC_SECTOR in analytics (referrer/form only). */
export const PUBLIC_SECTOR_ANALYTICS_PATHS = [
  PUBLIC_SECTOR_CHAMPION,
  "/공공기관법인등기",
  "/공공기관부동산등기",
  "/공공기관촉탁등기",
  "/공공기관이전등기",
  "/공기업등기",
  "/촉탁등기",
  "/지방공기업등기",
  PUBLIC_SECTOR_LECTURE_HUB,
  PUBLIC_SECTOR_LECTURE_SPECIAL,
  "/전세사기예방교육",
  "/청년생활법률특강",
  "/창업법률교육",
] as const;

export function classifyPublicSectorPath(
  pathname: string,
): "PUBLIC_SECTOR" | "PUBLIC_SECTOR_CONVERSION" | null {
  const path = pathname.split("?")[0].split("#")[0];
  if (path === PUBLIC_SECTOR_CONVERSION || path === PUBLIC_SECTOR_PARTNERS_HUB) {
    return "PUBLIC_SECTOR_CONVERSION";
  }
  if (
    (PUBLIC_SECTOR_ANALYTICS_PATHS as readonly string[]).includes(path)
  ) {
    return "PUBLIC_SECTOR";
  }
  return null;
}

function score(parts: {
  institutionIntent: number;
  businessValue: number;
  serviceFit: number;
  contentGap: number;
  searchLikelihood: number;
  uniqueContent: number;
  localRelevance: number;
  cannibalization?: number;
  scopeRisk?: number;
  thin?: number;
  misrep?: number;
}): number {
  const base =
    parts.institutionIntent +
    parts.businessValue +
    parts.serviceFit +
    parts.contentGap +
    parts.searchLikelihood +
    parts.uniqueContent +
    parts.localRelevance;
  const penalty =
    (parts.cannibalization ?? 0) +
    (parts.scopeRisk ?? 0) +
    (parts.thin ?? 0) +
    (parts.misrep ?? 0);
  return Math.max(0, Math.min(100, base - penalty));
}

export const PUBLIC_SECTOR_INTENTS: PublicSectorIntent[] = [
  // A. 기관 종합
  {
    id: "ps-hub-busan-public",
    queryCluster: "institution-general",
    query: "부산 공공기관 법무사",
    aliases: [
      "부산 공기업 법무사",
      "부산 지자체 법무사",
      "부산 기관 법무사",
      "공공기관 법무사",
      "공기업 법무사",
      "지자체 법무사",
      "기관 법무사 업무",
    ],
    institutionType: "mixed",
    staffRole: ["총무", "법무", "경영지원"],
    task: "기관 등기·법무 업무 문의 창구 찾기",
    searchIntent: "기관 담당자가 부산에서 공공·단체 등기업무를 맡길 법무 창구를 찾음",
    currentUrl: PUBLIC_SECTOR_CHAMPION,
    coverage: "UNKNOWN_PERFORMANCE",
    businessFit: 20,
    legalScope: "DIRECT",
    cannibalizationRisk: "MED",
    opportunityScore: score({
      institutionIntent: 20,
      businessValue: 20,
      serviceFit: 20,
      contentGap: 8,
      searchLikelihood: 8,
      uniqueContent: 8,
      localRelevance: 5,
      cannibalization: 10,
    }),
    recommendedAction: "STRENGTHEN",
    notes:
      "PUBLIC_SECTOR_CHAMPION. 일반 「부산 법무사」와 별도 Intent 유지. title/H1/canonical 불변.",
  },

  // B. 등기 일반
  {
    id: "ps-reg-public",
    queryCluster: "registration-general",
    query: "공공기관 등기업무",
    aliases: [
      "부산 공공기관 등기",
      "부산 공기업 등기",
      "공공기관 등기 법무사",
      "공기업 등기 법무사",
      "지자체 등기업무",
      "기관 등기대행",
      "기관 등기업무 위탁",
      "공공기관 등기 위탁",
    ],
    institutionType: "공공기관",
    staffRole: ["총무", "법무", "재산관리"],
    task: "기관 등기 위탁·의뢰 범위 확인",
    searchIntent: "등기신청 대리·서류 작성을 기관이 외부 의뢰할 수 있는지 확인",
    currentUrl: PUBLIC_SECTOR_CHAMPION,
    coverage: "strong",
    businessFit: 20,
    legalScope: "DIRECT",
    cannibalizationRisk: "LOW",
    opportunityScore: score({
      institutionIntent: 20,
      businessValue: 20,
      serviceFit: 20,
      contentGap: 5,
      searchLikelihood: 9,
      uniqueContent: 7,
      localRelevance: 5,
    }),
    recommendedAction: "KEEP",
    notes:
      "「대행/위탁」은 등기신청 대리·서류작성 범위로만. 관공서 행정행위 대행 광고 금지.",
  },

  // C. 법인·변경
  {
    id: "ps-corp-public",
    queryCluster: "corporate-change",
    query: "공공기관 법인등기",
    aliases: [
      "공기업 법인등기",
      "재단 법인등기",
      "공공기관 임원변경등기",
      "공기업 임원변경",
      "재단 임원변경등기",
      "기관 대표자 변경등기",
      "공공기관 본점이전등기",
      "공공기관 목적변경등기",
      "공공기관 해산청산",
    ],
    institutionType: ["공공기관", "공기업", "재단", "지방공기업"],
    staffRole: ["총무", "법무", "인사", "이사회"],
    task: "법인 변경등기 필요 여부·기한·서류",
    searchIntent: "임원·대표·소재지·목적 변경 시 등기 대상인지 확인",
    currentUrl: "/공공기관법인등기",
    coverage: "partial",
    businessFit: 20,
    legalScope: "DIRECT",
    cannibalizationRisk: "MED",
    opportunityScore: score({
      institutionIntent: 18,
      businessValue: 18,
      serviceFit: 20,
      contentGap: 10,
      searchLikelihood: 8,
      uniqueContent: 8,
      localRelevance: 5,
      cannibalization: 10,
    }),
    recommendedAction: "STRENGTHEN",
    notes:
      "Spoke 유지. 일반 절차는 /부산법인법무사·/부산임원변경등기. 모든 공공기관이 회사등기 대상이라고 쓰지 않음.",
  },

  // D. 부동산·재산
  {
    id: "ps-re-public",
    queryCluster: "real-estate-property",
    query: "공공기관 부동산등기",
    aliases: [
      "기관 부동산등기",
      "공기업 부동산등기",
      "공유재산 등기",
      "국공유재산 등기",
      "기관 소유권이전등기",
      "공공기관 소유권이전",
      "공공기관 소유권보존",
      "기관 토지 등기",
      "기관 건물 등기",
      "기관 근저당 설정",
      "기관 근저당 말소",
    ],
    institutionType: ["공공기관", "지자체", "공사", "공단"],
    staffRole: ["재산관리", "시설", "총무"],
    task: "기관 부동산 취득·보존·처분·담보 등기",
    searchIntent: "공유·국유·기관 소유 부동산 등기 절차·서류 확인",
    currentUrl: "/공공기관부동산등기",
    coverage: "partial",
    businessFit: 20,
    legalScope: "DIRECT",
    cannibalizationRisk: "LOW",
    opportunityScore: score({
      institutionIntent: 20,
      businessValue: 20,
      serviceFit: 20,
      contentGap: 10,
      searchLikelihood: 8,
      uniqueContent: 9,
      localRelevance: 5,
    }),
    recommendedAction: "STRENGTHEN",
    notes: "Hub `/공공기관등기업무` 부동산 섹션 + Spoke. 신규 URL 불필요.",
  },

  {
    id: "ps-comp-transfer",
    queryCluster: "real-estate-property",
    query: "보상 소유권이전등기",
    aliases: [
      "토지보상 등기 법무사",
      "토지보상 소유권이전",
      "협의취득 등기",
      "공익사업 소유권이전",
      "공공사업 부동산등기",
      "사업시행자 등기",
    ],
    institutionType: ["공사", "공단", "지자체", "공공기관"],
    staffRole: ["보상", "사업", "재산관리"],
    task: "보상·협의취득 관련 소유권이전 등기",
    searchIntent: "보상으로 토지를 취득·이전할 때 등기 준비사항",
    currentUrl: "/공공기관이전등기",
    coverage: "partial",
    businessFit: 20,
    legalScope: "DIRECT",
    cannibalizationRisk: "LOW",
    opportunityScore: score({
      institutionIntent: 18,
      businessValue: 20,
      serviceFit: 18,
      contentGap: 12,
      searchLikelihood: 8,
      uniqueContent: 10,
      localRelevance: 5,
    }),
    recommendedAction: "ADD_SECTION",
    notes:
      "기존 `/공공기관이전등기` + Hub 보상 카드. 수용·재결 자체는 행정·송무 영역과 구분.",
  },

  // E. 촉탁
  {
    id: "ps-commissioned",
    queryCluster: "commissioned-registration",
    query: "공공기관 촉탁등기",
    aliases: [
      "지자체 촉탁등기",
      "관공서 촉탁등기",
      "등기촉탁 업무",
      "촉탁등기 서류",
      "공유재산 촉탁등기",
    ],
    institutionType: ["지자체", "공공기관", "공사"],
    staffRole: ["법무", "재산관리", "총무"],
    task: "촉탁등기 vs 신청등기 구분·지원 범위",
    searchIntent: "촉탁등기가 무엇인지, 법무사가 어디까지 도울 수 있는지",
    currentUrl: "/공공기관촉탁등기",
    coverage: "partial",
    businessFit: 10,
    legalScope: "INFORMATION_ONLY",
    cannibalizationRisk: "MED",
    opportunityScore: score({
      institutionIntent: 15,
      businessValue: 10,
      serviceFit: 8,
      contentGap: 12,
      searchLikelihood: 7,
      uniqueContent: 10,
      localRelevance: 5,
      scopeRisk: 15,
    }),
    recommendedAction: "ADD_SECTION",
    notes:
      "촉탁 자체는 관공서 행위(부동산등기법). 법무사는 SUPPORT/INFORMATION_ONLY. 「모든 관공서 촉탁 대행」 금지. `/촉탁등기` Spoke와 Hub 비교표로 흡수.",
  },

  // F. 용역·선정·견적
  {
    id: "ps-procurement",
    queryCluster: "procurement-quote",
    query: "공공기관 법무사 용역",
    aliases: [
      "부산 법무사 용역",
      "법무사 용역업체",
      "공공기관 법무사 선정",
      "부산 법무사 선정",
      "법무사 선정 공고",
      "법무사 입찰",
      "부산 법무사 입찰",
      "등기업무 용역",
      "등기 용역 법무사",
      "등기업무 법무사 선정",
      "법무사 견적",
      "법무사 견적서",
      "등기업무 견적",
      "법무사 과업범위",
    ],
    institutionType: "mixed",
    staffRole: ["계약", "총무", "법무", "경영지원"],
    task: "법무사 용역 범위·견적 요청 정보",
    searchIntent: "선정·용역·입찰·견적 전 수행범위와 필요정보 확인",
    currentUrl: `${PUBLIC_SECTOR_CONVERSION}?partner=public&service=quote`,
    coverage: "partial",
    businessFit: 20,
    legalScope: "RELATED",
    cannibalizationRisk: "HIGH",
    opportunityScore: score({
      institutionIntent: 16,
      businessValue: 20,
      serviceFit: 16,
      contentGap: 10,
      searchLikelihood: 9,
      uniqueContent: 6,
      localRelevance: 5,
      cannibalization: 20,
      misrep: 10,
    }),
    recommendedAction: "ADD_SECTION",
    notes:
      "신규 용역 랜딩 금지. Hub 견적 모듈 + `/협업문의`. 「입찰전문·조달청 지정·전담」 금지. 「부산 법무사 선정」은 `/부산법무사추천`과 구분.",
  },

  // G. 교육
  {
    id: "ps-lecture",
    queryCluster: "lecture-education",
    query: "부산 공공기관 법률교육",
    aliases: [
      "부산 공공기관 법률강사",
      "부산 공무원 법률교육",
      "공무원 생활법률 교육",
      "기관 직원 법률교육",
      "공공기관 전세사기 예방교육",
      "공공기관 청년 법률교육",
      "공공기관 창업 법률교육",
      "부산 법률 특강 강사",
      "부산 기관 외부강사 법률",
      "법무사 강사 부산",
    ],
    institutionType: ["공공기관", "지자체", "교육기관", "센터"],
    staffRole: "교육",
    task: "직원·공무원·시민 대상 법률특강 섭외",
    searchIntent: "주제·대상·시간·출강지역·문의 방법 확인",
    currentUrl: PUBLIC_SECTOR_LECTURE_HUB,
    coverage: "strong",
    businessFit: 15,
    legalScope: "RELATED",
    cannibalizationRisk: "LOW",
    opportunityScore: score({
      institutionIntent: 16,
      businessValue: 15,
      serviceFit: 18,
      contentGap: 6,
      searchLikelihood: 8,
      uniqueContent: 8,
      localRelevance: 5,
    }),
    recommendedAction: "ADD_FAQ",
    notes:
      "확인된 이력만. 청렴·지정 법정교육 불가. `/부산기관법률특강` `/전세사기예방교육` `/창업법률교육` `/강의문의` 지원.",
  },

  // H. 문제형·자연어 (페이지 생성 금지)
  {
    id: "ps-problem-land-name",
    queryCluster: "problem-language",
    query: "기관 땅 명의 이전",
    aliases: [
      "공공기관 건물 명의 변경",
      "기관 부동산 명의변경",
      "공공기관 토지 등기",
      "기관 건물 등기",
      "보상 토지 명의이전",
    ],
    institutionType: "mixed",
    staffRole: ["재산관리", "보상", "시설"],
    task: "명의이전 = 소유권이전등기 여부 확인",
    searchIntent: "직역명 없이 재산 명의 문제를 검색",
    currentUrl: PUBLIC_SECTOR_CHAMPION,
    coverage: "partial",
    businessFit: 15,
    legalScope: "DIRECT",
    cannibalizationRisk: "LOW",
    opportunityScore: score({
      institutionIntent: 18,
      businessValue: 15,
      serviceFit: 18,
      contentGap: 8,
      searchLikelihood: 7,
      uniqueContent: 6,
      localRelevance: 5,
    }),
    recommendedAction: "ADD_FAQ",
    notes: "H2/FAQ 문맥으로 해결. Exact keyword stuffing 금지.",
  },
  {
    id: "ps-problem-officer-change",
    queryCluster: "problem-language",
    query: "기관 대표 바뀜 등기",
    aliases: [
      "재단 이사 변경",
      "공기업 임원 바뀜",
      "기관 주소 변경",
      "법인등기 과태료 기관",
      "재단 임원 임기 등기",
    ],
    institutionType: ["재단", "공기업", "공공기관"],
    staffRole: ["총무", "인사", "이사회"],
    task: "대표·임원·주소 변경등기 기한",
    searchIntent: "인사·주소 변경 후 등기 필요 여부를 자연어로 검색",
    currentUrl: "/공공기관법인등기",
    coverage: "partial",
    businessFit: 15,
    legalScope: "DIRECT",
    cannibalizationRisk: "MED",
    opportunityScore: score({
      institutionIntent: 16,
      businessValue: 18,
      serviceFit: 18,
      contentGap: 8,
      searchLikelihood: 7,
      uniqueContent: 6,
      localRelevance: 5,
      cannibalization: 10,
    }),
    recommendedAction: "ADD_FAQ",
    notes: "법적 형태에 따라 등기 대상이 다름. 일반화 금지.",
  },

  // I. DO_NOT_TARGET — 기관명 doorway / 일반 Champion 충돌
  {
    id: "ps-doorway-cityhall",
    queryCluster: "institution-general",
    query: "부산시청 법무사",
    aliases: [
      "해운대구청 법무사",
      "부산교통공사 법무사",
      "부산도시공사 법무사",
    ],
    institutionType: "지자체",
    staffRole: "mixed",
    task: "특정 기관 지정 법무사처럼 보이는 랜딩",
    searchIntent: "기관명 exact match",
    currentUrl: PUBLIC_SECTOR_CHAMPION,
    coverage: "strong",
    businessFit: 5,
    legalScope: "OUT_OF_SCOPE",
    cannibalizationRisk: "HIGH",
    opportunityScore: 0,
    recommendedAction: "DO_NOT_TARGET",
    notes: "거래관계 없는 기관명 landing / 전담·지정 표현 금지. Hub 범주형만.",
  },
  {
    id: "ps-type-doorway",
    queryCluster: "institution-general",
    query: "공기업법무사",
    aliases: ["공단법무사", "재단법무사", "센터법무사", "공무원법무사"],
    institutionType: "mixed",
    staffRole: "mixed",
    task: "기관유형별 thin landing",
    searchIntent: "유형명 + 법무사",
    currentUrl: PUBLIC_SECTOR_CHAMPION,
    coverage: "strong",
    businessFit: 5,
    legalScope: "RELATED",
    cannibalizationRisk: "HIGH",
    opportunityScore: 0,
    recommendedAction: "DO_NOT_TARGET",
    notes: "내용이 같으면 Hub 하나. `/공기업등기` `/지방공기업등기` 기존 Spoke만 유지.",
  },
  {
    id: "ps-consumer-champion",
    queryCluster: "institution-general",
    query: "부산 법무사",
    aliases: ["부산 법무사 추천"],
    institutionType: "mixed",
    staffRole: "mixed",
    task: "일반 소비자 사무소 선택",
    searchIntent: "개인 의뢰인 사무소 탐색",
    currentUrl: BUSAN_GENERAL_CHAMPION,
    coverage: "strong",
    businessFit: 20,
    legalScope: "DIRECT",
    cannibalizationRisk: "HIGH",
    opportunityScore: 0,
    recommendedAction: "DO_NOT_TARGET",
    notes: "기관 Hub가 이 Query를 Primary로 가져가면 안 됨.",
  },
  {
    id: "ps-corporate-champion",
    queryCluster: "corporate-change",
    query: "부산 법인 법무사",
    aliases: ["부산 법인 법무사 추천", "부산 법인등기"],
    institutionType: "mixed",
    staffRole: "mixed",
    task: "일반 법인등기 절차",
    searchIntent: "회사 설립·변경 등기",
    currentUrl: CORPORATE_CHAMPION,
    coverage: "strong",
    businessFit: 20,
    legalScope: "DIRECT",
    cannibalizationRisk: "HIGH",
    opportunityScore: 0,
    recommendedAction: "DO_NOT_TARGET",
    notes: "기관 페이지는 기관 특수상황만. 일반 절차는 Corporate Champion.",
  },
];

export const PUBLIC_SECTOR_P1_CREATE_NEW: string[] = [];

export function getPublicSectorIntentsByCluster(
  cluster: PublicSectorQueryCluster,
): PublicSectorIntent[] {
  return PUBLIC_SECTOR_INTENTS.filter((i) => i.queryCluster === cluster);
}
