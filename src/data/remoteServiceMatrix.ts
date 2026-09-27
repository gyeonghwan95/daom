/**
 * 타지역(부산 외) 의뢰 기준 업무별 원격 적합도·관할 source of truth.
 * 지역 페이지 문구는 이 표의 safeMarketingPhrase·jurisdiction을 넘어서 약속하지 않는다.
 * 기존 방문 전 적합도(A/B/C)는 src/lib/remote/remote-service-matrix.ts 의 matrixId 항목을 따른다.
 */

export type RemoteCompletion = "YES" | "CASE_DEPENDENT" | "NO";
export type VisitRisk = "LOW" | "MEDIUM" | "HIGH";

export type RegionalRemoteService = {
  id: string;
  label: string;
  matrixId?: string;
  /** 0–100, 내부 기준 */
  remoteFitScore: number;
  remoteStart: boolean;
  remoteCompletion: RemoteCompletion;
  jurisdiction: string;
  legalBasis: readonly string[];
  originalsRequired: readonly string[];
  visitMayBeRequired: readonly string[];
  visitRisk: VisitRisk;
  safeMarketingPhrase: string;
  /** 지역 페이지에서 쓰지 않는 표현 */
  forbiddenPhrases: readonly string[];
  verifiedAt: string;
};

const VERIFIED_AT = "2026-09-27";

const COMMON_FORBIDDEN = [
  "전국 어디든 100% 비대면",
  "무조건 방문 없이 완료",
  "[지역] 법무사 다옴",
  "[지역] 사무소",
] as const;

export const REGIONAL_REMOTE_SERVICES: readonly RegionalRemoteService[] = [
  {
    id: "inheritance-registration",
    label: "상속등기",
    matrixId: "inheritance-registration",
    remoteFitScore: 90,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction:
      "원칙은 부동산 소재지 관할 등기소. 2025.1.31.부터 상속·유증으로 인한 등기는 관할 등기소가 아닌 등기소도 담당할 수 있음(구체적 절차는 대법원규칙). 관할이 다른 여러 부동산을 같은 목적·원인으로 신청할 때는 그중 한 관할 등기소에 일괄 신청 가능.",
    legalBasis: ["부동산등기법 제7조의3", "부동산등기법 제7조의2"],
    originalsRequired: [
      "상속재산분할협의서 원본(상속인 전원 인감 날인)",
      "상속인 인감증명서(또는 본인서명사실확인서)",
      "위임장",
    ],
    visitMayBeRequired: [
      "해외 상속인의 서명·공증 방식 확인",
      "미성년 상속인 특별대리인 선임",
      "상속인 연락두절·협의 불성립",
    ],
    visitRisk: "LOW",
    safeMarketingPhrase:
      "상담과 서류 개요 확인은 방문 없이 시작할 수 있고, 원본은 우편 등으로 받습니다. 방문이 필요한 경우는 수임 전에 알려드립니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN, "어느 등기소에나 접수"],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "bequest-registration",
    label: "유증등기",
    remoteFitScore: 80,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction: "상속등기와 같은 관할 특례(유증 원인 포함). 유언 형식·유언집행자 유무에 따라 서류가 달라짐.",
    legalBasis: ["부동산등기법 제7조의3"],
    originalsRequired: ["유언서(공정증서·검인조서 등)", "유언집행자·수증자 인감증명서"],
    visitMayBeRequired: ["자필유언 검인 절차", "유언집행자 선임 필요"],
    visitRisk: "MEDIUM",
    safeMarketingPhrase: "유언 형식과 등기부를 먼저 보고 원격 진행 범위를 안내합니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "old-inheritance",
    label: "오래된 상속·재상속 등기",
    matrixId: "inheritance-registration",
    remoteFitScore: 70,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction: "상속등기와 같음. 여러 차례 상속이 겹치면 상속인 확정과 제적등본 확인이 먼저.",
    legalBasis: ["부동산등기법 제7조의3"],
    originalsRequired: ["제적등본 등 가족관계 서류", "상속인 전원 협의서·인감"],
    visitMayBeRequired: ["상속인 다수·일부 연락두절", "소송·공시송달 검토"],
    visitRisk: "MEDIUM",
    safeMarketingPhrase: "상속인 범위를 먼저 확정한 뒤 원격으로 가능한 단계를 나눠 안내합니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "overseas-heir",
    label: "해외 거주 상속인",
    matrixId: "overseas-heir",
    remoteFitScore: 60,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction: "등기 관할은 상속등기와 같음. 서명·인감 대체 서류는 거주국·국적에 따라 다름.",
    legalBasis: ["부동산등기법 제7조의3"],
    originalsRequired: ["재외공관 또는 현지 공증 서명인증서", "번역문"],
    visitMayBeRequired: ["재외공관 방문(상속인 본인)"],
    visitRisk: "MEDIUM",
    safeMarketingPhrase: "거주국과 국적을 먼저 확인해 필요한 공증·번역 서류를 안내합니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "inheritance-renunciation",
    label: "상속포기",
    matrixId: "inheritance-renunciation",
    remoteFitScore: 70,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction:
      "상속개시지(피상속인 마지막 주소지) 관할 가정법원(지원). 부동산 소재지나 상속인 거주지가 아님. 상속개시를 안 날부터 3개월.",
    legalBasis: ["가사소송법 제44조 제1항 제6호", "민법 제1019조 제1항"],
    originalsRequired: ["신고인 인감증명서", "신고서(인감 날인)"],
    visitMayBeRequired: ["법원의 보정·출석 요청"],
    visitRisk: "MEDIUM",
    safeMarketingPhrase: "관할 가정법원과 기한을 먼저 확인하고, 서류 준비는 원격으로 도와드립니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN, "부산가정법원에 일괄 신고"],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "qualified-acceptance",
    label: "한정승인",
    matrixId: "qualified-acceptance",
    remoteFitScore: 55,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction: "상속포기와 같은 상속개시지 관할 가정법원. 수리 후 청산 절차가 이어짐.",
    legalBasis: ["가사소송법 제44조 제1항 제6호", "민법 제1019조 제1항"],
    originalsRequired: ["재산목록", "신고인 인감증명서"],
    visitMayBeRequired: ["청산 절차의 공고·배당 과정", "법원 보정"],
    visitRisk: "MEDIUM",
    safeMarketingPhrase: "재산목록 정리와 신고서 준비는 원격으로 시작하고, 청산 단계는 따로 안내합니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "special-qualified-acceptance",
    label: "특별한정승인",
    remoteFitScore: 50,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction: "상속개시지 관할 가정법원. 채무 초과 사실을 안 날부터 3개월, 중대한 과실 없이 몰랐다는 사정이 쟁점.",
    legalBasis: ["민법 제1019조 제3항", "가사소송법 제44조 제1항 제6호"],
    originalsRequired: ["채무 인지 시점 소명자료", "재산목록"],
    visitMayBeRequired: ["법원 심문·보정"],
    visitRisk: "HIGH",
    safeMarketingPhrase: "채무를 안 시점과 자료를 먼저 확인한 뒤 신청 가능성을 설명합니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "corporate-registration",
    label: "법인설립·변경등기",
    matrixId: "corporate-establishment",
    remoteFitScore: 75,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction: "본점 소재지 관할 등기소. 상속등기 관할 특례와 무관.",
    legalBasis: ["상업등기법 제4조"],
    originalsRequired: ["의사록·정관 등 날인 원본", "임원 인감증명서"],
    visitMayBeRequired: ["외국인 임원 서명인증", "잔고증명 은행 절차"],
    visitRisk: "LOW",
    safeMarketingPhrase: "본점 관할을 확인하고 서류 초안부터 원격으로 준비합니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "hq-relocation",
    label: "본점이전등기",
    matrixId: "hq-relocation",
    remoteFitScore: 75,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction: "2025.1.31.부터 관할 외 본점이전은 구 본점 또는 신 본점 관할 등기소 중 한 곳에 신청 가능.",
    legalBasis: ["상업등기법 제31조"],
    originalsRequired: ["이사회·주주총회 의사록", "대표이사 인감"],
    visitMayBeRequired: ["인감 신고 방식 확인"],
    visitRisk: "LOW",
    safeMarketingPhrase: "구·신 본점 관할을 확인하고 신청 등기소를 정해 안내합니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: "mortgage",
    label: "근저당 설정·말소",
    matrixId: "mortgage-cancel",
    remoteFitScore: 65,
    remoteStart: true,
    remoteCompletion: "CASE_DEPENDENT",
    jurisdiction: "부동산 소재지 관할 등기소. 여러 부동산 공동담보는 제7조의2 일괄 신청 검토.",
    legalBasis: ["부동산등기법 제7조의2"],
    originalsRequired: ["해지증서·등기필정보", "금융기관 서류"],
    visitMayBeRequired: ["등기필정보 분실 시 확인서면"],
    visitRisk: "MEDIUM",
    safeMarketingPhrase: "등기부와 금융기관 서류를 먼저 확인해 필요한 원본만 안내합니다.",
    forbiddenPhrases: [...COMMON_FORBIDDEN],
    verifiedAt: VERIFIED_AT,
  },
];

/** 취득세는 등기와 별도 기한 — 지역 페이지 공통 확인용 */
export const INHERITANCE_ACQUISITION_TAX_NOTE =
  "상속 취득세 신고·납부는 상속개시일이 속한 달의 말일부터 6개월(상속인 중 외국 거주자가 있으면 9개월) 안에 해야 하며, 등기 신청과는 별도 기한입니다(지방세법 제20조 제1항).";

export function getRegionalRemoteService(id: string): RegionalRemoteService | undefined {
  return REGIONAL_REMOTE_SERVICES.find((s) => s.id === id);
}
