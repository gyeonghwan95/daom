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

const service = "법인등기";

export const corporateRegistrationDiagnosis: Diagnosis = {
  id: "corporate-registration",
  slug: "법인등기자가진단",
  title: `부산 ${service} 자가진단`,
  metaTitle: `부산 ${service} 자가진단 | 해운대·센텀 법무사`,
  metaDescription:
    "법인등기 자가진단. 대표·임원·본점·목적·증자·해산·청산 변경과 변경일·기한·과태료를 확인합니다.",
  h1: `부산 ${service} 자가진단 — 절차·필요서류·기한 확인`,
  serviceName: service,
  serviceSlug: "corporate-registration",
  primaryKeywords: [service, ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    service,
    "법인 설립·임원변경·본점이전·정관변경·증자·해산·청산은 결의 요건과 등기 기한이 맞아야 합니다.",
  ),
  targetUsers: [
    "법인 대표·경영진",
    "스타트업·중소법인 담당자",
    "등기 기한·과태료가 걱정되는 분",
  ],
  questions: [
    {
      id: "corp-change-types",
      question: "필요한 변경·등기는 무엇인가요? (복수 선택 가능)",
      type: "multiple",
      weight: 2,
      required: true,
      options: [
        { label: "대표이사 변경", value: "ceo", score: 10 },
        { label: "임원(이사·감사) 변경", value: "director", score: 8 },
        { label: "본점 이전", value: "address", score: 12, tags: ["penalty"] },
        { label: "목적·상호·자본 등 정관 변경", value: "articles", score: 10 },
        { label: "증자·감자", value: "capital", score: 14 },
        { label: "해산·청산", value: "dissolve", score: 18, tags: ["urgent"] },
        { label: "신규 설립", value: "new", score: 6 },
      ],
    },
    {
      id: "corp-resolution",
      question: "주주총회·이사회 결의가 완료되었나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "완료", value: "done", score: 4 },
        { label: "진행 중", value: "ongoing", score: 12 },
        { label: "아직 없음", value: "no", score: 16, nextRecommendation: "정관상 결의 요건부터 확인하세요." },
      ],
    },
    {
      id: "corp-change-date",
      question: "결의일(또는 변경 효력 발생일)은?",
      type: "date",
      weight: 2.5,
      required: true,
    },
    {
      id: "corp-weeks-passed",
      question: "결의 후 2주가 지났나요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "2주 미만", value: "no", score: 4 },
        { label: "2주~4주", value: "mid", score: 18, tags: ["penalty", "deadline"] },
        { label: "1개월 이상", value: "yes", score: 28, tags: ["urgent", "penalty"], warning: "과태료·보정 가능성을 확인해야 합니다." },
      ],
    },
    {
      id: "corp-registry-check",
      question: "등기부등본·정관을 최근에 확인했나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "확인함", value: "yes", score: 3 },
        { label: "오래됨·미확인", value: "no", score: 12, tags: ["dispute"] },
      ],
    },
  ],
  outcomes: createStandardOutcomes(service, "/services/corporate-registration", [
    "정관·등기사항전부증명서",
    "주주총회·이사회 의사록",
    "등기신청서",
  ]),
  requiredDocuments: [
    "정관·등기사항전부증명서",
    "주주총회·이사회 의사록",
    "취임승낙서·사임서·인감증명서",
    "등기신청서·수수료",
  ],
  processSteps: [
    "정관·등기부 확인",
    "결의서·신청서 작성",
    "관할 등기소 접수",
    "등기 완료·후속 안내",
  ],
  costFactors: ["등기 종류", "본점 소재지", "자본금·지점"],
  deadlineWarnings: [
    "본점이전·임원변경 등 결의 후 2주 내 등기",
    "지연 시 과태료",
    "정관 불일치 시 보정 지연",
  ],
  caseExample: {
    title: "센텀 법인등기 상담 예시",
    body: "투자 후 임원 변경이 필요한 스타트업에 정관 확인 후 2주 기한 내 임원변경등기를 접수했습니다.",
  },
  faqs: standardFaqs(service),
  relatedLinks: standardRelatedLinks(service, [
    { href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" },
    { href: "/법인등기", label: "법인등기 허브" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
