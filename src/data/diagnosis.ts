import type { PageFaqItem, PageRelatedLink } from "@/lib/pageData/types";
export {
  DIAGNOSIS_CTA_TEXT,
  DIAGNOSIS_CTA_TITLE,
  DIAGNOSIS_SEO_KEYWORDS,
} from "./diagnosis-constants";
import {
  DIAGNOSIS_CTA_TEXT,
  DIAGNOSIS_CTA_TITLE,
  DIAGNOSIS_SEO_KEYWORDS,
} from "./diagnosis-constants";

export type QuestionType = "single" | "multiple" | "number" | "date" | "text";

export type DiagnosisOption = {
  label: string;
  value: string;
  score: number;
  tags?: string[];
  warning?: string;
  nextRecommendation?: string;
};

export type DiagnosisQuestion = {
  id: string;
  question: string;
  description?: string;
  type: QuestionType;
  options?: DiagnosisOption[];
  weight: number;
  required: boolean;
};

export type DiagnosisOutcome = {
  id: string;
  minScore: number;
  maxScore: number;
  title: string;
  summary: string;
  riskLevel: "low" | "medium" | "high" | "urgent";
  recommendedService?: string;
  documents: string[];
  nextSteps: string[];
  caution?: string;
  ctaMessage?: string;
};

export type DiagnosisCaseExample = {
  title: string;
  body: string;
};

export type Diagnosis = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  serviceName: string;
  serviceSlug?: string;
  primaryKeywords: string[];
  intro: string[];
  resultExplanation?: string[];
  conceptParagraphs?: string[];
  busanConsultationTypes?: string[];
  targetUsers: string[];
  questions: DiagnosisQuestion[];
  outcomes: DiagnosisOutcome[];
  requiredDocuments: string[];
  processSteps: string[];
  costFactors: string[];
  deadlineWarnings: string[];
  caseExample: DiagnosisCaseExample;
  faqs: PageFaqItem[];
  relatedLinks: PageRelatedLink[];
  ctaTitle: string;
  ctaText: string;
  isHub?: boolean;
};

/** @deprecated Diagnosis 사용 */
export type Question = DiagnosisQuestion;
/** @deprecated DiagnosisOption 사용 */
export type Option = DiagnosisOption;
/** @deprecated DiagnosisOutcome 사용 */
export type Outcome = DiagnosisOutcome;

export type DiagnosisPageConfig = Diagnosis & {
  path: string;
  topicName: string;
  introParagraphs: string[];
  whoNeedsThis: string[];
  documents: string[];
  procedures: string[];
  deadlinesAndPenalties: string[];
  consultationExample: DiagnosisCaseExample;
  results: DiagnosisOutcome[];
};

export function diagnosisPath(slug: string): string {
  return `/${slug}`;
}

export function toPageConfig(diagnosis: Diagnosis): DiagnosisPageConfig {
  return {
    ...diagnosis,
    path: diagnosisPath(diagnosis.slug),
    topicName: diagnosis.serviceName,
    introParagraphs: diagnosis.intro,
    whoNeedsThis: diagnosis.targetUsers,
    documents: diagnosis.requiredDocuments,
    procedures: diagnosis.processSteps,
    deadlinesAndPenalties: diagnosis.deadlineWarnings,
    consultationExample: diagnosis.caseExample,
    results: diagnosis.outcomes,
  };
}

export {
  createStandardOutcomes,
  seoIntroParagraphs,
  standardFaqs,
  standardRelatedLinks,
} from "./diagnosis-helpers";

export const diagnosisHub: Diagnosis = {
  id: "diagnosis-hub",
  slug: "자가진단",
  isHub: true,
  title: "부산 업무별 자가진단",
  metaTitle: "부산 업무별 자가진단 | 해운대·센텀 법무사",
  metaDescription:
    "상속등기·법인등기·부동산등기·개인회생·전세보증금 등 업무별 자가진단. 절차·필요서류·비용·기한을 확인하세요.",
  h1: "부산 법무사 업무별 자가진단",
  serviceName: "업무별 자가진단",
  primaryKeywords: [...DIAGNOSIS_SEO_KEYWORDS, "자가진단", "법무사 상담"],
  intro: [
    "등기·가사·채무·임대차 문제는 검색만 하다 보면 절차와 기한을 놓치기 쉽습니다. 다옴법무사사무소는 부산·해운대·센텀·재송동·반여동 의뢰인분들이 자주 묻는 질문을 모아 자가진단을 만들었습니다.",
    "각 진단은 질문에 답하면 점수와 태그를 바탕으로 검토 필요·상담 권장·긴급 확인 필요 방향을 안내합니다. 결과는 가능/불가능을 단정하지 않습니다.",
    "아래에서 해당 업무를 선택해 진단을 시작하세요.",
  ],
  targetUsers: [],
  questions: [],
  outcomes: [],
  requiredDocuments: [],
  processSteps: [],
  costFactors: [],
  deadlineWarnings: [],
  caseExample: {
    title: "부산 자가진단 후 상담 예시",
    body: "해운대 상속인 A씨는 자가진단에서 기한 확인이 필요하다는 결과를 받고 가족관계증명서와 등기부를 보내 주셨습니다. 한정승인 검토 후 상속등기 순서로 안내드렸습니다.",
  },
  faqs: [
    {
      question: "자가진단만으로 법적 효력이 생기나요?",
      answer: "아닙니다. 참고용이며 최종 절차는 서류·사실관계 확인 후 결정합니다.",
    },
    {
      question: "어떤 업무부터 진단하면 좋나요?",
      answer: "가장 급한 기한이 있는 업무부터 선택하시는 것을 권합니다.",
    },
    {
      question: "부산 외 지역도 상담 가능한가요?",
      answer: "원격 진행이 가능한 사건이 많으며, 부산 관할 사건도 카카오톡·우편으로 진행할 수 있습니다.",
    },
  ],
  relatedLinks: [
    { href: "/상속등기자가진단", label: "상속등기 자가진단" },
    { href: "/상속포기자가진단", label: "상속포기 자가진단" },
    { href: "/법인등기자가진단", label: "법인등기 자가진단" },
    { href: "/부동산등기자가진단", label: "부동산등기 자가진단" },
    { href: "/개인회생자가진단", label: "개인회생 자가진단" },
    { href: "/services", label: "업무안내 전체" },
    { href: "/faq", label: "자주 묻는 질문" },
    { href: "/contact", label: "법무사 상담 문의" },
  ],
  ctaTitle: DIAGNOSIS_CTA_TITLE,
  ctaText: DIAGNOSIS_CTA_TEXT,
};
