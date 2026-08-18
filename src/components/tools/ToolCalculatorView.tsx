"use client";

import { useState } from "react";
import Link from "next/link";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendationsDisplay } from "@/components/internal-links/RelatedRecommendationsDisplay";
import {
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import type { RecommendationGroups } from "@/lib/internal-links";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import type { PageData } from "@/lib/pageData/types";
import { trackToolUsed } from "@/lib/admin-ops/track-client";
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

  const summaryBullets = [
    page.intro,
    "일반적인 기한·비용·서류 방향을 빠르게 점검할 수 있습니다.",
    "관할·서류·당사자 상황에 따라 실제 결과는 달라질 수 있습니다.",
    "자가진단·업무안내·상담으로 이어서 확인하는 것이 좋습니다.",
  ].slice(0, 5);

  const tocItems = [
    { id: "calculator", label: "대략 검토하기" },
    { id: "tool-info", label: "이 계산기로 알 수 있는 것" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "consultation", label: "상담 문의" },
  ];

  function handleCalculate() {
    setResult(runToolCalculator(calculatorType, input));
    trackToolUsed(slug);
  }

  function handleReset() {
    setResult(null);
    setInput({});
  }

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={page.h1}
        intro={page.intro}
        keywords={page.primaryKeywords}
        eyebrow="Legal Calculator"
        ctaLabel={consultationInquiryCopy.ctaShort}
        showDiagnosisCta={false}
        showAboutLawyerCta
      />

      <SummaryBox items={summaryBullets} />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="calculator" title="대략 검토하기">
        <p className="text-sm text-navy/65 md:text-base">
          아래 정보를 입력하면 참고용 결과를 안내합니다. 확정 산출이 아닙니다.
        </p>
        <WarningBox title="계산기 안내">
          <p>
            본 계산기는 참고용이며, 사안에 따라 결과가 달라질 수 있습니다.
            확정적인 법률 판단이나 금액 산정을 대신하지 않습니다.
          </p>
        </WarningBox>
        <div className="rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/20 to-beige/30 p-5 sm:p-6">
          <ToolDisclaimer />
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
        </div>
      </ContentSection>

      <ContentSection id="tool-info" title="이 계산기로 알 수 있는 것">
        <ul className="space-y-3">
          {summaryBullets.slice(1).map((item) => (
            <li
              key={item}
              className="rounded-xl border border-beige-dark bg-white px-4 py-3.5 text-sm leading-relaxed text-navy/80 md:text-base"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/tools"
            className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
          >
            ← 법률 계산기 목록
          </Link>
        </div>
      </ContentSection>

      <DiagnosisFAQ items={page.faqs} />

      {!result ? (
        <>
          <RelatedRecommendationsDisplay groups={recommendationGroups} />
          <div id="consultation">
            <ConsultationCTA
              title="계산 결과를 바탕으로 상담해 보세요"
              description={page.ctaText}
              buttonLabel={consultationInquiryCopy.ctaPrimary}
            />
          </div>
        </>
      ) : null}
    </article>
  );
}
