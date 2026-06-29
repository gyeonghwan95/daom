import type { ReactNode } from "react";
import { DiagnosisPage } from "@/components/diagnosis/DiagnosisPage";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { DiagnosisRelatedLinks } from "@/components/diagnosis/DiagnosisRelatedLinks";
import { DiagnosisSeoProse } from "@/components/diagnosis/DiagnosisSeoProse";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import { recommendationFromDiagnosis } from "@/lib/internal-links";
import { getDiagnosisResultRecommendations } from "@/lib/diagnosis/result-recommendations";
import type { Diagnosis } from "@/data/diagnosis";
import { getDiagnosisCtaCopy } from "@/lib/diagnosis/builder";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type DiagnosisPageViewProps = {
  page: PageData;
  diagnosis: Diagnosis;
};

function ContentBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
    >
      <h2 className="section-heading">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Checklist({
  items,
  ordered = false,
}: {
  items: string[];
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={ordered ? "space-y-3" : "space-y-3"}>
      {items.map((item, index) => (
        <li
          key={item}
          className={`card-surface text-base leading-relaxed text-navy/80 md:px-5 md:py-4 ${
            ordered ? "flex gap-3 px-4 py-3" : "px-4 py-3"
          }`}
        >
          {ordered ? (
            <>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span>{item}</span>
            </>
          ) : (
            item
          )}
        </li>
      ))}
    </Tag>
  );
}

export function DiagnosisPageView({ page, diagnosis }: DiagnosisPageViewProps) {
  const cover = getCoverImageForPageData(page);
  const cta = getDiagnosisCtaCopy(diagnosis);
  const busanTypes =
    diagnosis.busanConsultationTypes ?? diagnosis.targetUsers;
  const resultExplanation = diagnosis.resultExplanation ?? [];
  const conceptParagraphs = diagnosis.conceptParagraphs ?? [];
  const recommendationGroups = getDiagnosisResultRecommendations(diagnosis);

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <h1 className="page-title">{page.h1}</h1>
        {diagnosis.intro[0] ? (
          <p className="body-text mt-4 max-w-3xl md:mt-5">{diagnosis.intro[0]}</p>
        ) : null}
      </header>

      <ContentBlock id="diagnosis" title="자가진단 시작하기">
        <DiagnosisPage
          diagnosis={diagnosis}
          recommendationGroups={recommendationGroups}
        />
      </ContentBlock>

      {resultExplanation.length > 0 ? (
        <ContentBlock id="result-guide" title="자가진단 결과 안내">
          <DiagnosisSeoProse paragraphs={resultExplanation} />
        </ContentBlock>
      ) : null}

      {conceptParagraphs.length > 0 ? (
        <ContentBlock id="concept" title={`${diagnosis.serviceName} 기본 개념`}>
          <DiagnosisSeoProse paragraphs={conceptParagraphs} />
        </ContentBlock>
      ) : null}

      {busanTypes.length > 0 ? (
        <ContentBlock id="busan-cases" title="부산에서 많이 발생하는 상담 유형">
          <Checklist items={busanTypes} />
        </ContentBlock>
      ) : null}

      <ContentBlock id="documents" title="필요서류 체크리스트">
        <Checklist items={diagnosis.requiredDocuments} />
      </ContentBlock>

      <PageConversionCTA
        pageType="default"
        variant="mid"
        pageSlug={diagnosis.slug}
        diagnosisHref={`/${diagnosis.slug}`}
        documentsHref="#documents"
        title="자가진단 전에 서류를 먼저 확인해 보세요"
        description="아래 체크리스트를 보신 뒤 자가진단을 시작하거나, 편한 방법으로 상담해 보세요."
      />

      <ContentBlock id="procedures" title="절차 안내">
        <Checklist items={diagnosis.processSteps} ordered />
      </ContentBlock>

      <ContentBlock id="cost-factors" title="비용이 달라지는 이유">
        <Checklist items={diagnosis.costFactors} />
      </ContentBlock>

      <ContentBlock id="deadlines" title="기간·기한·과태료 주의사항">
        <ul className="space-y-3">
          {diagnosis.deadlineWarnings.map((item) => (
            <li
              key={item}
              className="card-surface border-l-4 border-l-amber-400/80 px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
            >
              {item}
            </li>
          ))}
        </ul>
      </ContentBlock>

      <ContentBlock id="consultation-example" title="실제 부산 상담 예시">
        <div className="card-surface bg-cream p-6 md:p-8">
          <h3 className="text-lg font-semibold text-navy">
            {diagnosis.caseExample.title}
          </h3>
          <p className="body-text mt-3 leading-relaxed">
            {diagnosis.caseExample.body}
          </p>
        </div>
      </ContentBlock>

      <DiagnosisFAQ items={diagnosis.faqs} />

      <DiagnosisRelatedLinks links={page.internalLinks} />

      <RelatedRecommendations source={recommendationFromDiagnosis(diagnosis)} />

      <div id="consultation">
        <PageConversionCTA
          pageType="default"
          variant="bottom"
          title={cta.title}
          description={cta.text}
          pageSlug={diagnosis.slug}
          diagnosisHref={`/${diagnosis.slug}`}
          documentsHref="#documents"
          showSecondaryLinks
        />
      </div>
    </article>
  );
}

export { DiagnosisHubView } from "@/components/diagnosis/DiagnosisHubView";
