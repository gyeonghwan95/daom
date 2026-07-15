/**
 * SEO 검색의도 레지스트리 (Priority 1 중심)
 * action: strengthen-existing | create-new | merge-into-existing | faq-only | section-only | do-not-target
 */
export type SearchIntentAction =
  | "strengthen-existing"
  | "create-new"
  | "merge-into-existing"
  | "faq-only"
  | "section-only"
  | "do-not-target";

export type SearchIntentType =
  | "local"
  | "transactional"
  | "informational"
  | "comparison"
  | "cost"
  | "deadline"
  | "document"
  | "problem"
  | "b2b"
  | "court"
  | "urgent";

export type SearchIntentRecord = {
  id: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intentType: SearchIntentType;
  audience: string;
  funnelStage: "awareness" | "consideration" | "decision" | "b2b";
  targetUrl: string;
  existingUrl?: string;
  action: SearchIntentAction;
  priority: 1 | 2 | 3;
  parentHub?: string;
  relatedServices: string[];
  relatedSituations?: string[];
  relatedFaqs?: string[];
  relatedCases?: string[];
  relatedTools?: string[];
  region: string;
  legalRisk: "low" | "medium" | "high";
  notes: string;
};

export const searchIntentRegistry: SearchIntentRecord[] = [
  // ——— Priority 1 ———
  {
    id: "busan-rehab",
    primaryKeyword: "부산 개인회생",
    secondaryKeywords: ["부산 회생신청", "부산 개인회생 상담"],
    intentType: "local",
    audience: "개인 채무자",
    funnelStage: "consideration",
    targetUrl: "/부산개인회생",
    existingUrl: "/부산개인회생",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/개인회생파산",
    relatedServices: ["personal-rehabilitation"],
    relatedTools: ["/tools"],
    region: "부산",
    legalRisk: "high",
    notes: "인가·면책 보장 금지. 기존 URL 강화.",
  },
  {
    id: "busan-rehab-lawyer",
    primaryKeyword: "부산 개인회생 법무사",
    secondaryKeywords: ["부산 회생 법무사"],
    intentType: "local",
    audience: "개인 채무자",
    funnelStage: "decision",
    targetUrl: "/부산개인회생법무사",
    existingUrl: "/부산개인회생법무사",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/개인회생파산",
    relatedServices: ["personal-rehabilitation"],
    region: "부산",
    legalRisk: "medium",
    notes: "대표는 /부산개인회생과 내부링크. 전문 법무사 표현 금지.",
  },
  {
    id: "busan-bankruptcy",
    primaryKeyword: "부산 개인파산",
    secondaryKeywords: ["부산 파산신청", "부산 파산"],
    intentType: "local",
    audience: "개인 채무자",
    funnelStage: "consideration",
    targetUrl: "/부산개인파산",
    existingUrl: "/부산개인파산",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/개인회생파산",
    relatedServices: ["bankruptcy"],
    region: "부산",
    legalRisk: "high",
    notes: "면책 보장 금지.",
  },
  {
    id: "busan-bankruptcy-lawyer",
    primaryKeyword: "부산 파산신청 법무사",
    secondaryKeywords: ["부산 개인파산 법무사", "부산 파산 법무사"],
    intentType: "local",
    audience: "개인 채무자",
    funnelStage: "decision",
    targetUrl: "/부산개인파산법무사",
    existingUrl: "/부산개인파산법무사",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/개인회생파산",
    relatedServices: ["bankruptcy"],
    region: "부산",
    legalRisk: "medium",
    notes: "/부산파산법무사와 의도 유사 → 내부링크로 서로 보강.",
  },
  {
    id: "busan-fee",
    primaryKeyword: "부산 법무사 수임료",
    secondaryKeywords: [
      "부산 법무사 비용",
      "부산 법무사 보수",
      "법무사 상담료",
      "법무사 착수금",
    ],
    intentType: "cost",
    audience: "일반 의뢰인",
    funnelStage: "consideration",
    targetUrl: "/부산법무사비용",
    existingUrl: "/부산법무사비용",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/부산법무사비용",
    relatedServices: ["inheritance-registration"],
    region: "부산",
    legalRisk: "low",
    notes: "/부산법무사수임료·/법무사수임료는 merge-into-existing. 고정 가격 금지.",
  },
  {
    id: "busan-fee-duplicate-slug",
    primaryKeyword: "부산 법무사 수임료(중복 슬러그)",
    secondaryKeywords: ["법무사 수임료"],
    intentType: "cost",
    audience: "일반 의뢰인",
    funnelStage: "awareness",
    targetUrl: "/부산법무사비용",
    existingUrl: "/부산법무사수임료",
    action: "merge-into-existing",
    priority: 1,
    parentHub: "/부산법무사비용",
    relatedServices: ["inheritance-registration"],
    region: "부산",
    legalRisk: "low",
    notes: "신규 독립 페이지로 키우지 않음. 대표 URL로 유도.",
  },
  {
    id: "busan-subproxy",
    primaryKeyword: "부산 등기 복대리",
    secondaryKeywords: [
      "부산 복대리 법무사",
      "등기 복대리",
      "부산 등기 접수 대행",
      "타지역 법무사 부산 등기",
    ],
    intentType: "b2b",
    audience: "타지역 법무사·법률사무소·기업 담당자",
    funnelStage: "b2b",
    targetUrl: "/부산등기복대리",
    existingUrl: "/부산등기복대리",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/특수등기의뢰",
    relatedServices: ["real-estate-registration", "corporate-registration"],
    region: "부산",
    legalRisk: "medium",
    notes: "가능 범위를 과장하지 않음. 관할 데이터는 관리 필드로.",
  },
  {
    id: "busan-mass-reg",
    primaryKeyword: "부산 집단등기",
    secondaryKeywords: [
      "부산 아파트 집단등기",
      "신축아파트 입주등기",
      "오피스텔 집단등기",
      "집단등기 비용",
    ],
    intentType: "b2b",
    audience: "입주예정자·시행사·금융기관",
    funnelStage: "consideration",
    targetUrl: "/부산집단등기",
    existingUrl: "/부산집단등기",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/특수등기의뢰",
    relatedServices: ["ownership-transfer", "real-estate-registration"],
    region: "부산",
    legalRisk: "medium",
    notes: "세금·감면 최종 확정 금지. /아파트집단등기 등은 대표로 병합 유도.",
  },
  {
    id: "apt-mass-merge",
    primaryKeyword: "아파트 집단등기",
    secondaryKeywords: ["신축 집단등기", "오피스텔 집단등기"],
    intentType: "informational",
    audience: "입주예정자",
    funnelStage: "awareness",
    targetUrl: "/부산집단등기",
    existingUrl: "/아파트집단등기",
    action: "merge-into-existing",
    priority: 1,
    parentHub: "/특수등기의뢰",
    relatedServices: ["ownership-transfer"],
    region: "부산",
    legalRisk: "low",
    notes: "얇은 파생 페이지는 대표 /부산집단등기로 유도.",
  },
  {
    id: "busan-inheritance-lawyer",
    primaryKeyword: "부산 상속등기 법무사",
    secondaryKeywords: ["부산 상속 법무사"],
    intentType: "local",
    audience: "상속인",
    funnelStage: "decision",
    targetUrl: "/부산상속법무사",
    existingUrl: "/부산상속법무사",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/등기실무",
    relatedServices: ["inheritance-registration"],
    region: "부산",
    legalRisk: "medium",
    notes: "/부산상속등기전문 URL 유지, 화면 카피는 실무 안내.",
  },
  {
    id: "busan-registry-lawyer",
    primaryKeyword: "부산 등기 법무사",
    secondaryKeywords: ["부산 부동산등기 법무사"],
    intentType: "local",
    audience: "매수·매도인",
    funnelStage: "decision",
    targetUrl: "/부산등기법무사",
    existingUrl: "/부산등기법무사",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/등기실무",
    relatedServices: ["real-estate-registration"],
    region: "부산",
    legalRisk: "low",
    notes: "기존 keyword-hub 강화.",
  },
  {
    id: "busan-corp-lawyer",
    primaryKeyword: "부산 법인등기 법무사",
    secondaryKeywords: ["부산 법인설립 법무사"],
    intentType: "local",
    audience: "대표·실무자",
    funnelStage: "decision",
    targetUrl: "/부산법인법무사",
    existingUrl: "/부산법인법무사",
    action: "strengthen-existing",
    priority: 1,
    parentHub: "/등기실무",
    relatedServices: ["corporate-registration"],
    region: "부산",
    legalRisk: "low",
    notes: "/부산법인등기전문 URL·카피 정비.",
  },
  {
    id: "busan-balance-day",
    primaryKeyword: "부산 잔금일 법무사",
    secondaryKeywords: ["잔금일 등기", "매수인 법무사", "매도인 법무사"],
    intentType: "urgent",
    audience: "매매 당사자·중개사",
    funnelStage: "decision",
    targetUrl: "/부산잔금일법무사",
    action: "create-new",
    priority: 1,
    parentHub: "/등기실무",
    relatedServices: ["ownership-transfer", "real-estate-registration"],
    relatedCases: ["/services/cases/centum-ownership-transfer-case"],
    region: "부산",
    legalRisk: "medium",
    notes: "기존에 독립 URL 없음 → 신규 대표 페이지.",
  },
  {
    id: "hub-registry-practice",
    primaryKeyword: "등기 실무 허브",
    secondaryKeywords: ["등기 접수", "등기 보정", "전자등기"],
    intentType: "informational",
    audience: "일반·B2B",
    funnelStage: "awareness",
    targetUrl: "/등기실무",
    action: "create-new",
    priority: 1,
    relatedServices: ["real-estate-registration", "corporate-registration"],
    region: "부산",
    legalRisk: "low",
    notes: "신규 상위 허브.",
  },
  {
    id: "hub-rehab",
    primaryKeyword: "부산 회생파산 허브",
    secondaryKeywords: ["개인회생과 개인파산 비교"],
    intentType: "comparison",
    audience: "개인 채무자",
    funnelStage: "awareness",
    targetUrl: "/개인회생파산",
    existingUrl: "/개인회생파산",
    action: "strengthen-existing",
    priority: 1,
    relatedServices: ["personal-rehabilitation", "bankruptcy"],
    region: "부산",
    legalRisk: "medium",
    notes: "/부산회생파산 신규 생성 금지. 기존 /개인회생파산 강화.",
  },
  {
    id: "hub-cost",
    primaryKeyword: "법무사 비용·기간·서류 허브",
    secondaryKeywords: ["업무별 처리기간", "상담 전 준비서류"],
    intentType: "cost",
    audience: "일반 의뢰인",
    funnelStage: "consideration",
    targetUrl: "/부산법무사비용",
    existingUrl: "/부산법무사비용",
    action: "strengthen-existing",
    priority: 1,
    relatedServices: ["inheritance-registration"],
    region: "부산",
    legalRisk: "low",
    notes: "/법무사비용기간서류 신규 생성 금지.",
  },
  {
    id: "hub-special-request",
    primaryKeyword: "특수 등기 의뢰",
    secondaryKeywords: ["복대리", "집단등기", "협업 의뢰"],
    intentType: "b2b",
    audience: "협력 사무소·시행사",
    funnelStage: "b2b",
    targetUrl: "/특수등기의뢰",
    action: "create-new",
    priority: 1,
    parentHub: "/특수등기",
    relatedServices: ["real-estate-registration"],
    region: "부산",
    legalRisk: "low",
    notes: "/특수등기(선박 등)와 의도 분리. B2B·특수의뢰 허브.",
  },
  {
    id: "hub-collab",
    primaryKeyword: "법무사 협업",
    secondaryKeywords: ["등기 업무제휴", "세무사 법무사 협업"],
    intentType: "b2b",
    audience: "세무사·중개사·건축사·금융기관",
    funnelStage: "b2b",
    targetUrl: "/법무사협업",
    action: "create-new",
    priority: 1,
    relatedServices: ["real-estate-registration", "corporate-registration"],
    region: "부산",
    legalRisk: "low",
    notes: "B2B 문의 폼 포함.",
  },
  // ——— do-not-target ———
  {
    id: "ban-lawyer-claim",
    primaryKeyword: "전문 법무사",
    secondaryKeywords: ["인증된 전문", "부산 최고의 법무사"],
    intentType: "informational",
    audience: "전체",
    funnelStage: "awareness",
    targetUrl: "/",
    action: "do-not-target",
    priority: 1,
    relatedServices: [],
    region: "부산",
    legalRisk: "high",
    notes: "SEO 타겟·H1·badge 금지. URL의 ‘전문’만 예외 유지.",
  },
  {
    id: "ban-byeonho",
    primaryKeyword: "변호",
    secondaryKeywords: ["부산 변호", "변호 비용", "변호 추천"],
    intentType: "informational",
    audience: "전체",
    funnelStage: "awareness",
    targetUrl: "/",
    action: "do-not-target",
    priority: 1,
    relatedServices: [],
    region: "부산",
    legalRisk: "high",
    notes: "키워드 페이지 금지. FAQ 업무범위 설명만 3회 이내.",
  },
];

export function getSearchIntentsByAction(action: SearchIntentAction) {
  return searchIntentRegistry.filter((item) => item.action === action);
}

export function getPriority1SearchIntents() {
  return searchIntentRegistry.filter((item) => item.priority === 1);
}

export function summarizeSearchIntentCoverage() {
  const byAction = (action: SearchIntentAction) =>
    getSearchIntentsByAction(action).map((i) => i.primaryKeyword);

  return {
    alreadyCovered: byAction("strengthen-existing"),
    createNew: byAction("create-new"),
    mergeIntoExisting: byAction("merge-into-existing"),
    faqOrSectionOnly: [
      ...byAction("faq-only"),
      ...byAction("section-only"),
    ],
    doNotTarget: byAction("do-not-target"),
  };
}
