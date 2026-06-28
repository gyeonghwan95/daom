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

const service = "임원변경등기";

export const directorChangeDiagnosis: Diagnosis = {
  id: "director-change",
  slug: "임원변경등기자가진단",
  title: `부산 ${service} 자가진단`,
  metaTitle: `부산 ${service} 자가진단 | 해운대·센텀 법무사`,
  metaDescription:
    "임원변경등기 자가진단. 임기 만료, 대표이사·사내이사·감사 변경, 변경일, 2주 경과, 과태료 가능성을 확인합니다.",
  h1: `부산 ${service} 자가진단 — 절차·필요서류·기한 확인`,
  serviceName: service,
  serviceSlug: "director-change",
  primaryKeywords: [service, ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    service,
    "대표이사·이사·감사 변경은 정관과 결의 요건을 맞춘 뒤 보통 2주 내 등기해야 과태료를 피할 수 있습니다.",
  ),
  targetUsers: [
    "대표이사 교체 예정 법인",
    "임기 만료 임원",
    "등기 안 된 취임이 있는 법인",
  ],
  questions: [
    {
      id: "director-term",
      question: "변경 사유에 임기 만료가 포함되나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "예", value: "yes", score: 8 },
        { label: "아니요(중도 사임·해임 등)", value: "no", score: 12 },
        { label: "모르겠음", value: "unknown", score: 10 },
      ],
    },
    {
      id: "director-ceo",
      question: "대표이사 변경이 있나요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "예", value: "yes", score: 14, tags: ["penalty"] },
        { label: "아니요", value: "no", score: 5 },
      ],
    },
    {
      id: "director-others",
      question: "사내이사·감사 등 다른 임원 변경이 있나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "예", value: "yes", score: 10 },
        { label: "아니요", value: "no", score: 3 },
      ],
    },
    {
      id: "director-change-date",
      question: "최종 결의일(변경일)은?",
      type: "date",
      weight: 2.5,
      required: true,
    },
    {
      id: "director-two-weeks",
      question: "결의 후 2주가 지났나요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "아직 2주 미만", value: "no", score: 4 },
        { label: "2주 넘음", value: "yes", score: 26, tags: ["urgent", "penalty"], warning: "과태료 부과 가능성을 확인해야 합니다." },
      ],
    },
    {
      id: "director-penalty-risk",
      question: "이미 등기소에서 과태료·보정 안내를 받으셨나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "예", value: "yes", score: 20, tags: ["urgent", "penalty"] },
        { label: "아니요", value: "no", score: 4 },
        { label: "모르겠음", value: "unknown", score: 10 },
      ],
    },
  ],
  outcomes: createStandardOutcomes(service, "/services/director-change", [
    "의사록·취임승낙서",
    "등기부·정관",
    "인감증명서",
  ]),
  requiredDocuments: [
    "주주총회·이사회 의사록",
    "취임승낙서·사임서",
    "인감증명서·등기부",
    "정관",
  ],
  processSteps: [
    "정관상 결의 요건 확인",
    "의사록·승낙서 작성",
    "등기소 접수",
    "완료 확인",
  ],
  costFactors: ["변경 임원 수", "본점 관할", "과태료 여부"],
  deadlineWarnings: [
    "결의 후 2주 내 등기",
    "취임 승낙 누락 시 보정",
    "과태료 별도 발생 가능",
  ],
  caseExample: {
    title: "문현 임원변경 상담 예시",
    body: "대표이사 교체 법인에 정관 확인 후 이사회·주총 의사록을 작성하고 기한 내 등기 접수를 완료했습니다.",
  },
  faqs: standardFaqs(service),
  relatedLinks: standardRelatedLinks(service, [
    { href: "/법인등기자가진단", label: "법인등기 자가진단" },
    { href: "/services/director-change", label: "임원변경 업무 상세" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
