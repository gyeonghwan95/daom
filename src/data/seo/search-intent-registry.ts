/**
 * Search intent registry — one primary URL per intent.
 * Scores are internal decision aids (not Naver official SEO scores).
 * Trend: TREND_DATA_UNAVAILABLE → qualitative only (no fabricated volumes).
 */

export type SearchIntentFunnel =
  | "informational"
  | "comparison"
  | "transactional"
  | "provider-selection";

export type SearchIntentCoverage =
  | "strong"
  | "partial"
  | "weak"
  | "missing";

export type SearchIntentAction =
  | "KEEP"
  | "STRENGTHEN"
  | "ADD_SECTION"
  | "FAQ_ONLY"
  | "CREATE_NEW"
  | "DO_NOT_CREATE";

export type BusinessScope =
  | "DIRECT"
  | "RELATED"
  | "COLLABORATION"
  | "OUT_OF_SCOPE";

export type SearchIntent = {
  id: string;
  category: string;
  primaryIntent: string;
  primaryKeyword: string;
  aliases: string[];
  userProblem: string;
  funnel: SearchIntentFunnel;
  currentUrl?: string;
  existingCoverage: SearchIntentCoverage;
  businessScope: BusinessScope;
  trendScore?: number;
  commercialScore?: number;
  urgencyScore?: number;
  competitionScore?: number;
  contentGapScore?: number;
  cannibalizationRisk?: number;
  finalOpportunityScore?: number;
  recommendedAction: SearchIntentAction;
  notes?: string;
};

/** Internal scoring without fabricated monthly search volume. */
export const SEARCH_INTENT_REGISTRY: SearchIntent[] = [
  {
    id: "inh-hub",
    category: "inheritance",
    primaryIntent: "부산 상속 절차 선택(등기·포기·한정)",
    primaryKeyword: "부산 상속 법무사",
    aliases: ["부산상속법무사", "부산 상속전문 법무사"],
    userProblem: "사망 후 어떤 절차부터인지 모름",
    funnel: "provider-selection",
    currentUrl: "/부산상속법무사",
    existingCoverage: "strong",
    businessScope: "DIRECT",
    commercialScore: 20,
    urgencyScore: 12,
    contentGapScore: 2,
    cannibalizationRisk: 5,
    finalOpportunityScore: 45,
    recommendedAction: "KEEP",
    notes: "SEO_PROTECTED / known ranking candidate",
  },
  {
    id: "inh-reg",
    category: "inheritance",
    primaryIntent: "상속부동산 명의이전등기",
    primaryKeyword: "부산 상속등기",
    aliases: ["부산 상속등기 법무사", "상속등기 비용"],
    userProblem: "상속 부동산 명의를 바꿔야 함",
    funnel: "transactional",
    currentUrl: "/부산상속등기",
    existingCoverage: "strong",
    businessScope: "DIRECT",
    recommendedAction: "KEEP",
  },
  {
    id: "inh-renounce",
    category: "inheritance",
    primaryIntent: "상속포기 신청",
    primaryKeyword: "부산 상속포기",
    aliases: ["상속포기 비용", "상속포기 3개월"],
    userProblem: "빚이 많아 상속을 받지 않으려 함",
    funnel: "transactional",
    currentUrl: "/부산상속포기",
    existingCoverage: "strong",
    businessScope: "DIRECT",
    recommendedAction: "KEEP",
  },
  {
    id: "inh-qa",
    category: "inheritance",
    primaryIntent: "한정승인",
    primaryKeyword: "부산 한정승인",
    aliases: ["한정승인 비용", "한정승인 재산목록"],
    userProblem: "재산 한도에서만 빚을 갚고 싶음",
    funnel: "transactional",
    currentUrl: "/부산한정승인",
    existingCoverage: "strong",
    businessScope: "DIRECT",
    recommendedAction: "KEEP",
  },
  {
    id: "inh-3m",
    category: "inheritance",
    primaryIntent: "사망 인지 후 3개월 경과 상황",
    primaryKeyword: "사망 후 3개월 상속",
    aliases: ["상속포기 기한 지남"],
    userProblem: "기한이 지난 것 같아 막막함",
    funnel: "informational",
    currentUrl: "/사망후3개월지난상속",
    existingCoverage: "partial",
    businessScope: "DIRECT",
    commercialScore: 16,
    urgencyScore: 15,
    contentGapScore: 10,
    cannibalizationRisk: 12,
    finalOpportunityScore: 72,
    recommendedAction: "STRENGTHEN",
    notes: "특별한정승인 전용 페이지와 역할 분리",
  },
  {
    id: "inh-special-qa",
    category: "inheritance",
    primaryIntent: "특별한정승인(뒤늦은 채무 발견)",
    primaryKeyword: "특별한정승인",
    aliases: ["특별한정승인 신청", "3개월 후 한정승인"],
    userProblem: "기한 후 빚을 알게 됨",
    funnel: "transactional",
    existingCoverage: "weak",
    businessScope: "DIRECT",
    commercialScore: 18,
    urgencyScore: 15,
    contentGapScore: 18,
    cannibalizationRisk: 14,
    competitionScore: 8,
    finalOpportunityScore: 86,
    recommendedAction: "CREATE_NEW",
    currentUrl: "/특별한정승인",
    notes:
      "Published batch1. Glossary /glossary/special-qualified-acceptance remains definitional.",
  },
  {
    id: "inh-subrogation",
    category: "inheritance",
    primaryIntent: "대습상속 등기",
    primaryKeyword: "대습상속 등기",
    aliases: ["대습상속", "상속인 사망 대습"],
    userProblem: "중간 세대가 먼저 사망해 상속 관계가 복잡",
    funnel: "transactional",
    existingCoverage: "weak",
    businessScope: "DIRECT",
    commercialScore: 17,
    urgencyScore: 11,
    contentGapScore: 20,
    cannibalizationRisk: 8,
    competitionScore: 8,
    finalOpportunityScore: 88,
    recommendedAction: "CREATE_NEW",
    currentUrl: "/대습상속등기",
    notes: "Published batch1. Glossary remains at /glossary/subrogation-inheritance.",
  },
  {
    id: "inh-reserve",
    category: "inheritance",
    primaryIntent: "유류분과 상속등기 전 확인",
    primaryKeyword: "유류분 상속등기",
    aliases: ["유류분", "유류분반환"],
    userProblem: "유언·편중 상속으로 유류분 우려",
    funnel: "informational",
    existingCoverage: "weak",
    businessScope: "RELATED",
    commercialScore: 14,
    urgencyScore: 10,
    contentGapScore: 18,
    cannibalizationRisk: 10,
    competitionScore: 7,
    finalOpportunityScore: 81,
    recommendedAction: "CREATE_NEW",
    currentUrl: "/유류분과상속등기",
    notes: "Published batch1. 소송 대행 표방 금지.",
  },
  {
    id: "inh-acq-tax",
    category: "inheritance",
    primaryIntent: "상속 취득세와 등기 순서",
    primaryKeyword: "상속 취득세",
    aliases: ["상속세 신고 등기", "상속등기 세금"],
    userProblem: "세금과 등기 순서가 헷갈림",
    funnel: "informational",
    existingCoverage: "weak",
    businessScope: "COLLABORATION",
    commercialScore: 15,
    urgencyScore: 12,
    contentGapScore: 16,
    cannibalizationRisk: 9,
    competitionScore: 7,
    finalOpportunityScore: 80,
    recommendedAction: "CREATE_NEW",
    currentUrl: "/상속취득세와등기순서",
    notes: "Published batch1. 세무 확정 금지. /취득세와 역할 분리.",
  },
  {
    id: "compare-lawyer",
    category: "provider",
    primaryIntent: "법무사와 변호사의 업무 차이",
    primaryKeyword: "법무사 변호사 차이",
    aliases: ["법무사와 변호사", "등기는 법무사"],
    userProblem: "누구에게 맡겨야 할지 모름",
    funnel: "comparison",
    existingCoverage: "partial",
    businessScope: "RELATED",
    currentUrl: "/부산법무사",
    commercialScore: 16,
    urgencyScore: 6,
    contentGapScore: 10,
    cannibalizationRisk: 10,
    competitionScore: 8,
    finalOpportunityScore: 55,
    recommendedAction: "DO_NOT_CREATE",
    notes:
      "Page removed 2026-08-12. Absorb into /부산법무사 scope FAQ — no standalone URL.",
  },
  {
    id: "rehab-credit",
    category: "rehab",
    primaryIntent: "신용회복 vs 개인회생 vs 파산",
    primaryKeyword: "신용회복 개인회생 차이",
    aliases: ["워크아웃 개인회생", "신용회복위원회"],
    userProblem: "어느 채무조정 채널인지 모름",
    funnel: "comparison",
    existingCoverage: "missing",
    businessScope: "RELATED",
    commercialScore: 17,
    urgencyScore: 12,
    contentGapScore: 19,
    cannibalizationRisk: 8,
    competitionScore: 7,
    finalOpportunityScore: 84,
    recommendedAction: "CREATE_NEW",
    currentUrl: "/신용회복과개인회생차이",
    notes: "Published batch1.",
  },
  {
    id: "jeonse-fraud-victim",
    category: "real-estate",
    primaryIntent: "전세사기 피해 후 대응 순서",
    primaryKeyword: "전세사기 피해 대응",
    aliases: ["전세사기 임차권등기", "전세사기 보증금"],
    userProblem: "피해 후 무엇을 먼저 할지 모름",
    funnel: "transactional",
    existingCoverage: "weak",
    businessScope: "RELATED",
    commercialScore: 18,
    urgencyScore: 15,
    contentGapScore: 17,
    cannibalizationRisk: 11,
    competitionScore: 8,
    finalOpportunityScore: 85,
    recommendedAction: "CREATE_NEW",
    currentUrl: "/전세사기피해대응절차",
    notes: "Published batch1. 예방교육과 분리.",
  },
  {
    id: "presale-transfer",
    category: "real-estate",
    primaryIntent: "분양권·입주권 명의이전",
    primaryKeyword: "분양권 명의이전 등기",
    aliases: ["입주권 이전", "분양권 매매 등기"],
    userProblem: "분양권/입주권 명의를 넘겨야 함",
    funnel: "transactional",
    existingCoverage: "partial",
    businessScope: "DIRECT",
    commercialScore: 17,
    urgencyScore: 11,
    contentGapScore: 14,
    cannibalizationRisk: 16,
    competitionScore: 7,
    finalOpportunityScore: 78,
    recommendedAction: "CREATE_NEW",
    currentUrl: "/분양권명의이전등기",
    notes: "Published batch1. 입주등기와 역할 분리.",
  },
  {
    id: "corp-officer",
    category: "corporate",
    primaryIntent: "임원변경등기",
    primaryKeyword: "임원변경등기",
    aliases: ["이사 변경", "대표이사 변경", "임원 중임"],
    userProblem: "임원 구성이 바뀌어 등기해야 함",
    funnel: "transactional",
    currentUrl: "/부산법인등기",
    existingCoverage: "strong",
    businessScope: "DIRECT",
    cannibalizationRisk: 25,
    recommendedAction: "DO_NOT_CREATE",
    notes: "aliases — 별도 URL 금지",
  },
  {
    id: "rec-busan",
    category: "provider",
    primaryIntent: "부산 법무사 선택 기준",
    primaryKeyword: "부산 법무사 추천",
    aliases: ["부산 법무사"],
    userProblem: "사무소 선택 기준이 필요",
    funnel: "provider-selection",
    currentUrl: "/부산법무사",
    existingCoverage: "strong",
    businessScope: "DIRECT",
    recommendedAction: "KEEP",
    notes: "자기추천·1위 표방 금지",
  },
];

export function getCreateNewIntents() {
  return SEARCH_INTENT_REGISTRY.filter(
    (i) => i.recommendedAction === "CREATE_NEW",
  ).sort(
    (a, b) => (b.finalOpportunityScore || 0) - (a.finalOpportunityScore || 0),
  );
}

export function getStrengthenIntents() {
  return SEARCH_INTENT_REGISTRY.filter(
    (i) =>
      i.recommendedAction === "STRENGTHEN" ||
      i.recommendedAction === "ADD_SECTION" ||
      i.recommendedAction === "FAQ_ONLY",
  );
}
