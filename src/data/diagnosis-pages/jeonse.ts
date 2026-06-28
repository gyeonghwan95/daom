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

const jeonseSharedQuestions = [
  {
    id: "jeonse-ended",
    question: "임대차 계약이 종료되었나요?",
    type: "single" as const,
    weight: 2,
    required: true,
    options: [
      { label: "종료·만료", value: "ended", score: 12 },
      { label: "곧 만료", value: "soon", score: 8 },
      { label: "기간 남음", value: "active", score: 5 },
    ],
  },
  {
    id: "jeonse-unpaid",
    question: "보증금을 돌려받지 못했나요?",
    type: "single" as const,
    weight: 2.5,
    required: true,
    options: [
      { label: "거절·연락 두절", value: "refused", score: 26, tags: ["urgent", "dispute"] },
      { label: "지연 중", value: "delayed", score: 18, tags: ["deadline"] },
      { label: "협의 중", value: "talk", score: 10 },
    ],
  },
  {
    id: "jeonse-move",
    question: "이사 예정·완료 여부는?",
    type: "single" as const,
    weight: 2,
    required: true,
    options: [
      { label: "이사 완료", value: "done", score: 16, tags: ["deadline"] },
      { label: "이사 임박", value: "soon", score: 14, tags: ["deadline", "urgent"] },
      { label: "아직 거주", value: "stay", score: 6 },
    ],
  },
  {
    id: "jeonse-movein",
    question: "전입신고·확정일자를 하셨나요?",
    type: "single" as const,
    weight: 2.5,
    required: true,
    options: [
      { label: "둘 다 완료", value: "both", score: 4 },
      { label: "일부만", value: "partial", score: 16, tags: ["urgent"] },
      { label: "안 함", value: "no", score: 24, tags: ["urgent", "deadline"], warning: "대항력·우선변제 요건이 충족되지 않을 수 있습니다." },
    ],
  },
  {
    id: "jeonse-landlord",
    question: "집주인과 연락이 되나요?",
    type: "single" as const,
    weight: 1.5,
    required: true,
    options: [
      { label: "연락 안 됨", value: "no", score: 18, tags: ["dispute"] },
      { label: "연락은 됨", value: "yes", score: 8 },
    ],
  },
  {
    id: "jeonse-certified",
    question: "내용증명을 보내셨나요?",
    type: "single" as const,
    weight: 1.5,
    required: true,
    options: [
      { label: "발송함", value: "yes", score: 6 },
      { label: "아직", value: "no", score: 10, nextRecommendation: "반환 독촉용 내용증명 검토가 필요할 수 있습니다." },
    ],
  },
];

export const jeonseDepositDiagnosis: Diagnosis = {
  id: "jeonse-deposit",
  slug: "전세보증금자가진단",
  title: "부산 전세보증금 자가진단",
  metaTitle: "부산 전세보증금 자가진단 | 해운대·센텀 법무사",
  metaDescription:
    "전세보증금 반환 자가진단. 계약 종료, 미반환, 이사, 전입·확정일자, 집주인 연락, 내용증명을 확인합니다.",
  h1: "부산 전세보증금 자가진단 — 절차·필요서류 확인",
  serviceName: "전세보증금반환",
  primaryKeywords: ["전세보증금", ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    "전세보증금 반환",
    "보증금 반환 지연·임대인 연락 두절 시 임차권등기명령·내용증명·소송 순서를 정해야 합니다.",
  ),
  targetUsers: [
    "전세 만료·이사 예정 임차인",
    "보증금 반환 거절·지연",
    "전세사기 우려",
  ],
  questions: jeonseSharedQuestions,
  outcomes: createStandardOutcomes("전세보증금반환", "/임대차전세", [
    "임대차계약서",
    "전입·확정일자 확인",
    "등기부등본",
  ]),
  requiredDocuments: [
    "임대차계약서",
    "전입세대열람·확정일자",
    "등기부등본",
    "내용증명·신청서(절차별)",
  ],
  processSteps: [
    "계약·등기부 확인",
    "내용증명·협상",
    "임차권등기명령 또는 소송 검토",
    "집행·반환",
  ],
  costFactors: ["보증금 액수", "소송·등기 병행"],
  deadlineWarnings: [
    "이사 전후 대항력·우선변제 요건",
    "보증금 반환 지연 이자",
    "등기부 선순위 권리 확인",
  ],
  caseExample: {
    title: "수영구 전세보증금 상담 예시",
    body: "만료 후 보증금 미반환 임차인께 등기부 확인 후 임차권등기명령 방향을 안내했습니다.",
  },
  faqs: standardFaqs("전세보증금"),
  relatedLinks: standardRelatedLinks("전세보증금", [
    { href: "/임차권등기명령자가진단", label: "임차권등기명령 자가진단" },
    { href: "/임대차전세", label: "임대차·전세 허브" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};

export const leaseRegistrationOrderDiagnosis: Diagnosis = {
  id: "lease-registration-order",
  slug: "임차권등기명령자가진단",
  title: "부산 임차권등기명령 자가진단",
  metaTitle: "부산 임차권등기명령 자가진단 | 해운대·센텀 법무사",
  metaDescription:
    "임차권등기명령 자가진단. 계약 종료, 보증금 미반환, 이사, 전입·확정일자, 집주인 연락, 내용증명을 확인합니다.",
  h1: "부산 임차권등기명령 자가진단 — 절차·필요서류 확인",
  serviceName: "임차권등기명령",
  primaryKeywords: ["임차권등기명령", ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    "임차권등기명령",
    "전세 보증금 보호를 위해 법원 명령으로 임차권을 등기하는 절차입니다. 이사 시점과 요건이 중요합니다.",
  ),
  targetUsers: [
    "전세 만료 후 보증금 미반환",
    "전세권설정 대신 검토 중",
    "이사 전후 시기 고민",
  ],
  questions: [
    ...jeonseSharedQuestions,
    {
      id: "lease-housing",
      question: "주택 임대차인가요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "주택", value: "yes", score: 4 },
        { label: "상가 등", value: "no", score: 16, tags: ["dispute"] },
      ],
    },
  ],
  outcomes: createStandardOutcomes("임차권등기명령", "/faq/jeonse-registration-faq", [
    "임대차계약서",
    "임차권등기명령 신청서",
    "등기부등본",
  ]),
  requiredDocuments: [
    "임대차계약서",
    "전입·확정일자 확인",
    "등기부등본",
    "임차권등기명령 신청서",
  ],
  processSteps: [
    "요건 검토",
    "신청서 작성·법원 접수",
    "명령 발령",
    "등기소 경료등기",
  ],
  costFactors: ["보증금 액수", "소송 병행"],
  deadlineWarnings: [
    "이사·대항력 시점 엄수",
    "신청 지연 시 우선변제 리스크",
  ],
  caseExample: {
    title: "해운대 임차권등기명령 상담 예시",
    body: "이사 전 요건 확인 후 신청서 작성을 도와 드리고 명령 후 등기까지 일정을 안내했습니다.",
  },
  faqs: standardFaqs("임차권등기명령"),
  relatedLinks: standardRelatedLinks("임차권등기명령", [
    { href: "/전세보증금자가진단", label: "전세보증금 자가진단" },
    { href: "/blog/jeonse-right-vs-lease-registration-order", label: "전세권 vs 임차권등기명령" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
