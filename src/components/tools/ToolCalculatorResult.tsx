"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { RelatedRecommendationsDisplay } from "@/components/internal-links/RelatedRecommendationsDisplay";
import type { RecommendationGroups } from "@/lib/internal-links";
import type { ToolCalculatorResult as Result, ToolDefinition } from "@/lib/tools";
import { ToolDisclaimer } from "./ToolDisclaimer";

type ToolCalculatorResultProps = {
  tool: ToolDefinition;
  result: Result;
  onReset: () => void;
  recommendationGroups: RecommendationGroups;
};

const urgencyLabel: Record<Result["urgency"], string> = {
  low: "낮음",
  caution: "주의",
  urgent: "긴급",
};

const urgencyClass: Record<Result["urgency"], string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  caution: "border-amber-200 bg-amber-50 text-amber-900",
  urgent: "border-rose-200 bg-rose-50 text-rose-900",
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
      <h3 id={id} className="diagnosis-result__section-title">
        {title}
      </h3>
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

function LinkGrid({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="interactive-surface card-surface flex min-h-11 items-center px-4 py-3 text-sm font-semibold text-navy hover:bg-beige/40"
          >
            {link.label} →
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ToolCalculatorResultView({
  tool,
  result,
  onReset,
  recommendationGroups,
}: ToolCalculatorResultProps) {
  const actions = result.actions.length > 0 ? result.actions : tool.defaultActions;
  const documents =
    result.details.length > 0 && tool.calculatorType === "real-estate-documents"
      ? result.details
      : tool.documents;

  return (
    <div className="diagnosis-result space-y-6">
      <div className="diagnosis-result__hero rounded-2xl border border-navy/10 bg-gradient-to-br from-cream via-white to-beige/40 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
            계산 결과
          </p>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${urgencyClass[result.urgency]}`}
          >
            검토 우선도: {urgencyLabel[result.urgency]}
          </span>
        </div>
        <p className="mt-4 text-base leading-relaxed text-navy/90 sm:text-lg">
          {result.summary}
        </p>
        {result.details.length > 0 && tool.calculatorType !== "real-estate-documents" ? (
          <ul className="mt-4 space-y-2">
            {result.details.map((detail) => (
              <li
                key={detail}
                className="rounded-lg border border-beige-dark bg-white/80 px-3.5 py-2.5 text-sm text-navy/75"
              >
                {detail}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <ToolDisclaimer />

      {result.timeline && result.timeline.length > 0 ? (
        <ResultSection id="tool-timeline" title="참고 일정">
          <ol className="space-y-2.5">
            {result.timeline.map((item) => (
              <li
                key={`${item.label}-${item.date ?? ""}`}
                className="flex flex-col gap-1 rounded-xl border border-beige-dark bg-cream/60 px-4 py-3.5 text-sm text-navy/80 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-navy">{item.label}</span>
                <span className="text-navy/70">
                  {item.date}
                  {item.note ? ` — ${item.note}` : ""}
                </span>
              </li>
            ))}
          </ol>
        </ResultSection>
      ) : null}

      <ResultSection id="tool-actions" title="지금 필요한 조치">
        <Checklist items={actions} />
      </ResultSection>

      <ResultSection id="tool-documents" title="준비서류">
        <Checklist items={documents} />
      </ResultSection>

      <PageConversionCTA
        pageType="tool"
        variant="mid"
        pageSlug={tool.slug}
        diagnosisHref={tool.diagnosisLinks[0]?.href ?? "/자가진단"}
        documentsHref="#tool-documents"
      />

      <ResultSection id="tool-diagnosis" title="관련 자가진단">
        <p className="mb-4 text-sm text-navy/65">
          질문에 답하며 위험도와 다음 절차를 확인할 수 있습니다.
        </p>
        <LinkGrid links={tool.diagnosisLinks} />
      </ResultSection>

      <ResultSection id="tool-services" title="관련 서비스 페이지">
        <LinkGrid links={tool.serviceLinks} />
      </ResultSection>

      <RelatedRecommendationsDisplay groups={recommendationGroups} />

      <div id="consultation">
        <PageConversionCTA
          pageType="tool"
          variant="bottom"
          pageSlug={tool.slug}
          diagnosisHref={tool.diagnosisLinks[0]?.href ?? "/자가진단"}
          documentsHref="#tool-documents"
          showSecondaryLinks
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="interactive-surface w-full rounded-xl border border-navy/15 bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-beige/40"
      >
        다시 계산하기
      </button>
    </div>
  );
}
