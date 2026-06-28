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

const service = "상속포기";

export const inheritanceRenunciationDiagnosis: Diagnosis = {
  id: "inheritance-renunciation",
  slug: "상속포기자가진단",
  title: `부산 ${service} 자가진단`,
  metaTitle: `부산 ${service} 자가진단 | 해운대·센텀 법무사`,
  metaDescription:
    "상속포기 자가진단. 사망일·채무·재산·3개월 기한·공동상속인·재산처분 여부를 확인하고 절차를 안내합니다.",
  h1: `부산 ${service} 자가진단 — 절차·필요서류·기한 확인`,
  serviceName: service,
  serviceSlug: "inheritance-renunciation",
  primaryKeywords: [service, ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    service,
    "피상속인 채무가 재산보다 많을 가능성이 있으면 상속포기를 검토합니다. 이미 재산을 처분했거나 3개월이 경과했으면 선택지가 달라질 수 있습니다.",
  ),
  targetUsers: [
    "피상속인 채무가 많다고 들은 상속인",
    "상속을 포기하고 싶은 분",
    "3개월 기한이 걱정되는 분",
    "다른 상속인과 절차를 맞춰야 하는 분",
  ],
  questions: [
    {
      id: "renounce-death-date",
      question: "피상속인 사망일 또는 사망 사실을 안 날은?",
      type: "date",
      weight: 2.5,
      required: true,
    },
    {
      id: "renounce-debt",
      question: "피상속인 채무가 있다고 알고 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "채무가 많을 것 같습니다", value: "high", score: 22, tags: ["debt", "urgent"] },
        { label: "일부 있으나 적을 것 같습니다", value: "low", score: 8, tags: ["debt"] },
        { label: "모르겠습니다", value: "unknown", score: 18, tags: ["debt", "urgent"], warning: "채무 조사 없이 단순승인만 하면 위험할 수 있습니다." },
      ],
    },
    {
      id: "renounce-asset",
      question: "상속 재산(부동산·예금 등)이 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "있습니다", value: "yes", score: 12, nextRecommendation: "한정승인과 비교 검토가 필요할 수 있습니다." },
        { label: "거의 없습니다", value: "no", score: 6 },
        { label: "확인 필요", value: "unknown", score: 10 },
      ],
    },
    {
      id: "renounce-three-months",
      question: "사망(또는 사실 안 날) 후 3개월이 지났나요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "아직 3개월 미만", value: "no", score: 5 },
        { label: "거의 3개월", value: "near", score: 20, tags: ["deadline", "urgent"] },
        { label: "3개월 이상", value: "yes", score: 30, tags: ["urgent", "deadline"], warning: "기한 경과 시 단순승인·한정승인 등 선택지가 달라질 수 있습니다." },
      ],
    },
    {
      id: "renounce-co-heirs",
      question: "다른 상속인이 있나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "예, 있습니다", value: "yes", score: 10, tags: ["dispute"] },
        { label: "본인만 상속인", value: "no", score: 4 },
        { label: "확인 필요", value: "unknown", score: 8 },
      ],
    },
    {
      id: "renounce-disposed",
      question: "이미 상속 재산을 처분·명의변경·인출하셨나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "예, 일부라도 했습니다", value: "yes", score: 25, tags: ["urgent"], warning: "재산 처분 후 포기·한정승인 검토가 복잡해질 수 있습니다." },
        { label: "아니요", value: "no", score: 3 },
        { label: "예금만 확인 정도", value: "check", score: 12 },
      ],
    },
  ],
  outcomes: createStandardOutcomes(service, "/services/inheritance-renunciation", [
    "상속포기 신고서",
    "가족관계증명서·기본증명서",
    "인감증명서",
  ]),
  requiredDocuments: [
    "상속포기 신고서",
    "피상속인·상속인 가족관계증명서",
    "피상속인 기본증명서(사망)",
    "주민등록등본·인감증명서",
    "채무 조사 관련 서류(해당 시)",
  ],
  processSteps: [
    "채무·재산 목록 파악",
    "상속포기 vs 한정승인 비교",
    "관할 가정법원 상속포기 신고",
    "신고 후 등기·채권자 대응 정리",
  ],
  costFactors: ["상속인 수", "채무 조사 범위", "가정법원 신고 대리"],
  deadlineWarnings: [
    "원칙적으로 상속 개시 후 3개월 내 신고",
    "기한 경과 시 단순승인 간주 위험",
    "재산 처분 후에는 절차 선택이 제한될 수 있음",
  ],
  caseExample: {
    title: "부산 반여동 상속포기 상담 예시",
    body: "채무가 많은 부모 상속을 앞두고 연락 주신 상속인께 채무조회를 정리해 드리고, 3개월 기한 전 가정법원 상속포기 신고를 진행했습니다.",
  },
  faqs: standardFaqs(service),
  relatedLinks: standardRelatedLinks(service, [
    { href: "/한정승인자가진단", label: "한정승인 자가진단" },
    { href: "/부산가정법원상속", label: "부산가정법원 상속 안내" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
