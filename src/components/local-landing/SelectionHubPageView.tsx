import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { resolveConversionKey } from "@/lib/service-conversion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  ChecklistBox,
  ComparisonTable,
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { getSelectionHubContent } from "@/lib/local-landing/selection";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type SelectionHubPageViewProps = {
  page: PageData;
};

export function SelectionHubPageView({ page }: SelectionHubPageViewProps) {
  const content = getSelectionHubContent(page.slug);
  if (!content) return null;

  const cover = getCoverImageForPageData(page);
  const conversionKey = resolveConversionKey(page);

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const tocItems = [
    { id: "summary", label: "핵심 요약" },
    { id: "search-intents", label: "이런 분들이 검색합니다" },
    { id: "selection-criteria", label: "선택 전 확인할 기준" },
    { id: "service-checkpoints", label: "업무별 체크포인트" },
    ...(content.comparisonRows
      ? [{ id: "comparison", label: content.comparisonTitle ?? "비교" }]
      : []),
    ...content.extraSections.map((s) => ({ id: s.id, label: s.title })),
    { id: "preparation", label: "상담 전 준비서류" },
    { id: "related", label: "관련 페이지" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "consultation", label: "상담 문의" },
  ];

  const comparisonColumns = content.comparisonRows
    ? [
        { key: "aspect", header: "항목" },
        { key: "left", header: "흔한 선택" },
        { key: "right", header: "확인할 기준" },
      ]
    : [];

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        introParagraphs={content.heroParagraphs}
        keywords={content.primaryKeywords}
        ctaHref="/contact"
        ctaLabel="상담 문의하기"
        secondaryCta={{ href: "/부산법무사상담", label: "상담 전 준비사항" }}
      />

      {conversionKey ? (
        <ServiceConversionEnhancements
          conversionKey={conversionKey}
          pageSlug={page.slug}
          placement="top"
        />
      ) : null}

      <div id="summary">
        <SummaryBox items={content.summaryBullets} />
      </div>

      <PageTableOfContents items={tocItems} />

      <ContentSection id="search-intents" title="이런 분들이 검색합니다">
        <p className="body-text mb-4 max-w-3xl text-navy/80">
          아래와 비슷한 상황이라면 이 페이지의 선택 기준을 참고하신 뒤 상담해
          보시면 좋습니다.
        </p>
        <ChecklistBox items={content.searchIntents} />
      </ContentSection>

      <ContentSection id="selection-criteria" title="선택 전 확인할 기준">
        <p className="body-text mb-4 max-w-3xl text-navy/80">
          추천·후기·비용만으로 결정하기 전, 상담에서 아래 항목을 확인해 보세요.
        </p>
        <ChecklistBox items={content.selectionCriteria} />
      </ContentSection>

      <ContentSection id="service-checkpoints" title="업무별 체크포인트">
        <div className="space-y-6">
          {content.serviceCheckpoints.map((block) => (
            <div key={block.title}>
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {block.title}
              </h3>
              <div className="mt-3">
                <ChecklistBox items={block.items} />
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {content.comparisonRows && content.comparisonRows.length > 0 ? (
        <ContentSection
          id="comparison"
          title={content.comparisonTitle ?? "비교"}
        >
          <ComparisonTable
            columns={comparisonColumns}
            rows={content.comparisonRows}
            caption={content.comparisonTitle}
          />
          {content.comparisonNote ? (
            <WarningBox title="비교 안내">
              <p>{content.comparisonNote}</p>
            </WarningBox>
          ) : null}
        </ContentSection>
      ) : null}

      {content.extraSections.map((section) => (
        <ContentSection key={section.id} id={section.id} title={section.title}>
          <ProseParagraphs paragraphs={section.paragraphs} />
          {section.items && section.items.length > 0 ? (
            <div className="mt-4">
              <ChecklistBox items={section.items} />
            </div>
          ) : null}
          {section.links && section.links.length > 0 ? (
            <div className="mt-4">
              <RelatedContentGrid links={section.links} />
            </div>
          ) : null}
        </ContentSection>
      ))}

      <ContentSection id="preparation" title="상담 전 준비서류">
        <ChecklistBox
          items={content.preparationDocs}
          note={content.preparationNote}
        />
        <div className="mt-6">
          <ConsultationCTA
            title="상담 문의"
            description={content.preparationNote}
            buttonLabel="상담 문의하기"
          />
        </div>
      </ContentSection>

      <ContentSection id="related" title="관련 페이지">
        <RelatedContentGrid links={content.relatedLinks} />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <div id="consultation">
        <ConsultationCTA
          title="상담 문의"
          description={content.bottomCtaText}
          buttonLabel="상담 신청하기"
        />
        <div className="mt-6">
          <CTASection
            pageType="faq"
            title="부산 법무사 상담"
            description={content.bottomCtaText}
            pageSlug={page.slug}
          />
        </div>
      </div>

      {conversionKey ? (
        <ServiceConversionEnhancements
          conversionKey={conversionKey}
          pageSlug={page.slug}
          placement="footer"
        />
      ) : null}
    </article>
  );
}
