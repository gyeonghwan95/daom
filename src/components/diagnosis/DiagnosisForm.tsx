"use client";

import { useMemo, useState } from "react";
import type { Diagnosis } from "@/data/diagnosis";
import { DiagnosisProgress } from "@/components/diagnosis/DiagnosisProgress";
import { DiagnosisQuestion } from "@/components/diagnosis/DiagnosisQuestion";
import { DiagnosisResult } from "@/components/diagnosis/DiagnosisResult";
import { isQuestionAnswered } from "@/components/diagnosis/constants";
import { evaluateDiagnosis } from "@/lib/diagnosis/evaluate";

import type { DiagnosisRecommendationGroups } from "@/lib/diagnosis/result-recommendations";

type DiagnosisFormProps = {
  diagnosis: Diagnosis;
  onPhaseChange?: (phase: "questions" | "result") => void;
  recommendationGroups: DiagnosisRecommendationGroups;
};

export function DiagnosisForm({
  diagnosis,
  onPhaseChange,
  recommendationGroups,
}: DiagnosisFormProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [finished, setFinished] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  const questions = diagnosis.questions;
  const currentQuestion = questions[step];

  const evaluation = useMemo(() => {
    if (!finished) return null;
    return evaluateDiagnosis(diagnosis, answers);
  }, [answers, diagnosis, finished]);

  if (questions.length === 0) {
    return null;
  }

  const currentValue = currentQuestion ? answers[currentQuestion.id] : undefined;
  const canProceed =
    currentQuestion &&
    (!currentQuestion.required ||
      isQuestionAnswered(answers[currentQuestion.id]));

  function finishDiagnosis() {
    setFinished(true);
    onPhaseChange?.("result");
  }

  function handleNext() {
    if (!canProceed) {
      setValidationError("필수 항목에 답해 주세요. 선택 또는 입력 후 다음으로 이동할 수 있습니다.");
      return;
    }
    setValidationError(undefined);
    if (step >= questions.length - 1) {
      finishDiagnosis();
      return;
    }
    setStep((value) => value + 1);
  }

  function handlePrevious() {
    setValidationError(undefined);
    setStep((value) => Math.max(0, value - 1));
  }

  function setSingleAnswer(questionId: string, value: string) {
    setValidationError(undefined);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleMultiple(questionId: string, value: string) {
    setValidationError(undefined);
    setAnswers((prev) => {
      const current = prev[questionId];
      const list = Array.isArray(current) ? current : [];
      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [questionId]: next };
    });
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setFinished(false);
    setValidationError(undefined);
    onPhaseChange?.("questions");
  }

  return (
    <div className="diagnosis-wizard overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_8px_40px_rgba(26,39,68,0.07)]">
      <DiagnosisProgress step={step} total={questions.length} finished={finished} />

      <div className="diagnosis-wizard__body px-4 py-6 sm:px-7 sm:py-8 md:px-8 md:py-10">
        {!finished && currentQuestion ? (
          <div>
            <DiagnosisQuestion
              question={currentQuestion}
              stepIndex={step}
              value={currentValue}
              onSingleChange={(value) => setSingleAnswer(currentQuestion.id, value)}
              onMultipleToggle={(value) => toggleMultiple(currentQuestion.id, value)}
              validationError={validationError}
            />

            <nav
              className="diagnosis-wizard__nav mt-8 flex flex-wrap gap-3 border-t border-beige-dark/80 pt-6"
              aria-label="진단 질문 이동"
            >
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="diagnosis-wizard__btn diagnosis-wizard__btn--secondary"
                >
                  이전
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleNext}
                className="diagnosis-wizard__btn diagnosis-wizard__btn--primary"
              >
                {step >= questions.length - 1 ? "결과 보기" : "다음"}
              </button>
            </nav>
          </div>
        ) : null}

        {finished && evaluation ? (
          <DiagnosisResult
            diagnosis={diagnosis}
            evaluation={evaluation}
            answers={answers}
            onReset={reset}
            recommendationGroups={recommendationGroups}
          />
        ) : null}
      </div>
    </div>
  );
}
