/**
 * 기업·법인 법무 인접 검색의도 레지스트리.
 * aliases는 내부 매핑 전용 — 공개 페이지에 나열하지 않음.
 * CORPORATE_LEGAL_OPERATIONS_CHAMPION = /부산법인법무사 (기존 Corporate Champion과 동일 URL)
 */
export const CORPORATE_LEGAL_OPERATIONS_CHAMPION = "/부산법인법무사";

export type CorporateLegalCoverage =
  | "strong"
  | "partial"
  | "gap"
  | "out_of_scope";

export type CorporateLegalAction =
  | "KEEP"
  | "ADD_SECTION"
  | "ADD_H2"
  | "ADD_FAQ"
  | "ADD_MODULE"
  | "STRENGTHEN"
  | "CREATE_NEW"
  | "DO_NOT_TARGET";

export type CorporateLegalIntent = {
  id: string;
  queryCluster: string;
  aliases: string[];
  searchIntent: string;
  businessStage:
    | "discovery"
    | "startup"
    | "operation"
    | "change"
    | "governance"
    | "financing"
    | "real-estate"
    | "closing"
    | "court-docs"
    | "dispute";
  legalTask: string;
  existingUrl: string;
  coverage: CorporateLegalCoverage;
  champion: string;
  businessValue: 1 | 2 | 3 | 4 | 5;
  cannibalizationRisk: "low" | "medium" | "high";
  scopeRisk: "low" | "medium" | "high";
  recommendedAction: CorporateLegalAction;
  notes?: string;
};

export const corporateLegalIntents: CorporateLegalIntent[] = [
  {
    id: "broad-corporate-legal-ops",
    queryCluster: "부산 법인법무",
    aliases: [
      "부산 법인 법무",
      "부산 기업법무",
      "부산 기업 법무",
      "부산 회사법무",
      "부산 회사 법무",
      "부산 법인 법률업무",
      "부산 기업 법률업무",
      "부산 회사 법률업무",
      "부산 기업 법무업무",
      "부산 법인 법무업무",
      "부산 회사 법무업무",
      "부산 법인 법률",
      "부산 기업 법률",
      "부산 회사 법률",
      "부산 기업 법률실무",
      "부산 회사 법률실무",
      "부산 법인 운영 법률",
      "부산 회사 운영 법률",
      "부산 기업 운영 법률",
    ],
    searchIntent: "기업·법인 운영에 필요한 법무 실무를 찾고, 직역명을 모를 수 있음",
    businessStage: "discovery",
    legalTask: "등기·법원서류 범위의 법무사 업무 허브",
    existingUrl: CORPORATE_LEGAL_OPERATIONS_CHAMPION,
    coverage: "strong",
    champion: CORPORATE_LEGAL_OPERATIONS_CHAMPION,
    businessValue: 5,
    cannibalizationRisk: "medium",
    scopeRisk: "medium",
    recommendedAction: "ADD_MODULE",
    notes:
      "Provider query「부산 법인 법무사」와 동일 URL. title/H1 불변. 신규 /부산법인법무 금지.",
  },
  {
    id: "provider-corporate-scrivener",
    queryCluster: "부산 법인 법무사",
    aliases: ["부산 법인 법무사 추천"],
    searchIntent: "법인 업무를 맡길 법무사 사무소 선택",
    businessStage: "discovery",
    legalTask: "제공자 선택",
    existingUrl: CORPORATE_LEGAL_OPERATIONS_CHAMPION,
    coverage: "strong",
    champion: CORPORATE_LEGAL_OPERATIONS_CHAMPION,
    businessValue: 5,
    cannibalizationRisk: "high",
    scopeRisk: "low",
    recommendedAction: "KEEP",
    notes: "Protected Champion. title/H1/canonical 변경 금지.",
  },
  {
    id: "provider-business-scrivener",
    queryCluster: "부산 기업 법무사",
    aliases: ["부산 회사 법무사"],
    searchIntent: "기업 법무사 사무소 선택",
    businessStage: "discovery",
    legalTask: "제공자 선택(spoke)",
    existingUrl: "/부산기업법무사",
    coverage: "strong",
    champion: "/부산기업법무사",
    businessValue: 3,
    cannibalizationRisk: "high",
    scopeRisk: "medium",
    recommendedAction: "ADD_FAQ",
    notes: "실무 broad(기업법무)는 Champion. 이 URL은 선택 의도만.",
  },
  {
    id: "outsourcing-no-legal-team",
    queryCluster: "부산 기업 법무 외주",
    aliases: [
      "부산 회사 법무 외주",
      "부산 법인 법무 외주",
      "부산 기업 법무 지원",
      "부산 법인 법무 지원",
      "회사 법무 업무",
      "기업 법무 업무",
    ],
    searchIntent: "내부 담당자 없이 등기·법원서류 실무를 사건별로 맡기고 싶음",
    businessStage: "operation",
    legalTask: "사건별 등기·서류 지원(상시 고문 아님)",
    existingUrl: CORPORATE_LEGAL_OPERATIONS_CHAMPION,
    coverage: "partial",
    champion: CORPORATE_LEGAL_OPERATIONS_CHAMPION,
    businessValue: 4,
    cannibalizationRisk: "medium",
    scopeRisk: "high",
    recommendedAction: "ADD_FAQ",
    notes: "모든 회사 법무 대행처럼 쓰지 않음. 실무 허브 /부산기업법률자문 보조.",
  },
  {
    id: "establishment",
    queryCluster: "부산 법인 설립",
    aliases: [
      "부산 회사 설립",
      "부산 회사 만들기",
      "부산 법인 만들기",
      "주식회사 만들기",
      "회사 설립 서류",
      "법인 설립 서류",
    ],
    searchIntent: "회사 설립 절차·서류",
    businessStage: "startup",
    legalTask: "설립등기",
    existingUrl: "/부산법인설립등기",
    coverage: "strong",
    champion: "/부산법인설립등기",
    businessValue: 5,
    cannibalizationRisk: "low",
    scopeRisk: "low",
    recommendedAction: "KEEP",
  },
  {
    id: "officer-change",
    queryCluster: "회사 대표 변경",
    aliases: [
      "대표이사 변경",
      "회사 이사 변경",
      "이사 사임",
      "이사 취임",
      "임원 중임",
      "임원 임기만료",
      "퇴사한 이사가 등기부에 남아있음",
    ],
    searchIntent: "대표·임원 변경등기",
    businessStage: "change",
    legalTask: "임원변경등기",
    existingUrl: "/부산임원변경등기",
    coverage: "strong",
    champion: "/부산임원변경등기",
    businessValue: 5,
    cannibalizationRisk: "low",
    scopeRisk: "low",
    recommendedAction: "KEEP",
  },
  {
    id: "head-office",
    queryCluster: "회사 주소 변경",
    aliases: ["법인 주소 변경", "회사 이전", "법인 이전", "회사 주소 옮겼는데 등기 안함"],
    searchIntent: "본점이전등기",
    businessStage: "change",
    legalTask: "본점이전등기",
    existingUrl: "/부산본점이전등기",
    coverage: "strong",
    champion: "/부산본점이전등기",
    businessValue: 5,
    cannibalizationRisk: "low",
    scopeRisk: "low",
    recommendedAction: "KEEP",
  },
  {
    id: "purpose-trade-name",
    queryCluster: "회사 사업목적 추가",
    aliases: ["법인 사업목적 변경", "회사 이름 변경", "법인 상호 변경"],
    searchIntent: "목적·상호 변경등기",
    businessStage: "change",
    legalTask: "목적변경등기",
    existingUrl: "/부산사업목적변경등기",
    coverage: "strong",
    champion: "/부산사업목적변경등기",
    businessValue: 4,
    cannibalizationRisk: "low",
    scopeRisk: "low",
    recommendedAction: "KEEP",
  },
  {
    id: "charter-minutes",
    queryCluster: "회사 정관 변경",
    aliases: [
      "부산 법인 정관",
      "정관 변경 방법",
      "주주총회 의사록",
      "이사회 의사록",
      "정관 공증 필요",
      "의사록 공증 필요",
    ],
    searchIntent: "정관·결의 서류와 등기 연결, 공증 여부 확인",
    businessStage: "governance",
    legalTask: "정관 변경·공증 준비(공증 수행 아님)",
    existingUrl: "/법인정관업무",
    coverage: "strong",
    champion: "/법인정관업무",
    businessValue: 4,
    cannibalizationRisk: "low",
    scopeRisk: "high",
    recommendedAction: "KEEP",
    notes: "공증인 업무를 자사 서비스처럼 표현하지 않음.",
  },
  {
    id: "capital",
    queryCluster: "회사 자본금 증자",
    aliases: ["법인 자본금 늘리기", "유상증자", "신주발행", "투자받고 증자", "감자"],
    searchIntent: "증자·감자 등기",
    businessStage: "financing",
    legalTask: "유상증자등기",
    existingUrl: "/부산유상증자등기",
    coverage: "strong",
    champion: "/부산유상증자등기",
    businessValue: 4,
    cannibalizationRisk: "low",
    scopeRisk: "medium",
    recommendedAction: "KEEP",
    notes: "투자계약·주식 분쟁 법률 전반은 Target하지 않음.",
  },
  {
    id: "corporate-real-estate",
    queryCluster: "법인 명의 부동산",
    aliases: [
      "법인 부동산 매수",
      "법인 아파트 매수",
      "회사 명의 부동산",
      "법인 소유권이전",
      "법인 근저당 설정",
    ],
    searchIntent: "법인 명의 부동산등기",
    businessStage: "real-estate",
    legalTask: "소유권이전·근저당",
    existingUrl: "/부산부동산등기",
    coverage: "strong",
    champion: "/부산부동산등기",
    businessValue: 5,
    cannibalizationRisk: "low",
    scopeRisk: "low",
    recommendedAction: "ADD_MODULE",
    notes: "Champion에서 링크로만. 부동산 절차 복제 금지.",
  },
  {
    id: "closing",
    queryCluster: "회사 폐업",
    aliases: [
      "법인 폐업",
      "법인 없애기",
      "회사 정리",
      "법인 해산",
      "법인 청산",
      "폐업신고만 하고 법인 남아있음",
    ],
    searchIntent: "폐업 vs 해산·청산 구분",
    businessStage: "closing",
    legalTask: "해산·청산등기",
    existingUrl: "/부산법인해산청산등기",
    coverage: "strong",
    champion: "/부산법인해산청산등기",
    businessValue: 5,
    cannibalizationRisk: "low",
    scopeRisk: "low",
    recommendedAction: "KEEP",
  },
  {
    id: "court-docs",
    queryCluster: "회사 미수금 지급명령",
    aliases: [
      "기업 미수금",
      "거래대금 못받음",
      "기업 지급명령",
      "법인 지급명령",
      "법원 제출서류",
      "공탁",
    ],
    searchIntent: "채권 관련 법원 신청서류",
    businessStage: "court-docs",
    legalTask: "지급명령·공탁 신청서류",
    existingUrl: "/부산기업채권관리",
    coverage: "strong",
    champion: "/부산기업채권관리",
    businessValue: 4,
    cannibalizationRisk: "low",
    scopeRisk: "medium",
    recommendedAction: "KEEP",
    notes: "회수 대행·소송대리 아님.",
  },
  {
    id: "out-of-scope-dispute",
    queryCluster: "주주분쟁",
    aliases: ["경영권분쟁", "계약분쟁", "손해배상", "소송 대리"],
    searchIntent: "분쟁 전반·대리",
    businessStage: "dispute",
    legalTask: "OUT_OF_SCOPE",
    existingUrl: CORPORATE_LEGAL_OPERATIONS_CHAMPION,
    coverage: "out_of_scope",
    champion: CORPORATE_LEGAL_OPERATIONS_CHAMPION,
    businessValue: 1,
    cannibalizationRisk: "low",
    scopeRisk: "high",
    recommendedAction: "DO_NOT_TARGET",
  },
];

export const corporateLegalCreateNewCandidates: never[] = [];
