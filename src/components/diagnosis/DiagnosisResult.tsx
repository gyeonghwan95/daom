"use client";

import type { ReactNode } from "react";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { DiagnosisResultRecommendations } from "@/components/diagnosis/DiagnosisResultRecommendations";
import { DiagnosisResultSeo } from "@/components/diagnosis/DiagnosisResultSeo";
import type { Diagnosis } from "@/data/diagnosis";
import type { DiagnosisAnswers, DiagnosisEvaluation } from "@/lib/diagnosis/evaluate";
import {
  buildSituationSummary,
  getImmediateChecks,
  getResultDocuments,
  mapToDisplayRisk,
} from "@/lib/diagnosis/result-enrichment";
import type { DiagnosisRecommendationGroups } from "@/lib/diagnosis/result-recommendations";

type DiagnosisResultProps = {
  diagnosis: Diagnosis;
  evaluation: DiagnosisEvaluation;
  answers: DiagnosisAnswers;
  onReset: () => void;
  recommendationGroups: DiagnosisRecommendationGroups;
};

function ResultSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="diagnosis-result__section" aria-labelledby={id}>
      <h4 id={id} className="diagnosis-result__section-title">
        {title}
      </h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-beige-dark bg-white px-4 py-3.5 text-sm leading-relaxed text-navy/80"
        >
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-navy/15 text-[0.6rem] font-bold text-navy/45"
            aria-hidden
          >
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DiagnosisResult({
  diagnosis,
  evaluation,
  answers,
  onReset,
  recommendationGroups,
}: DiagnosisResultProps) {
  const risk = mapToDisplayRisk(
    evaluation.outcome.riskLevel,
    evaluation.urgentOverride,
  );
  const summary = buildSituationSummary(diagnosis, answers, evaluation);
  const immediateChecks = getImmediateChecks(diagnosis, evaluation);
  const documents = getResultDocuments(diagnosis, evaluation);

  return (
    <div
      className="diagnosis-result space-y-7"
      role="region"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="diagnosis-result-heading"
    >
      <DiagnosisResultSeo diagnosis={diagnosis} evaluation={evaluation} />

      <ResultSection id="diagnosis-situation-summary" title="현재 상황 요약">
        <div className="rounded-2xl border border-beige-dark bg-cream/50 px-5 py-4 sm:px-6">
          <p className="text-sm leading-relaxed text-navy/80 sm:text-base">
            {summary.narrative}
          </p>
          {summary.highlights.length > 0 ? (
            <ul className="mt-4 space-y-2 border-t border-beige-dark/80 pt-4">
              {summary.highlights.map((item) => (
                <li key={item} className="text-sm text-navy/65">
                  · {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </ResultSection>

      <div className={`diagnosis-result__risk rounded-2xl border p-5 sm:p-6 ${risk.panelClass}`}>
        <div className="flex flex-wrap items-start gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${risk.badgeClass}`}
          >
            위험도: {risk.label}
          </span>
          {evaluation.urgentOverride ? (
            <span className="rounded-full border border-rose-200/80 bg-rose-50/80 px-3 py-1 text-xs font-semibold text-rose-900">
              추가로 빠른 확인이 필요할 수 있는 요소가 있습니다
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-navy/75">{risk.hint}</p>
        <p className="mt-2 text-xs leading-relaxed text-navy/55">
          법률적 결론이 아닌 참고 안내이며, 사실관계·서류에 따라 달라질 수 있습니다.
        </p>
      </div>

      <div className="diagnosis-result__hero">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-navy-light">
          Diagnosis Result
        </p>
        <h3 id="diagnosis-result-heading" className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
          {evaluation.outcome.title}
        </h3>
        <p className="body-text mt-4 text-base leading-relaxed sm:text-lg">
          {evaluation.outcome.summary}
        </p>
      </div>

      {evaluation.outcome.caution ? (
        <div className="diagnosis-result__caution" role="note">
          <p className="text-sm font-semibold text-navy">참고 사항</p>
          <p className="mt-1.5 text-sm leading-relaxed text-navy/80">
            {evaluation.outcome.caution}
          </p>
        </div>
      ) : null}

      <ResultSection id="diagnosis-immediate-checks" title="지금 바로 확인할 것">
        <Checklist items={immediateChecks} />
      </ResultSection>

      <ResultSection id="diagnosis-documents" title="준비 서류">
        <p className="mb-3 text-sm text-navy/60">
          업무·상황에 따라 추가 서류가 필요할 수 있습니다. 아래는 우선 확인하면 좋은
          항목입니다.
        </p>
        <ul className="diagnosis-result__doc-list">
          {documents.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </ResultSection>

      <ResultSection id="diagnosis-next-steps" title="예상 절차">
        <ol className="space-y-2">
          {evaluation.outcome.nextSteps.map((item, index) => (
            <li key={item} className="diagnosis-result__step">
              <span className="diagnosis-result__step-num" aria-hidden>
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </ResultSection>

      <DiagnosisResultRecommendations groups={recommendationGroups} />

      <p className="diagnosis-result__cta-message">
        {evaluation.outcome.ctaMessage ?? diagnosis.ctaText}
      </p>

      <PageConversionCTA
        pageType="diagnosis-result"
        variant="bottom"
        pageSlug={diagnosis.slug}
        showSecondaryLinks
      />

      <button
        type="button"
        onClick={onReset}
        className="diagnosis-wizard__btn diagnosis-wizard__btn--secondary w-full sm:w-auto"
      >
        새로 진단하기
      </button>
    </div>
  );
}
