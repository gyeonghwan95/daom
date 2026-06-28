"use client";

import type { ReactNode } from "react";
import { DiagnosisCTA } from "@/components/diagnosis/DiagnosisCTA";
import { DiagnosisRelatedLinks } from "@/components/diagnosis/DiagnosisRelatedLinks";
import { RISK_LEVEL_META } from "@/components/diagnosis/constants";
import type { Diagnosis } from "@/data/diagnosis";
import type { DiagnosisEvaluation } from "@/lib/diagnosis/evaluate";
import { getDiagnosisResultLinks } from "@/lib/diagnosis/result-links";

type DiagnosisResultProps = {
  diagnosis: Diagnosis;
  evaluation: DiagnosisEvaluation;
  onReset: () => void;
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

export function DiagnosisResult({
  diagnosis,
  evaluation,
  onReset,
}: DiagnosisResultProps) {
  const risk = RISK_LEVEL_META[evaluation.outcome.riskLevel];
  const warnings = [...evaluation.optionWarnings, ...evaluation.tagWarnings];

  return (
    <div
      className="diagnosis-result space-y-7"
      role="region"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="diagnosis-result-heading"
    >
      <div className={`diagnosis-result__risk ${risk.borderClass}`}>
        <div className="flex flex-wrap items-start gap-3">
          <span className="diagnosis-result__risk-symbol" aria-hidden>
            {risk.symbol}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-navy/50">
              Risk Level
            </p>
            <p className="mt-1 text-base font-bold text-navy sm:text-lg">
              <span className="sr-only">위험도: </span>
              {risk.label}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-navy/70">{risk.hint}</p>
          </div>
          {evaluation.urgentOverride ? (
            <span className="rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-900">
              <span aria-hidden>!</span> 긴급 확인 요소 포함
            </span>
          ) : null}
        </div>
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
          <p className="text-sm font-semibold text-navy">주의사항</p>
          <p className="mt-1.5 text-sm leading-relaxed text-navy/80">
            {evaluation.outcome.caution}
          </p>
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <ResultSection id="diagnosis-extra-warnings" title="추가 확인이 필요한 사항">
          <ul className="space-y-2">
            {warnings.map((item) => (
              <li key={item} className="diagnosis-result__list-item">
                {item}
              </li>
            ))}
          </ul>
        </ResultSection>
      ) : null}

      {evaluation.recommendations.length > 0 ? (
        <ResultSection id="diagnosis-recommendations" title="권장 확인 사항">
          <ul className="space-y-2">
            {evaluation.recommendations.map((item) => (
              <li key={item} className="diagnosis-result__list-item diagnosis-result__list-item--light">
                {item}
              </li>
            ))}
          </ul>
        </ResultSection>
      ) : null}

      {evaluation.outcome.documents.length > 0 ? (
        <ResultSection id="diagnosis-documents" title="우선 준비 서류">
          <ul className="diagnosis-result__doc-list">
            {evaluation.outcome.documents.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        </ResultSection>
      ) : null}

      <ResultSection id="diagnosis-next-steps" title="다음 절차">
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

      <p className="diagnosis-result__cta-message">
        {evaluation.outcome.ctaMessage ?? diagnosis.ctaText}
      </p>

      <DiagnosisRelatedLinks
        links={getDiagnosisResultLinks(diagnosis)}
        title="관련 안내"
      />

      <DiagnosisCTA
        title={diagnosis.ctaTitle}
        description="아래 채널로 연락 주시면 서류와 사실관계를 함께 검토해 드립니다."
        pageSlug={diagnosis.slug}
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
