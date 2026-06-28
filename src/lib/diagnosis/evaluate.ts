import type { Diagnosis, Outcome, Question } from "@/data/diagnosis";

export type DiagnosisAnswers = Record<string, string | string[]>;

export type DiagnosisEvaluation = {
  totalScore: number;
  outcome: Outcome;
  urgentOverride: boolean;
  tagWarnings: string[];
  optionWarnings: string[];
  recommendations: string[];
};

const TAG_WARNINGS: Record<string, string> = {
  urgent:
    "답변에 긴급 확인이 필요한 요소가 포함되어 있습니다. 기한·권리 관계를 먼저 점검하는 것이 좋습니다.",
  deadline:
    "법정 기한과 관련된 답변이 있습니다. 지연 시 과태료·권리 상실 리스크가 커질 수 있습니다.",
  debt:
    "채무 관련 답변이 있습니다. 상속포기·한정승인·채무조회 등 선행 검토가 필요할 수 있습니다.",
  minor:
    "미성년 상속인이 있는 경우 공증·가정법원 절차가 추가될 수 있습니다.",
  overseas:
    "해외 거주 상속인이 있으면 위임·공증·송달 절차가 달라질 수 있습니다.",
  mortgage:
    "근저당·가압류 등 선순위 권리가 있으면 말소·승낙 절차를 함께 검토해야 합니다.",
  penalty:
    "등기·신고 기한 경과 가능성이 있어 과태료·보정 여부를 확인해야 합니다.",
  dispute:
    "분쟁 가능성이 있는 답변입니다. 내용증명·증거 정리 후 절차를 선택하는 것이 좋습니다.",
  statute:
    "소멸시효·제척기간과 관련될 수 있습니다. 시기를 서류로 확인하는 것이 좋습니다.",
  seizure:
    "압류·추심 진행 중이면 신속한 절차 검토가 필요할 수 있습니다.",
};

function monthsSince(dateValue: string): number | null {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;
  const now = new Date();
  return (
    (now.getFullYear() - parsed.getFullYear()) * 12 +
    (now.getMonth() - parsed.getMonth())
  );
}

function scoreDateAnswer(question: Question, value: string) {
  const months = monthsSince(value);
  if (months === null) {
    return { score: 5, tags: [] as string[], warning: undefined, recommendation: undefined };
  }

  if (question.id.includes("death") || question.id.includes("사망")) {
    if (months >= 3) {
      return {
        score: 35,
        tags: ["urgent", "deadline"],
        warning:
          "상속 개시 후 3개월이 경과했거나 임박했습니다. 상속포기·한정승인·등기 순서를 즉시 검토해야 합니다.",
        recommendation: "가족관계증명서·채무 여부를 먼저 확인하고 상담을 권합니다.",
      };
    }
    if (months >= 2) {
      return {
        score: 22,
        tags: ["deadline"],
        warning: "상속 관련 3개월 기한이 가까워지고 있습니다.",
        recommendation: "필요 서류를 모으고 절차 우선순위를 정하세요.",
      };
    }
    return { score: 8, tags: [] as string[], warning: undefined, recommendation: undefined };
  }

  if (question.id.includes("change") || question.id.includes("변경")) {
    const days = Math.floor(
      (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (days > 14) {
      return {
        score: 30,
        tags: ["urgent", "penalty"],
        warning: "변경일로부터 2주가 경과했을 수 있어 과태료·보정을 검토해야 합니다.",
        recommendation: "등기부·정관·결의서를 함께 확인하세요.",
      };
    }
    if (days > 10) {
      return {
        score: 18,
        tags: ["penalty"],
        warning: "등기 신청 기한이 임박했을 수 있습니다.",
        recommendation: undefined,
      };
    }
    return { score: 6, tags: [] as string[], warning: undefined, recommendation: undefined };
  }

  if (question.id.includes("balance") || question.id.includes("잔금")) {
    const days = Math.floor(
      (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (days > 60) {
      return {
        score: 20,
        tags: ["deadline"],
        warning: "잔금 후 등기가 지연되면 분쟁·담보책임 이슈가 생길 수 있습니다.",
        recommendation: "취득세·등기 접수 일정을 확인하세요.",
      };
    }
    return { score: 5, tags: [] as string[], warning: undefined, recommendation: undefined };
  }

  return { score: 5, tags: [] as string[], warning: undefined, recommendation: undefined };
}

function scoreNumberAnswer(question: Question, value: string) {
  const amount = Number(value.replace(/,/g, ""));
  if (Number.isNaN(amount)) {
    return { score: 3, tags: [] as string[], warning: undefined, recommendation: undefined };
  }

  if (question.id.includes("debt") || question.id.includes("채무")) {
    if (amount >= 100_000_000) {
      return {
        score: 28,
        tags: ["debt", "urgent"],
        warning: "채무 규모가 커서 상속·회생·파산 절차를 신중히 비교해야 합니다.",
        recommendation: "채무 목록·재산 목록을 먼저 정리하세요.",
      };
    }
    if (amount >= 30_000_000) {
      return {
        score: 16,
        tags: ["debt"],
        warning: "채무 규모에 따라 한정승인·회생 등 검토가 필요할 수 있습니다.",
        recommendation: undefined,
      };
    }
    return { score: 6, tags: [] as string[], warning: undefined, recommendation: undefined };
  }

  if (question.id.includes("income") || question.id.includes("소득")) {
    if (amount < 2_000_000) {
      return {
        score: 18,
        tags: ["debt"],
        warning: "소득 대비 채무 부담 검토가 필요할 수 있습니다.",
        recommendation: "개인회생·파산 요건을 함께 확인하세요.",
      };
    }
    return { score: 5, tags: [] as string[], warning: undefined, recommendation: undefined };
  }

  if (question.id.includes("heirs") || question.id.includes("상속인")) {
    if (amount >= 4) {
      return {
        score: 15,
        tags: ["dispute"],
        warning: "상속인이 많으면 협의분할·공증·송달 절차가 복잡해질 수 있습니다.",
        recommendation: "상속재산분할협의서 작성 여부를 확인하세요.",
      };
    }
    if (amount >= 2) {
      return { score: 8, tags: [] as string[], warning: undefined, recommendation: undefined };
    }
    return { score: 3, tags: [] as string[], warning: undefined, recommendation: undefined };
  }

  return { score: 4, tags: [] as string[], warning: undefined, recommendation: undefined };
}

function scoreTextAnswer(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { score: 0, tags: [] as string[], warning: undefined, recommendation: undefined };
  return { score: 3, tags: [] as string[], warning: undefined, recommendation: undefined };
}

function pickOutcome(diagnosis: Diagnosis, totalScore: number, urgent: boolean): Outcome {
  if (urgent) {
    const urgentOutcome = diagnosis.outcomes.find((item) => item.riskLevel === "urgent");
    if (urgentOutcome) return urgentOutcome;
  }

  const matched =
    diagnosis.outcomes.find(
      (item) => totalScore >= item.minScore && totalScore <= item.maxScore,
    ) ?? diagnosis.outcomes[diagnosis.outcomes.length - 1];

  return matched ?? diagnosis.outcomes[0]!;
}

export function evaluateDiagnosis(
  diagnosis: Diagnosis,
  answers: DiagnosisAnswers,
): DiagnosisEvaluation {
  let totalScore = 0;
  const collectedTags = new Set<string>();
  const optionWarnings: string[] = [];
  const recommendations: string[] = [];
  let urgentOverride = false;

  for (const question of diagnosis.questions) {
    const raw = answers[question.id];
    if (raw === undefined || raw === "" || (Array.isArray(raw) && raw.length === 0)) {
      continue;
    }

    if (question.type === "single" && question.options) {
      const value = String(raw);
      const option = question.options.find((item) => item.value === value);
      if (!option) continue;
      totalScore += option.score * question.weight;
      option.tags?.forEach((tag) => collectedTags.add(tag));
      if (option.tags?.includes("urgent")) urgentOverride = true;
      if (option.warning) optionWarnings.push(option.warning);
      if (option.nextRecommendation) recommendations.push(option.nextRecommendation);
      continue;
    }

    if (question.type === "multiple" && question.options && Array.isArray(raw)) {
      for (const value of raw) {
        const option = question.options.find((item) => item.value === value);
        if (!option) continue;
        totalScore += option.score * question.weight;
        option.tags?.forEach((tag) => collectedTags.add(tag));
        if (option.tags?.includes("urgent")) urgentOverride = true;
        if (option.warning) optionWarnings.push(option.warning);
        if (option.nextRecommendation) recommendations.push(option.nextRecommendation);
      }
      continue;
    }

    if (question.type === "date" && typeof raw === "string") {
      const scored = scoreDateAnswer(question, raw);
      totalScore += scored.score * question.weight;
      scored.tags.forEach((tag) => collectedTags.add(tag));
      if (scored.tags.includes("urgent")) urgentOverride = true;
      if (scored.warning) optionWarnings.push(scored.warning);
      if (scored.recommendation) recommendations.push(scored.recommendation);
      continue;
    }

    if (question.type === "number" && typeof raw === "string") {
      const scored = scoreNumberAnswer(question, raw);
      totalScore += scored.score * question.weight;
      scored.tags.forEach((tag) => collectedTags.add(tag));
      if (scored.tags.includes("urgent")) urgentOverride = true;
      if (scored.warning) optionWarnings.push(scored.warning);
      if (scored.recommendation) recommendations.push(scored.recommendation);
      continue;
    }

    if (question.type === "text" && typeof raw === "string") {
      const scored = scoreTextAnswer(raw);
      totalScore += scored.score * question.weight;
    }
  }

  const tagWarnings = [...collectedTags]
    .filter((tag) => TAG_WARNINGS[tag])
    .map((tag) => TAG_WARNINGS[tag]!);

  const outcome = pickOutcome(diagnosis, totalScore, urgentOverride);

  return {
    totalScore,
    outcome,
    urgentOverride,
    tagWarnings: [...new Set(tagWarnings)],
    optionWarnings: [...new Set(optionWarnings)],
    recommendations: [...new Set(recommendations)],
  };
}

/** @deprecated evaluateDiagnosis 사용 */
export function resolveDiagnosisResult(
  diagnosis: Diagnosis,
  answers: DiagnosisAnswers,
) {
  const evaluation = evaluateDiagnosis(diagnosis, answers);
  return {
    evaluation,
    legacy: {
      id: evaluation.outcome.id,
      title: evaluation.outcome.title,
      summary: evaluation.outcome.summary,
      urgency:
        evaluation.outcome.riskLevel === "urgent" || evaluation.outcome.riskLevel === "high"
          ? ("high" as const)
          : evaluation.outcome.riskLevel === "medium"
            ? ("medium" as const)
            : ("low" as const),
      recommendedSteps: evaluation.outcome.nextSteps,
      consultationRecommended: evaluation.outcome.riskLevel !== "low",
      consultationReason: evaluation.outcome.caution,
    },
  };
}
