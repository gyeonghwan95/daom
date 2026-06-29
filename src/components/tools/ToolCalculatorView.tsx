"use client";

import { useState } from "react";
import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendationsDisplay } from "@/components/internal-links/RelatedRecommendationsDisplay";
import type { RecommendationGroups } from "@/lib/internal-links";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import type { PageData } from "@/lib/pageData/types";
import {
  getToolBySlug,
  runToolCalculator,
  type ToolCalculatorInput,
} from "@/lib/tools";
import { ToolCalculatorForm } from "./ToolCalculatorForm";
import { ToolCalculatorResultView } from "./ToolCalculatorResult";
import { ToolDisclaimer } from "./ToolDisclaimer";

type ToolCalculatorViewProps = {
  page: PageData;
  slug: string;
  recommendationGroups: RecommendationGroups;
};

export function ToolCalculatorView({
  page,
  slug,
  recommendationGroups,
}: ToolCalculatorViewProps) {
  const tool = getToolBySlug(slug);
  const cover = getCoverImageForPageData(page);
  const [input, setInput] = useState<ToolCalculatorInput>({});
  const [result, setResult] = useState<ReturnType<typeof runToolCalculator> | null>(
    null,
  );

  if (!tool) return null;

  const calculatorType = tool.calculatorType;

  function handleCalculate() {
    setResult(runToolCalculator(calculatorType, input));
  }

  function handleReset() {
    setResult(null);
    setInput({});
  }

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          Legal Calculator
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <section
        id="calculator"
        className="rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/20 to-beige/30 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] sm:p-6"
      >
        <h2 className="section-heading">대략 검토하기</h2>
        <p className="mt-2 text-sm text-navy/65">
          아래 정보를 입력하면 참고용 결과를 안내합니다. 확정 산출이 아닙니다.
        </p>
        <div className="mt-5">
          <ToolDisclaimer />
        </div>
        <div className="mt-5">
          {result ? (
            <ToolCalculatorResultView
              tool={tool}
              result={result}
              onReset={handleReset}
              recommendationGroups={recommendationGroups}
            />
          ) : (
            <ToolCalculatorForm
              calculatorType={tool.calculatorType}
              input={input}
              onChange={setInput}
              onSubmit={handleCalculate}
            />
          )}
        </div>
      </section>

      <section id="tool-info" className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">이 계산기로 알 수 있는 것</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-navy/75">
          <li>· 일반적인 기한·비용·서류 방향을 빠르게 점검할 수 있습니다.</li>
          <li>· 관할·서류·당사자 상황에 따라 실제 결과는 달라질 수 있습니다.</li>
          <li>· 자가진단·업무안내·상담으로 이어서 확인하는 것이 좋습니다.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/tools"
            className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
          >
            ← 법률 계산기 목록
          </Link>
        </div>
      </section>

      <DiagnosisFAQ items={page.faqs} />

      {!result ? (
        <>
          <RelatedRecommendationsDisplay groups={recommendationGroups} />
          <div id="consultation">
          <LawyerConsultationGuide
            title={page.ctaTitle}
            description={page.ctaText}
            showSecondaryLinks
            pageSlug={slug}
          />
          </div>
        </>
      ) : null}
    </article>
  );
}
