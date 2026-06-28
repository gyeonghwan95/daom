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

function baseRealEstate(service: string, slug: string, id: string, serviceSlug: string, detail: string): Omit<Diagnosis, "questions" | "outcomes" | "relatedLinks"> {
  return {
    id,
    slug,
    title: `부산 ${service} 자가진단`,
    metaTitle: `부산 ${service} 자가진단 | 해운대·센텀 법무사`,
    metaDescription: `${service} 자가진단. 매매·증여·상속, 잔금일, 부동산 종류, 근저당, 공동명의, 등기 지연을 확인합니다.`,
    h1: `부산 ${service} 자가진단 — 절차·필요서류·비용·기한 확인`,
    serviceName: service,
    serviceSlug,
    primaryKeywords: [service, ...DIAGNOSIS_SEO_KEYWORDS],
    intro: seoIntroParagraphs(service, detail),
    targetUsers: [
      "아파트·상가·토지 매매·증여·상속 예정자",
      "잔금 후 등기가 필요한 분",
      "근저당·가압류가 있는 부동산 거래자",
      "공동명의 정리가 필요한 분",
    ],
    requiredDocuments: [
      "매매·증여·상속 원인계약서",
      "등기부등본·인감증명서",
      "취득세 납부 서류",
      "말소 서류(근저당·가압류 해당 시)",
    ],
    processSteps: [
      "등기부·계약 검토",
      "취득세 산출·납부",
      "등기 신청",
      "권리증 수령",
    ],
    costFactors: ["부동산 가액", "말소 등기", "취득세", "공동명의 인원"],
    deadlineWarnings: [
      "취득세 신고 기한",
      "잔금 후 등기 지연 시 분쟁 리스크",
      "선순위 권리 미확인 시 거래 지연",
    ],
    caseExample: {
      title: `부산 ${service} 상담 예시`,
      body: "잔금 직후 연락 주신 의뢰인께 저당 말소 확인 → 취득세 → 등기 접수 일정을 당일 안내했습니다.",
    },
    faqs: standardFaqs(service),
    ctaTitle: DIAGNOSIS_CTA_TITLE,
    ctaText: DIAGNOSIS_CTA_TEXT,
  };
}

const sharedQuestions = [
  {
    id: "re-cause",
    question: "소유권 이전 원인은 무엇인가요?",
    type: "single" as const,
    weight: 2,
    required: true,
    options: [
      { label: "매매", value: "sale", score: 8 },
      { label: "증여", value: "gift", score: 10 },
      { label: "상속", value: "inherit", score: 12, tags: ["deadline"] },
      { label: "협의분할·기타", value: "other", score: 14 },
    ],
  },
  {
    id: "re-balance-date",
    question: "잔금일(또는 증여·상속 사실 발생일)은?",
    description: "취득세·등기 시기와 관련됩니다.",
    type: "date" as const,
    weight: 2,
    required: true,
  },
  {
    id: "re-type",
    question: "부동산 종류는?",
    type: "single" as const,
    weight: 1.5,
    required: true,
    options: [
      { label: "아파트·오피스텔", value: "apt", score: 6 },
      { label: "토지", value: "land", score: 8 },
      { label: "상가·사무실", value: "commercial", score: 10 },
      { label: "기타", value: "other", score: 8 },
    ],
  },
  {
    id: "re-mortgage",
    question: "등기부에 근저당·가압류 등이 있나요?",
    type: "single" as const,
    weight: 2.5,
    required: true,
    options: [
      { label: "있습니다", value: "yes", score: 20, tags: ["mortgage", "urgent"] },
      { label: "없습니다", value: "no", score: 3 },
      { label: "확인 필요", value: "unknown", score: 12, tags: ["mortgage"] },
    ],
  },
  {
    id: "re-co-owner",
    question: "공동명의(공유)인가요?",
    type: "single" as const,
    weight: 1.5,
    required: true,
    options: [
      { label: "단독 명의", value: "single", score: 3 },
      { label: "공동명의", value: "joint", score: 12, tags: ["dispute"] },
      { label: "확인 필요", value: "unknown", score: 8 },
    ],
  },
  {
    id: "re-delay",
    question: "잔금·이전 사유 발생 후 등기를 미룬 기간은?",
    type: "single" as const,
    weight: 2,
    required: true,
    options: [
      { label: "1개월 미만", value: "fresh", score: 4 },
      { label: "1~3개월", value: "mid", score: 14, tags: ["deadline"] },
      { label: "3개월 이상", value: "late", score: 22, tags: ["penalty", "deadline"] },
    ],
  },
];

export const realEstateRegistrationDiagnosis: Diagnosis = {
  ...baseRealEstate(
    "부동산등기",
    "부동산등기자가진단",
    "real-estate-registration",
    "real-estate-registration",
    "매매·증여·상속 등 원인에 따라 부동산등기 서류와 세금이 달라집니다.",
  ),
  questions: sharedQuestions,
  outcomes: createStandardOutcomes("부동산등기", "/services/real-estate-registration", [
    "매매계약서",
    "등기부등본",
    "취득세 영수증",
  ]),
  relatedLinks: standardRelatedLinks("부동산등기", [
    { href: "/소유권이전등기자가진단", label: "소유권이전등기 자가진단" },
    { href: "/부동산등기", label: "부동산등기 허브" },
  ]),
};

export const ownershipTransferDiagnosis: Diagnosis = {
  ...baseRealEstate(
    "소유권이전등기",
    "소유권이전등기자가진단",
    "ownership-transfer",
    "ownership-transfer",
    "소유권이전등기는 매매·증여·상속 등 원인별로 취득세와 제출서류가 달라집니다.",
  ),
  questions: sharedQuestions,
  outcomes: createStandardOutcomes("소유권이전등기", "/services/ownership-transfer", [
    "원인증빙 계약서",
    "등기부등본",
    "취득세 영수증",
  ]),
  relatedLinks: standardRelatedLinks("소유권이전등기", [
    { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
    { href: "/faq/ownership-transfer-documents", label: "소유권이전 서류 FAQ" },
  ]),
};
