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

const civilSharedQuestions = [
  {
    id: "civil-claim",
    question: "받을 돈(채권)이 명확한가요?",
    type: "single" as const,
    weight: 2,
    required: true,
    options: [
      { label: "금액·내용이 분명함", value: "clear", score: 6 },
      { label: "대략 있으나 정리 필요", value: "partial", score: 12 },
      { label: "불명확", value: "unclear", score: 18, tags: ["dispute"] },
    ],
  },
  {
    id: "civil-evidence",
    question: "증거자료(계약서·차용증·카톡 등)가 있나요?",
    type: "single" as const,
    weight: 2.5,
    required: true,
    options: [
      { label: "차용증·계약서 등", value: "strong", score: 4 },
      { label: "일부만", value: "weak", score: 14, tags: ["dispute"] },
      { label: "거의 없음", value: "none", score: 22, tags: ["urgent", "dispute"] },
    ],
  },
  {
    id: "civil-address",
    question: "상대방 주소를 알고 있나요?",
    type: "single" as const,
    weight: 2,
    required: true,
    options: [
      { label: "알고 있음", value: "yes", score: 4 },
      { label: "과거 주소만", value: "old", score: 12 },
      { label: "모름", value: "no", score: 20, tags: ["urgent"] },
    ],
  },
  {
    id: "civil-dispute",
    question: "금액·사실관계 다툼 가능성은?",
    type: "single" as const,
    weight: 2,
    required: true,
    options: [
      { label: "낮음", value: "low", score: 4 },
      { label: "있음", value: "yes", score: 14, tags: ["dispute"] },
      { label: "이미 분쟁 중", value: "active", score: 20, tags: ["dispute", "urgent"] },
    ],
  },
  {
    id: "civil-statute",
    question: "소멸시효·오래된 채권 우려가 있나요?",
    type: "single" as const,
    weight: 2.5,
    required: true,
    options: [
      { label: "최근 발생", value: "recent", score: 4 },
      { label: "수년 지남", value: "old", score: 16, tags: ["statute", "deadline"] },
      { label: "10년 가까이", value: "veryold", score: 26, tags: ["urgent", "statute"], warning: "시효 완성 여부를 서류로 확인해야 합니다." },
    ],
  },
];

export const paymentOrderDiagnosis: Diagnosis = {
  id: "payment-order",
  slug: "지급명령자가진단",
  title: "부산 지급명령 자가진단",
  metaTitle: "부산 지급명령 자가진단 | 해운대·센텀 법무사",
  metaDescription:
    "지급명령 자가진단. 채권 존재, 증거, 상대방 주소, 다툼, 소멸시효를 확인합니다.",
  h1: "부산 지급명령 자가진단 — 절차·필요서류 확인",
  serviceName: "지급명령",
  primaryKeywords: ["지급명령", ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    "지급명령",
    "금전 채권 회수 시 소장보다 빠른 지급명령 절차가 가능한지 확인합니다.",
  ),
  targetUsers: [
    "대여금·물품대금 미회수",
    "차용증·계약서 보유",
    "소송 전 절차 검토",
  ],
  questions: civilSharedQuestions,
  outcomes: createStandardOutcomes("지급명령", "/민사소송", [
    "지급명령 신청서",
    "채권 증빙",
    "채무자 주소 확인 서류",
  ]),
  requiredDocuments: [
    "지급명령 신청서",
    "채권 증빙",
    "채무자 주소 확인 서류",
    "인지대",
  ],
  processSteps: [
    "채권·증거 검토",
    "신청서 작성",
    "법원 접수",
    "이의 유무에 따른 확정",
  ],
  costFactors: ["청구 금액", "증거 보완", "본안 소송 전환"],
  deadlineWarnings: [
    "소멸시효 확인",
    "이의신청 시 본안 소송",
  ],
  caseExample: {
    title: "부산 지급명령 상담 예시",
    body: "대여금 미변제 의뢰인께 차용증 검토 후 지급명령 신청 가능 여부를 안내했습니다.",
  },
  faqs: standardFaqs("지급명령"),
  relatedLinks: standardRelatedLinks("지급명령", [
    { href: "/내용증명자가진단", label: "내용증명 자가진단" },
    { href: "/부산지방법원법무사", label: "부산지방법원 안내" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};

export const certifiedMailDiagnosis: Diagnosis = {
  id: "certified-mail",
  slug: "내용증명자가진단",
  title: "부산 내용증명 자가진단",
  metaTitle: "부산 내용증명 자가진단 | 해운대·센텀 법무사",
  metaDescription:
    "내용증명 자가진단. 받을 돈, 증거, 상대방 주소, 다툼, 소멸시효를 확인합니다.",
  h1: "부산 내용증명 자가진단 — 절차·필요서류 확인",
  serviceName: "내용증명",
  primaryKeywords: ["내용증명", ...DIAGNOSIS_SEO_KEYWORDS],
  intro: seoIntroParagraphs(
    "내용증명",
    "계약 해지·채무 독촉·의사표시를 공식적으로 남기는 절차입니다. 후속 소송·등기 전 단계로 활용됩니다.",
  ),
  targetUsers: [
    "계약 해지 통보 필요",
    "채무 독촉·의사표시",
    "분쟁 전 증거 보존",
  ],
  questions: [
    ...civilSharedQuestions,
    {
      id: "cert-purpose",
      question: "내용증명 목적은?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "해지·취소 통보", value: "terminate", score: 8 },
        { label: "채권 독촉", value: "claim", score: 10 },
        { label: "의사표시·이의", value: "notice", score: 8 },
        { label: "기타", value: "other", score: 6 },
      ],
    },
    {
      id: "cert-deadline",
      question: "통지·응답 기한이 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "기한 임박", value: "tight", score: 18, tags: ["urgent", "deadline"] },
        { label: "여유 있음", value: "ok", score: 4 },
      ],
    },
  ],
  outcomes: createStandardOutcomes("내용증명", "/민사소송", [
    "내용증명 문안",
    "계약서·증빙",
  ]),
  requiredDocuments: [
    "내용증명 원본·사본",
    "계약서·관련 증빙",
    "발송 영수증",
  ],
  processSteps: [
    "문안 작성",
    "우체국 발송",
    "송달·보관",
    "후속 절차 안내",
  ],
  costFactors: ["발송 통수", "문안 복잡도"],
  deadlineWarnings: [
    "계약상 통지 기한",
    "송달 불능 시 대체 방법",
  ],
  caseExample: {
    title: "부산 내용증명 상담 예시",
    body: "임대차 해지 통보용 내용증명 문안을 검토해 드리고 발송 후 임차권등기명령 일정을 잡았습니다.",
  },
  faqs: standardFaqs("내용증명"),
  relatedLinks: standardRelatedLinks("내용증명", [
    { href: "/지급명령자가진단", label: "지급명령 자가진단" },
  ]),
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
