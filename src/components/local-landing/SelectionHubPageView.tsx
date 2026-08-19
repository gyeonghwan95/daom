import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import Link from "next/link";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { resolveConversionKey } from "@/lib/service-conversion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  ArticleSummary,
  ChecklistBox,
  ComparisonTable,
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  WarningBox,
} from "@/components/readability";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { shouldShowNationwideRegionChip } from "@/lib/nationwide/show-region-chip";
import { getSelectionHubContent } from "@/lib/local-landing/selection";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

type SelectionHubPageViewProps = {
  page: PageData;
};

export function SelectionHubPageView({ page }: SelectionHubPageViewProps) {
  const content = getSelectionHubContent(page.slug);
  if (!content) return null;

  const isConsultPrep = page.slug === "부산법무사상담";
  const cover = getCoverImageForPageData(page);
  const conversionKey = resolveConversionKey(page);

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const tocItems = [
    { id: "article-body", label: "본문 안내" },
    {
      id: "selection-criteria",
      label: isConsultPrep ? "상담 전 이것만 알려주세요" : "선택 전 확인할 기준",
    },
    {
      id: "service-checkpoints",
      label: isConsultPrep ? "어떤 문제로 상담하시나요?" : "업무별 체크포인트",
    },
    ...(content.comparisonRows
      ? [{ id: "comparison", label: content.comparisonTitle ?? "비교" }]
      : []),
    ...content.extraSections.map((s) => ({ id: s.id, label: s.title })),
    { id: "preparation", label: "상담 전 준비서류" },
    { id: "related", label: "관련 페이지" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "consultation", label: "상담 문의" },
  ];

  const showNationwide = shouldShowNationwideRegionChip(
    page.path,
    page.slug,
    page.serviceSlug,
  );

  const bodyParagraphs = [
    ...content.heroParagraphs.slice(1),
    content.searchIntents.length > 0
      ? `이런 분들이 이 페이지를 찾습니다. ${content.searchIntents.slice(0, 3).join(" ")}`
      : "",
    content.selectionCriteria.length > 0
      ? `추천·후기·비용만으로 결정하기 전, ${content.selectionCriteria.slice(0, 2).join(" ")} 같은 기준을 먼저 확인해 보시면 상담이 구체적입니다.`
      : "",
  ].filter((p) => p.trim().length > 0);

  const comparisonColumns = content.comparisonRows
    ? isConsultPrep
      ? [
          { key: "aspect", header: "구분" },
          { key: "left", header: "안내·확인 내용" },
          { key: "right", header: "함께 볼 내용" },
        ]
      : [
          { key: "aspect", header: "항목" },
          { key: "left", header: "흔한 선택" },
          { key: "right", header: "확인할 기준" },
        ]
    : [];

  const inquiryBase = `/contact/inquiry?from=${encodeURIComponent(page.slug)}&field=${encodeURIComponent(page.serviceSlug ?? "inheritance-registration")}`;
  const inquiryCost = `${inquiryBase}&intent=${encodeURIComponent("준비서류와 비용 확인")}`;
  const inquirySituation = `${inquiryBase}&intent=${encodeURIComponent("현재 상황 안내")}`;

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        introParagraphs={content.heroParagraphs}
        keywords={isConsultPrep ? [] : content.primaryKeywords}
        ctaHref={isConsultPrep ? inquiryBase : "/contact/inquiry"}
        ctaLabel={isConsultPrep ? "업무 가능 여부 확인하기" : consultationInquiryCopy.ctaShort}
        secondaryCta={
          page.slug === "부산등기법무사추천"
            ? { href: "/부산등기법무사", label: "부산 등기 법무사" }
            : isConsultPrep
            ? { href: "/about", label: "안윤정 법무사 소개" }
            : { href: "/부산법무사상담", label: "부산 전역 상담 안내" }
        }
        showDiagnosisCta={false}
        showNationwideChip={showNationwide}
        showNaverReservation={isConsultPrep ? true : undefined}
      />

      {showNationwide ? <NationwideServiceCard /> : null}

      {conversionKey ? (
        <ServiceConversionEnhancements
          conversionKey={conversionKey}
          pageSlug={page.slug}
          placement="top"
        />
      ) : null}

      <ArticleSummary
        conclusion={
          content.summaryBullets.slice(0, 2).join(" ") ||
          content.heroParagraphs[0]
        }
        checkItems={content.selectionCriteria.slice(0, 3)}
        consultTriggers={content.searchIntents.slice(0, 3)}
      />

      {bodyParagraphs.length > 0 ? (
        <ContentSection id="article-body" title="자세히 알아보기">
          <div className="article-body">
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <PageTableOfContents items={tocItems} />

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <ContentSection
        id="selection-criteria"
        title={isConsultPrep ? "상담 전 이것만 알려주세요" : "선택 전 확인할 기준"}
      >
        <ChecklistBox items={content.selectionCriteria} />
      </ContentSection>

      <ContentSection
        id="service-checkpoints"
        title={isConsultPrep ? "어떤 문제로 상담하시나요?" : "업무별 체크포인트"}
      >
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
      </ContentSection>

      <ContentSection id="related" title="관련 페이지">
        <RelatedContentGrid links={content.relatedLinks} />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <div id="consultation">
        <ConsultationCTA
          title={isConsultPrep ? "업무 가능 여부부터 확인해 보세요" : "상담 문의"}
          description={content.bottomCtaText}
          buttonLabel={
            isConsultPrep ? "업무 가능 여부 확인하기" : consultationInquiryCopy.ctaPrimary
          }
          inquiryField={page.serviceSlug}
          fromPage={page.slug}
          intent={isConsultPrep ? "업무 가능 여부 확인" : undefined}
        />
        {isConsultPrep ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={inquiryCost}
              className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-5 text-sm"
            >
              준비서류와 비용 문의하기
            </Link>
            <Link
              href={inquirySituation}
              className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center px-5 text-sm"
            >
              현재 상황 남기기
            </Link>
          </div>
        ) : null}
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
