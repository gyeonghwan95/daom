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

function simplifiedDiagnosis(
  id: string,
  slug: string,
  service: string,
  serviceSlug: string | undefined,
  detail: string,
  questions: Diagnosis["questions"],
  extraLinks: { href: string; label: string }[],
): Diagnosis {
  return {
    id,
    slug,
    title: `부산 ${service} 자가진단`,
    metaTitle: `부산 ${service} 자가진단 | 해운대·센텀 법무사`,
    metaDescription: `${service} 자가진단. 절차·필요서류·비용·기한을 질문에 답해 확인하세요.`,
    h1: `부산 ${service} 자가진단 — 절차·필요서류·기한 확인`,
    serviceName: service,
    serviceSlug,
    primaryKeywords: [service, ...DIAGNOSIS_SEO_KEYWORDS],
    intro: seoIntroParagraphs(service, detail),
    targetUsers: [
      `${service} 절차가 막막한 분`,
      "부산·해운대·센텀에서 법무사 상담을 찾는 분",
      "필요서류·기한을 미리 확인하고 싶은 분",
    ],
    questions,
    outcomes: createStandardOutcomes(
      service,
      serviceSlug ? `/services/${serviceSlug}` : "/contact",
      ["신분증·인감", "사건 관련 핵심 서류"],
    ),
    requiredDocuments: ["신분증·인감증명서", "사건 관련 계약서·등기부", "기타 상담 시 요청 서류"],
    processSteps: [
      "상황·목표 확인",
      "관할·필요서류 정리",
      "서류 작성·접수",
      "완료·후속 안내",
    ],
    costFactors: ["사건 복잡도", "관할", "서류·인원"],
    deadlineWarnings: ["업무별 법정·약정 기한 확인", "지연 시 과태료·권리 제한 가능"],
    caseExample: {
      title: `부산 ${service} 상담 예시`,
      body: `최근 ${service} 관련 문의 의뢰인께 서류 목록과 예상 일정·비용 범위를 단계별로 안내드렸습니다.`,
    },
    faqs: standardFaqs(service),
    relatedLinks: standardRelatedLinks(service, extraLinks),
    ctaTitle: DIAGNOSIS_CTA_TITLE,
    ctaText: DIAGNOSIS_CTA_TEXT,
  };
}

export const companyEstablishmentDiagnosis = simplifiedDiagnosis(
  "company-establishment",
  "법인설립자가진단",
  "법인설립등기",
  "company-establishment",
  "주식회사·유한회사 설립은 정관·자본금·임원·사무실 주소에 따라 서류가 달라집니다.",
  [
    {
      id: "est-type",
      question: "법인 형태를 정하셨나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "주식회사", value: "stock", score: 8 },
        { label: "유한회사", value: "llc", score: 8 },
        { label: "미정", value: "undecided", score: 12 },
      ],
    },
    {
      id: "est-capital",
      question: "자본금·발기인은 준비되었나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "준비됨", value: "yes", score: 5 },
        { label: "일부만", value: "partial", score: 10 },
        { label: "미정", value: "no", score: 14 },
      ],
    },
    {
      id: "est-address",
      question: "본점 주소(사무실)가 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "있음", value: "yes", score: 5 },
        { label: "없음", value: "no", score: 12 },
      ],
    },
    {
      id: "est-timeline",
      question: "설립 목표 시기는?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "1개월 내", value: "soon", score: 14, tags: ["deadline"] },
        { label: "2~3개월", value: "mid", score: 8 },
        { label: "여유", value: "later", score: 4 },
      ],
    },
  ],
  [{ href: "/창업법무", label: "창업법무 허브" }],
);

export const depositDiagnosis = simplifiedDiagnosis(
  "deposit",
  "공탁자가진단",
  "공탁",
  undefined,
  "채권·보증금·분쟁금 등을 법원 공탁소에 공탁하는 절차입니다.",
  [
    {
      id: "dep-purpose",
      question: "공탁 목적은?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "채무 변제", value: "debt", score: 10 },
        { label: "분쟁 해결", value: "dispute", score: 14, tags: ["dispute"] },
        { label: "출급·회수", value: "release", score: 8 },
      ],
    },
    {
      id: "dep-urgency",
      question: "기한 압박이 있나요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "있음", value: "yes", score: 20, tags: ["urgent", "deadline"] },
        { label: "없음", value: "no", score: 4 },
      ],
    },
    {
      id: "dep-court",
      question: "관할 법원·공탁소를 확인하셨나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "확인함", value: "yes", score: 4 },
        { label: "미확인", value: "no", score: 12 },
      ],
    },
    {
      id: "dep-docs",
      question: "공탁 관련 서류(계약서·판결문 등)가 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "있음", value: "yes", score: 5 },
        { label: "일부만", value: "partial", score: 10 },
        { label: "없음", value: "no", score: 14 },
      ],
    },
  ],
  [{ href: "/공탁채권회수", label: "공탁·채권회수 허브" }],
);

export const adultGuardianshipDiagnosis = simplifiedDiagnosis(
  "adult-guardianship",
  "성년후견자가진단",
  "성년후견",
  undefined,
  "인지능력 저하 등으로 사무 처리가 어려운 성년자를 위한 가정법원 후견 절차입니다.",
  [
    {
      id: "guard-condition",
      question: "대상자 일상 사무 처리가 가능한가요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "곤란함", value: "severe", score: 18, tags: ["urgent"] },
        { label: "일부 어려움", value: "mild", score: 10 },
      ],
    },
    {
      id: "guard-property",
      question: "부동산·재산 등기 이슈가 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "있음", value: "yes", score: 16, tags: ["deadline"] },
        { label: "없음", value: "no", score: 5 },
      ],
    },
    {
      id: "guard-family",
      question: "가족 간 협의는?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "원활", value: "ok", score: 5 },
        { label: "갈등", value: "conflict", score: 18, tags: ["dispute", "urgent"] },
      ],
    },
    {
      id: "guard-deadline",
      question: "등기·재산 처분 기한이 있나요?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "있음", value: "yes", score: 16, tags: ["deadline", "urgent"] },
        { label: "없음", value: "no", score: 4 },
      ],
    },
  ],
  [{ href: "/가족후견", label: "가족후견 허브" }],
);

export const specialRepresentativeDiagnosis = simplifiedDiagnosis(
  "special-representative",
  "특별대리인자가진단",
  "특별대리인",
  undefined,
  "소송·분쟁에서 의사결정이 어려운 당사자를 대리하는 가정법원 선임 절차입니다.",
  [
    {
      id: "agent-litigation",
      question: "소송·분쟁이 진행 중이거나 임박했나요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "진행 중", value: "yes", score: 20, tags: ["urgent"] },
        { label: "예정", value: "planned", score: 12 },
      ],
    },
    {
      id: "agent-communication",
      question: "당사자 의사소통은?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "제한적", value: "limited", score: 18, tags: ["urgent"] },
        { label: "가능", value: "ok", score: 6 },
      ],
    },
    {
      id: "agent-deadline",
      question: "소송·신청 기한이 있나요?",
      type: "single",
      weight: 2.5,
      required: true,
      options: [
        { label: "임박", value: "tight", score: 24, tags: ["urgent", "deadline"] },
        { label: "여유", value: "ok", score: 5 },
      ],
    },
    {
      id: "agent-court",
      question: "관할 가정법원을 확인하셨나요?",
      type: "single",
      weight: 1.5,
      required: true,
      options: [
        { label: "확인함", value: "yes", score: 4 },
        { label: "미확인", value: "no", score: 10 },
      ],
    },
  ],
  [{ href: "/민사소송", label: "민사소송 허브" }],
);

export const shipRegistrationDiagnosis = simplifiedDiagnosis(
  "ship-registration",
  "선박등기자가진단",
  "선박등기",
  undefined,
  "어선·요트·상선 등 선박 소유권 이전·저당 등기는 특수 서류와 관할이 필요합니다.",
  [
    {
      id: "ship-type",
      question: "선박 종류는?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "어선", value: "fishing", score: 8 },
        { label: "요트·레저", value: "pleasure", score: 8 },
        { label: "상선", value: "commercial", score: 12 },
      ],
    },
    {
      id: "ship-purpose",
      question: "등기 목적은?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "소유권 이전", value: "transfer", score: 10 },
        { label: "저당", value: "mortgage", score: 12, tags: ["mortgage"] },
      ],
    },
    {
      id: "ship-docs",
      question: "선박국·검사 서류는?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "있음", value: "yes", score: 5 },
        { label: "확인 필요", value: "no", score: 16, tags: ["urgent"] },
      ],
    },
    {
      id: "ship-delivery",
      question: "매매·인도는?",
      type: "single",
      weight: 2,
      required: true,
      options: [
        { label: "완료", value: "done", score: 14, tags: ["deadline"] },
        { label: "예정", value: "planned", score: 8 },
      ],
    },
  ],
  [
    { href: "/부산선박등기", label: "부산 선박등기 허브" },
    { href: "/영도구선박등기", label: "영도구 선박등기" },
  ],
);
