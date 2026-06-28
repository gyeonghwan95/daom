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

const service = "한정승인";

export const qualifiedAcceptanceDiagnosis: Diagnosis = {
  id: "qualified-acceptance",
  slug: "한정승인자가진단",
  title: `부산 ${service} 자가진단`,
  metaTitle: `부산 ${service} 자가진단 | 해운대·센텀 법무사`,
  metaDescription:
    "한정승인 자가진단. 채무·재산 비교, 재산목록, 상속포기 비교, 3개월 기한, 장례비·채무 변제를 확인합니다.",
  h1: `부산 ${service} 자가진단 — 절차·필요서류·기한 확인`,
  serviceName: service,
  serviceSlug: "qualified-acceptance",
  primaryKeywords: [service, ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    service,
    "채무가 있으나 상속을 포기하기 어려운 경우 한정승인을 검토합니다. 재산목록·채무목록 작성과 3개월 기한이 핵심입니다.",
  ),
  targetUsers: [
    "채무가 있으나 부동산 상속이 필요한 분",
    "상속포기와 한정승인 차이를 알고 싶은 분",
    "재산·채무 목록 작성이 막막한 분",
  ],
  questions: [
    {
      id: "qual-debt-exceeds",
      question: "채무가 재산보다 많을 가능성이 있나요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "그럴 가능성이 큽니다", value: "yes", score: 24, tags: ["debt", "urgent"] },
        { label: "아닐 것 같습니다", value: "no", score: 6 },
        { label: "모르겠습니다", value: "unknown", score: 18, tags: ["debt"] },
      ],
    },
    {
      id: "qual-inventory",
      question: "재산·채무 목록을 작성해 보셨나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "아직 없습니다", value: "no", score: 16, nextRecommendation: "한정승인 전 재산·채무 표 작성이 필요합니다." },
        { label: "일부만 있습니다", value: "partial", score: 10 },
        { label: "작성했습니다", value: "yes", score: 4 },
      ],
    },
    {
      id: "qual-vs-renounce",
      question: "상속포기와 비교해 보셨나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "아직 비교 안 함", value: "no", score: 12 },
        { label: "포기는 어렵고 한정승인 검토", value: "qualified", score: 8 },
        { label: "포기가 맞을 수도 있음", value: "renounce", score: 14, tags: ["debt"] },
      ],
    },
    {
      id: "qual-death-date",
      question: "상속 개시일(사망일)은?",
      type: "date",
      weight: 2.5,
      required: true,
    },
    {
      id: "qual-funeral-paid",
      question: "장례비·피상속인 명의 채무를 변제하셨나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "일부 변제했습니다", value: "some", score: 14, warning: "변제 내역은 한정승인·단순승인 판단에 영향을 줄 수 있습니다." },
        { label: "변제하지 않았습니다", value: "no", score: 5 },
        { label: "모르겠습니다", value: "unknown", score: 10 },
      ],
    },
  ],
  outcomes: createStandardOutcomes(service, "/services/qualified-acceptance", [
    "한정승인 신고서",
    "재산목록·채무목록",
    "가족관계증명서",
  ]),
  requiredDocuments: [
    "한정승인 신고서·재산목록·채무목록",
    "가족관계증명서·기본증명서",
    "부동산·예금 등 재산 증빙",
    "채무 확인 서류",
  ],
  processSteps: [
    "재산·채무 목록 작성",
    "상속포기와 비교",
    "관할 가정법원 한정승인 신고",
    "이후 상속등기 등 진행",
  ],
  costFactors: ["재산·채무 조사", "상속인 수", "이후 등기"],
  deadlineWarnings: [
    "3개월 기한 엄수",
    "목록 누락 시 보정",
    "단순승인 시 무한 책임 위험",
  ],
  caseExample: {
    title: "센텀 한정승인 상담 예시",
    body: "부동산 상속은 필요하나 사업 채무가 걱정이던 의뢰인께 재산·채무 표를 작성해 드리고 한정승인 신고 후 상속등기 일정을 잡았습니다.",
  },
  faqs: standardFaqs(service),
  relatedLinks: standardRelatedLinks(service, [
    { href: "/상속포기자가진단", label: "상속포기 자가진단" },
    { href: "/faq/qualified-acceptance-vs-simple-acceptance", label: "한정승인 vs 단순승인" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
