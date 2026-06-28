import type { Diagnosis, DiagnosisQuestion } from "../diagnosis";
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

const service = "상속등기";

export const inheritanceRegistrationDiagnosis: Diagnosis = {
  id: "inheritance-registration",
  slug: "상속등기자가진단",
  title: "부산 상속등기 자가진단",
  metaTitle: "부산 상속등기 자가진단 | 해운대·센텀 법무사",
  metaDescription:
    "상속등기 자가진단. 사망일·부동산·공동상속인·협의분할·미성년·해외 상속인·등기 지연을 확인하고 절차·필요서류·기한을 안내합니다.",
  h1: "부산 상속등기 자가진단 — 절차·필요서류·비용·기한 확인",
  serviceName: service,
  serviceSlug: "inheritance-registration",
  primaryKeywords: [service, ...DIAGNOSIS_SEO_KEYWORDS, "필요서류", "비용", "기한", "과태료"],
  intro: seoIntroParagraphs(
    service,
    "피상속인 사망 후 부동산 명의 정리, 상속인 간 협의, 채무 여부에 따라 상속등기 전에 상속포기·한정승인을 검토해야 할 수 있습니다. 공동상속인·미성년·해외 거주 상속인이 있으면 서류와 기한이 달라집니다.",
  ),
  targetUsers: [
    "부모님·배우자 명의 아파트·토지를 상속받아야 하는 분",
    "상속인이 2명 이상이라 협의분할이 필요한 분",
    "저당권·가압류가 있는 부동산을 상속한 분",
    "상속 개시 후 3개월 기한이 걱정되는 분",
    "해외에 거주하는 상속인이 있는 분",
  ],
  questions: [
    {
      id: "inherit-death-date",
      question: "피상속인 사망일(또는 사망 사실을 안 날)은 언제인가요?",
      description: "상속포기·한정승인 3개월 기한 계산에 사용됩니다.",
      type: "date",
      weight: 2,
      required: true,
    },
    {
      id: "inherit-real-estate",
      question: "피상속인 명의 부동산(아파트·토지·상가 등)이 있나요?",
      description: "등기부등본으로 최종 확인이 필요합니다.",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "예, 있습니다", value: "yes", score: 12, tags: ["deadline"] },
        { label: "없습니다", value: "no", score: 3 },
        { label: "확인이 필요합니다", value: "unknown", score: 8, tags: ["deadline"] },
      ],
    },
    {
      id: "inherit-heir-count",
      question: "공동상속인은 몇 명인가요? (본인 포함)",
      description: "상속인 수에 따라 협의분할·공유등기 방식이 달라집니다.",
      type: "number",
      weight: 1.5,
      required: true,
    },
    {
      id: "inherit-division",
      question: "상속재산분할협의(누가 어떤 재산을 가져갈지)는 정리되었나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "협의 완료·서면 있음", value: "done", score: 5 },
        { label: "구두 합의만 있음", value: "verbal", score: 12, tags: ["dispute"] },
        { label: "아직 협의 중", value: "ongoing", score: 18, tags: ["dispute"] },
        { label: "협의가 어렵습니다", value: "conflict", score: 25, tags: ["urgent", "dispute"], warning: "상속인 간 분쟁이 있으면 등기 전에 협의서·공증 방향을 먼저 잡는 것이 좋습니다." },
      ],
    },
    {
      id: "inherit-minor",
      question: "미성년자 상속인이 있나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "예", value: "yes", score: 14, tags: ["minor"], nextRecommendation: "미성년 상속인이 있으면 가정법원·공증 절차가 추가될 수 있습니다." },
        { label: "아니요", value: "no", score: 2 },
        { label: "모르겠습니다", value: "unknown", score: 8, tags: ["minor"] },
      ],
    },
    {
      id: "inherit-overseas",
      question: "해외에 거주하는 상속인이 있나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "예", value: "yes", score: 15, tags: ["overseas"], warning: "해외 상속인은 위임장·공증·송달 방식이 달라질 수 있습니다." },
        { label: "아니요", value: "no", score: 2 },
        { label: "앞으로 해외 체류 예정", value: "planned", score: 10, tags: ["overseas"] },
      ],
    },
    {
      id: "inherit-delay",
      question: "상속등기(명의 변경)를 미룬 지 얼마나 되었나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "아직 시작 전·1개월 미만", value: "fresh", score: 5 },
        { label: "1~2개월", value: "mid", score: 14, tags: ["deadline", "penalty"] },
        { label: "3개월 가까이 또는 그 이상", value: "late", score: 28, tags: ["urgent", "deadline", "penalty"], warning: "등기 지연 시 과태료·채무·처분 제한 이슈가 생길 수 있습니다." },
      ],
    },
  ] satisfies DiagnosisQuestion[],
  outcomes: createStandardOutcomes(
    service,
    "/services/inheritance-registration",
    [
      "피상속인·상속인 가족관계증명서·기본증명서",
      "등기필증·인감증명서·주민등록등본",
      "부동산 등기부등본",
      "상속재산분할협의서(상속인 2인 이상)",
    ],
  ),
  requiredDocuments: [
    "피상속인·상속인 가족관계증명서·기본증명서",
    "등기필증·인감증명서(사건별)",
    "부동산 등기부등본·토지대장",
    "상속재산분할협의서·인감증명서(공동상속)",
    "말소할 저당권 관련 서류(해당 시)",
    "미성년 상속인 관련 가정법원·공증 서류(해당 시)",
  ],
  processSteps: [
    "상속 개시·상속인 범위 확인",
    "채무 조사 및 상속포기·한정승인 필요 여부 검토",
    "상속재산분할협의서 작성·공증(필요 시)",
    "취득세 신고·납부",
    "관할 등기소 상속등기 접수",
  ],
  costFactors: [
    "부동산 가액·필지 수",
    "상속인 수·공증 필요 여부",
    "말소 등기·가압류 해제",
    "취득세·등기신청수수료",
    "해외 상속인 위임·공증 비용",
  ],
  deadlineWarnings: [
    "상속포기·한정승인: 원칙적으로 상속 개시 후 3개월",
    "상속등기: 지연 시 과태료·거래·대출 제한 가능",
    "미성년·해외 상속인: 추가 절차로 기간 연장 필요할 수 있음",
    "채무 초과 시 단순승인만 하면 개인 채무 부담 위험",
  ],
  caseExample: {
    title: "부산 해운대 상속등기 상담 예시",
    body: "재송동 거주 상속인 3명이 부모 아파트 상속등기를 문의하셨습니다. 대출 잔액 확인 후 한정승인은 불필요하다고 판단했고, 협의분할 협의서 작성 → 취득세 → 센텀 관할 등기소 접수 순으로 3주 내 완료 일정을 안내드렸습니다.",
  },
  faqs: standardFaqs(service),
  relatedLinks: standardRelatedLinks(service, [
    { href: "/상속", label: "부산 상속 종합 허브" },
    { href: "/상속등기비용", label: "상속등기 비용 안내" },
    { href: "/상속등기필요서류", label: "상속등기 필요서류" },
    { href: "/한정승인자가진단", label: "한정승인 자가진단" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
