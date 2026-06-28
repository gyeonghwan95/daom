import type { Diagnosis } from "../diagnosis";
import {
  DIAGNOSIS_CTA_TEXT,
  DIAGNOSIS_CTA_TITLE,
  DIAGNOSIS_SEO_KEYWORDS,
} from "../diagnosis-constants";
import {
  createStandardOutcomes,
  seoIntroParagraphs,
  standardFaqs,
  standardRelatedLinks,
} from "../diagnosis-helpers";

export const personalRehabilitationDiagnosis: Diagnosis = {
  id: "personal-rehabilitation",
  slug: "개인회생자가진단",
  title: "부산 개인회생 자가진단",
  metaTitle: "부산 개인회생 자가진단 | 해운대·센텀 법무사",
  metaDescription:
    "개인회생 자가진단. 총 채무, 월 소득, 재산, 급여 압류, 카드 연체, 최근 대출, 부양가족을 확인합니다.",
  h1: "부산 개인회생 자가진단 — 절차·필요서류·기한 확인",
  serviceName: "개인회생",
  serviceSlug: "personal-rehabilitation",
  primaryKeywords: ["개인회생", ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    "개인회생",
    "채무 조정이 필요하지만 파산보다 회생을 원할 때 신청 요건·변제계획 방향을 미리 점검할 수 있습니다.",
  ),
  targetUsers: [
    "다중 채무·카드론 부담자",
    "급여소득자 채무 조정 희망",
    "압류·추심 진행 중인 분",
  ],
  questions: [
    {
      id: "rehab-debt",
      question: "총 채무액(대략, 원)",
      description: "원 단위 숫자로 입력해 주세요.",
      type: "number",
      weight: 2,
      required: true,
    },
    {
      id: "rehab-income",
      question: "월 평균 소득(원)",
      type: "number",
      weight: 2,
      required: true,
    },
    {
      id: "rehab-assets",
      question: "부동산·차량 등 재산이 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "있습니다", value: "yes", score: 12 },
        { label: "없거나 거의 없음", value: "no", score: 5 },
        { label: "배우자 명의 포함", value: "spouse", score: 14 },
      ],
    },
    {
      id: "rehab-seizure",
      question: "급여 압류·통장 압류가 진행 중인가요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "예", value: "yes", score: 24, tags: ["urgent", "seizure"] },
        { label: "아니요", value: "no", score: 4 },
        { label: "통지만 받음", value: "notice", score: 16, tags: ["seizure"] },
      ],
    },
    {
      id: "rehab-card",
      question: "카드값·대출 연체가 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "3개월 이상 연체", value: "long", score: 18, tags: ["debt"] },
        { label: "단기 연체", value: "short", score: 10, tags: ["debt"] },
        { label: "없음", value: "no", score: 4 },
      ],
    },
    {
      id: "rehab-recent-loan",
      question: "최근 1년 내 대출·카드론을 받으셨나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "예", value: "yes", score: 12 },
        { label: "아니요", value: "no", score: 4 },
      ],
    },
    {
      id: "rehab-dependents",
      question: "부양가족 수(본인 제외)",
      type: "number",
      weight: 1.5,
      required: true,
    },
  ],
  outcomes: createStandardOutcomes("개인회생", "/services/personal-rehabilitation", [
    "채무·재산 목록",
    "소득 증빙",
    "가족관계증명서",
  ]),
  requiredDocuments: [
    "채무·재산 목록",
    "소득·급여 증빙",
    "가족관계·주민등록",
    "금융거래 내역",
  ],
  processSteps: [
    "요건·채권자 확인",
    "신청서·변제계획안 작성",
    "법원 접수",
    "개시·인가 후 변제",
  ],
  costFactors: ["채권자 수", "재산 복잡도", "보정 횟수"],
  deadlineWarnings: [
    "추심·압류 중이면 신속 검토",
    "허위 기재 시 불이익",
    "변제계획 불이행 시 폐지",
  ],
  caseExample: {
    title: "부산 개인회생 상담 예시",
    body: "급여소득자 채무 조정 희망 의뢰인께 회생 가능성과 변제계획 방향을 설명하고 서류 목록을 드렸습니다.",
  },
  faqs: standardFaqs("개인회생"),
  relatedLinks: standardRelatedLinks("개인회생", [
    { href: "/개인파산자가진단", label: "개인파산 자가진단" },
    { href: "/개인회생파산", label: "회생·파산 허브" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};

export const personalBankruptcyDiagnosis: Diagnosis = {
  id: "personal-bankruptcy",
  slug: "개인파산자가진단",
  title: "부산 개인파산 자가진단",
  metaTitle: "부산 개인파산 자가진단 | 해운대·센텀 법무사",
  metaDescription:
    "개인파산 자가진단. 소득·재산·채무 원인·면책 불허가 사유·나이·건강·근로 가능성을 확인합니다.",
  h1: "부산 개인파산 자가진단 — 절차·필요서류 확인",
  serviceName: "개인파산",
  serviceSlug: "bankruptcy",
  primaryKeywords: ["개인파산", ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    "개인파산",
    "변제 능력이 없거나 채무가 과도할 때 파산·면책 절차를 검토합니다. 면책 불허가 사유 가능성도 함께 봅니다.",
  ),
  targetUsers: [
    "장기 연체·추심 스트레스",
    "회생 불가능 판단 중",
    "면책 절차가 궁금한 분",
  ],
  questions: [
    {
      id: "bank-income",
      question: "현재 소득이 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "없음", value: "none", score: 10 },
        { label: "일부 있음", value: "some", score: 8 },
        { label: "급여·사업 소득 있음", value: "yes", score: 14, nextRecommendation: "개인회생과 비교 검토가 필요할 수 있습니다." },
      ],
    },
    {
      id: "bank-assets",
      question: "재산(부동산·차량·예금 등)이 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "거의 없음", value: "none", score: 8 },
        { label: "일부 있음", value: "some", score: 12 },
        { label: "부동산 등 큰 재산", value: "major", score: 18, tags: ["debt"] },
      ],
    },
    {
      id: "bank-cause",
      question: "채무 발생 원인은? (복수 선택 가능)",
      type: "multiple",
      weight: 2,
      required: true,
      options: [
        { label: "생활·카드", value: "living", score: 6 },
        { label: "사업 실패", value: "business", score: 10 },
        { label: "보증", value: "guarantee", score: 14 },
        { label: "도박·투자", value: "gamble", score: 18, tags: ["dispute"] },
      ],
    },
    {
      id: "bank-discharge-bar",
      question: "면책 불허가 사유가 있을 수 있나요?",
      description: "최근 고액 도박·허위 진술·재산 은닉 등",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "해당 없음", value: "no", score: 4 },
        { label: "걱정되는 사정 있음", value: "maybe", score: 20, tags: ["urgent"], warning: "면책 가능 여부는 사실관계 확인이 필요합니다." },
        { label: "모르겠음", value: "unknown", score: 12 },
      ],
    },
    {
      id: "bank-age-health",
      question: "나이·건강·근로 가능성은?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "근로 가능", value: "able", score: 10 },
        { label: "연령·건강상 어려움", value: "limited", score: 8 },
        { label: "장기 무소득", value: "none", score: 12 },
      ],
    },
    {
      id: "bank-debt",
      question: "총 채무액(대략, 원)",
      type: "number",
      weight: 2,
      required: true,
    },
  ],
  outcomes: createStandardOutcomes("개인파산", "/services/bankruptcy", [
    "채무·재산 목록",
    "진술서",
    "소득 증빙",
  ]),
  requiredDocuments: [
    "채무·재산 목록",
    "소득 증빙",
    "진술서",
    "금융 내역",
  ],
  processSteps: [
    "파산·면책 가능성 상담",
    "신청서 작성",
    "법원 접수",
    "면책 절차",
  ],
  costFactors: ["채권자 수", "재산 관리", "보정"],
  deadlineWarnings: [
    "재산 은닉 시 불이익",
    "면책 불허 사유 확인",
    "회생과 절차 선택 비교",
  ],
  caseExample: {
    title: "부산 개인파산 상담 예시",
    body: "다중 채무 의뢰인께 회생 대비 파산 요건을 설명하고 급한 압류 대응 순서를 정리했습니다.",
  },
  faqs: standardFaqs("개인파산"),
  relatedLinks: standardRelatedLinks("개인파산", [
    { href: "/개인회생자가진단", label: "개인회생 자가진단" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
