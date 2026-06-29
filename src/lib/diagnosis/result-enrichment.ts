import type { Diagnosis, DiagnosisQuestion } from "@/data/diagnosis";
import type { DiagnosisAnswers, DiagnosisEvaluation } from "@/lib/diagnosis/evaluate";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";

export type DisplayRiskTier = "low" | "caution" | "urgent";

export type DisplayRiskMeta = {
  tier: DisplayRiskTier;
  label: string;
  hint: string;
  badgeClass: string;
  panelClass: string;
};

export type DiagnosisContentCategory =
  | "inheritance"
  | "real-estate"
  | "corporate"
  | "rehab"
  | "jeonse"
  | "civil"
  | "other";

const SLUG_CATEGORY: Record<string, DiagnosisContentCategory> = {
  상속등기자가진단: "inheritance",
  상속포기자가진단: "inheritance",
  한정승인자가진단: "inheritance",
  부동산등기자가진단: "real-estate",
  소유권이전등기자가진단: "real-estate",
  법인등기자가진단: "corporate",
  임원변경등기자가진단: "corporate",
  법인설립자가진단: "corporate",
  개인회생자가진단: "rehab",
  개인파산자가진단: "rehab",
  전세보증금자가진단: "jeonse",
  임차권등기명령자가진단: "jeonse",
  지급명령자가진단: "civil",
  내용증명자가진단: "civil",
};

const IMMEDIATE_CHECKS: Record<DiagnosisContentCategory, string[]> = {
  inheritance: [
    "상속개시일(사망일)과 3개월 기한(포기·한정승인) 여부를 확인해야 합니다.",
    "상속인 범위·등기부상 부동산·금융자산 유무를 정리해야 합니다.",
    "채무·담보가 있는지 조회·확인이 필요할 수 있습니다.",
  ],
  "real-estate": [
    "최신 등기부등본으로 소유자·근저당·가압류를 확인해야 합니다.",
    "계약서·잔금일·특약과 등기 접수 일정이 맞는지 봐야 합니다.",
    "취득세·등기 신청 기한을 놓치지 않았는지 확인이 필요합니다.",
  ],
  corporate: [
    "등기부등본·정관으로 현재 임원·본점·주소를 확인해야 합니다.",
    "변경일로부터 등기 신청 기한·과태료 가능성을 점검해야 합니다.",
    "주주총회·이사회 결의 요건이 갖춰졌는지 검토가 필요합니다.",
  ],
  rehab: [
    "총 채무액·채권자 수·담보 여부를 목록으로 정리해야 합니다.",
    "월 소득·부양가족·재산 가액을 함께 확인해야 합니다.",
    "급여압류·가압류 진행 여부를 확인하는 것이 좋습니다.",
  ],
  jeonse: [
    "전세계약서·확정일자·대항력 요건을 확인해야 합니다.",
    "임대인 등기부·채무·경매 진행 여부를 봐야 합니다.",
    "임차권등기명령·배당요구 기한을 놓치지 않았는지 확인이 필요합니다.",
  ],
  civil: [
    "채권 발생 원인·금액·변제 약정을 서류로 정리해야 합니다.",
    "소멸시효·증거(이체·계약서·카톡)를 함께 확인해야 합니다.",
    "지급명령·내용증명·소송 중 어떤 경로가 맞는지 검토가 필요합니다.",
  ],
  other: [
    "관할 기관·법원과 필요 서류 목록을 먼저 확인해야 합니다.",
    "기한·신고 요건이 있는지 살펴보는 것이 좋습니다.",
    "사실관계를 메모·서류로 남겨 두면 상담이 수월합니다.",
  ],
};

const CATEGORY_DOCUMENTS: Record<DiagnosisContentCategory, string[]> = {
  inheritance: [
    "피상속인 기준 가족관계증명서(상세)·기본증명서",
    "상속인 인감증명서·인감도장",
    "등기부등본·토지대장(부동산 해당 시)",
    "협의분할협의서 또는 유언 관련 서류(해당 시)",
    "채무·담보 확인 자료(한정승인·포기 검토 시)",
  ],
  "real-estate": [
    "매매·증여 등 계약서",
    "등기부등본·토지대장",
    "매도인·매수인 인감증명서·신분증",
    "잔금·취득세 납부 증빙(해당 시)",
    "근저당 말소·승낙 관련 서류(해당 시)",
  ],
  corporate: [
    "법인 등기부등본·정관",
    "주주총회·이사회 의사록",
    "취임·사임 승낙서·인감증명서",
    "본점·주소 관련 임대차·등기필증(해당 시)",
    "법인 인감카드·인감증명서",
  ],
  rehab: [
    "채무 목록·잔액증명서",
    "소득 증빙(급여·사업 소득)",
    "재산 목록·등기부등본(해당 시)",
    "가족관계증명서·주민등록등본",
    "최근 거래내역·압류 관련 서류",
  ],
  jeonse: [
    "전세계약서·확정일자 받은 계약서",
    "보증금 이체·영수 증빙",
    "임대인 신원·등기부등본",
    "내용증명·독촉 기록(해당 시)",
    "전세보증보험 관련 서류(해당 시)",
  ],
  civil: [
    "계약서·차용증·영수증",
    "이체 내역·카카오톡·녹취 등 증거",
    "채무자 주소·신분 확인 자료",
    "내용증명·지급명령 신청서(해당 시)",
    "위임장(대리 신청 시)",
  ],
  other: [
    "신분증·인감증명서",
    "사건 관련 계약서·확인서",
    "등기부등본·법원·기관 발급 서류(해당 시)",
    "상담 시 추가로 요청드리는 서류",
  ],
};

export const DISPLAY_RISK_META: Record<DisplayRiskTier, DisplayRiskMeta> = {
  low: {
    tier: "low",
    label: "낮음",
    hint: "서류를 모은 뒤 방향을 잡기 좋은 단계로 보입니다. 그래도 기한·서류는 한 번 더 확인하는 것이 좋습니다.",
    badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-200/80",
    panelClass: "border-emerald-200/70 bg-gradient-to-br from-white to-emerald-50/40",
  },
  caution: {
    tier: "caution",
    label: "주의",
    hint: "절차·서류·기한을 함께 검토할 필요가 있을 수 있습니다. 단정하기보다 확인이 우선입니다.",
    badgeClass: "bg-amber-50 text-amber-950 border-amber-200/80",
    panelClass: "border-amber-200/70 bg-gradient-to-br from-white to-amber-50/35",
  },
  urgent: {
    tier: "urgent",
    label: "긴급",
    hint: "기한·권리 관계를 빠르게 확인하는 것이 좋을 수 있습니다. 상담·서류 검토를 권합니다.",
    badgeClass: "bg-rose-50 text-rose-950 border-rose-200/80",
    panelClass: "border-rose-200/70 bg-gradient-to-br from-white to-rose-50/35",
  },
};

export function getDiagnosisCategory(slug: string): DiagnosisContentCategory {
  return SLUG_CATEGORY[slug] ?? "other";
}

export function mapToDisplayRisk(
  riskLevel: DiagnosisEvaluation["outcome"]["riskLevel"],
  urgentOverride: boolean,
): DisplayRiskMeta {
  if (urgentOverride || riskLevel === "urgent") {
    return DISPLAY_RISK_META.urgent;
  }
  if (riskLevel === "low") {
    return DISPLAY_RISK_META.low;
  }
  return DISPLAY_RISK_META.caution;
}

function shortenQuestion(text: string): string {
  return text.length > 42 ? `${text.slice(0, 40)}…` : text;
}

function formatAnswerLabel(
  question: DiagnosisQuestion,
  raw: string | string[],
): string | null {
  if (Array.isArray(raw)) {
    if (raw.length === 0) return null;
    const labels = raw
      .map((value) => question.options?.find((o) => o.value === value)?.label ?? value)
      .join(", ");
    return `${shortenQuestion(question.question)}: ${labels}`;
  }

  if (question.type === "single" && question.options) {
    const option = question.options.find((o) => o.value === raw);
    return option
      ? `${shortenQuestion(question.question)}: ${option.label}`
      : null;
  }

  if (question.type === "date" && raw) {
    return `${shortenQuestion(question.question)}: ${raw}`;
  }

  if (question.type === "number" && raw) {
    return `${shortenQuestion(question.question)}: ${raw}`;
  }

  if (question.type === "text" && raw.trim()) {
    return `${shortenQuestion(question.question)}: 입력함`;
  }

  return null;
}

export function getAnswerHighlights(
  diagnosis: Diagnosis,
  answers: DiagnosisAnswers,
): string[] {
  return diagnosis.questions
    .map((question) => {
      const raw = answers[question.id];
      if (raw === undefined || raw === "" || (Array.isArray(raw) && raw.length === 0)) {
        return null;
      }
      return formatAnswerLabel(question, raw);
    })
    .filter((item): item is string => Boolean(item));
}

export function buildSituationSummary(
  diagnosis: Diagnosis,
  answers: DiagnosisAnswers,
  evaluation: DiagnosisEvaluation,
): { narrative: string; highlights: string[] } {
  const highlights = getAnswerHighlights(diagnosis, answers);
  const risk = mapToDisplayRisk(evaluation.outcome.riskLevel, evaluation.urgentOverride);

  const highlightSentence =
    highlights.length > 0
      ? `입력하신 내용(${highlights.slice(0, 3).join(" / ")}${highlights.length > 3 ? " 등" : ""})을 바탕으로 보면, `
      : "입력하신 답변을 바탕으로 보면, ";

  const narrative = [
    `${highlightSentence}${evaluation.outcome.summary}`,
    `현재 위험도는「${risk.label}」단계로 보이며, ${risk.hint}`,
    "아래는 일반적인 안내이며, 가능·불가능을 단정하지 않습니다. 사실관계·서류 확인 후 방향을 잡는 것이 안전합니다.",
  ].join(" ");

  return { narrative, highlights };
}

export function getImmediateChecks(
  diagnosis: Diagnosis,
  evaluation: DiagnosisEvaluation,
): string[] {
  const category = getDiagnosisCategory(diagnosis.slug);
  const base = IMMEDIATE_CHECKS[category];
  const fromEvaluation = [
    ...evaluation.recommendations,
    ...evaluation.optionWarnings.slice(0, 2),
    ...evaluation.tagWarnings.slice(0, 1),
    ...evaluation.outcome.nextSteps.slice(0, 2),
  ];

  return [...new Set([...base, ...fromEvaluation])].slice(0, 8);
}

export function getResultDocuments(
  diagnosis: Diagnosis,
  evaluation: DiagnosisEvaluation,
): string[] {
  const category = getDiagnosisCategory(diagnosis.slug);
  const merged = [
    ...evaluation.outcome.documents,
    ...diagnosis.requiredDocuments,
    ...CATEGORY_DOCUMENTS[category],
  ];

  return [...new Set(merged)].slice(0, 10);
}

export function buildResultSeoMeta(
  diagnosis: Diagnosis,
  evaluation: DiagnosisEvaluation,
): { title: string; description: string } {
  const risk = mapToDisplayRisk(evaluation.outcome.riskLevel, evaluation.urgentOverride);
  const title = buildMetaTitle(
    `${diagnosis.serviceName} 자가진단 결과 — ${risk.label}`,
  );
  const description = buildMetaDescription(
    `${diagnosis.serviceName} 자가진단 결과입니다. 위험도 ${risk.label} — ${evaluation.outcome.title}. 서류·기한·절차는 사건별로 달라 추가 확인이 필요할 수 있습니다. 부산·해운대·센텀 법무사 상담.`,
  );

  return { title, description };
}

export function buildResultWebPageJsonLd(
  diagnosis: Diagnosis,
  evaluation: DiagnosisEvaluation,
  pageUrl: string,
) {
  const { description } = buildResultSeoMeta(diagnosis, evaluation);
  const risk = mapToDisplayRisk(evaluation.outcome.riskLevel, evaluation.urgentOverride);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${diagnosis.serviceName} 자가진단 결과 — ${risk.label}`,
    description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "다옴법무사사무소",
    },
    about: {
      "@type": "Service",
      name: diagnosis.serviceName,
      areaServed: "부산광역시",
    },
  };
}
