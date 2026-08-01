import {
  InheritanceCostGuide,
  InheritanceJourneyNav,
  RemoteInheritanceProcess,
} from "@/components/inheritance";
import {
  RemoteCostChecklist,
  RemoteLegalProcess,
} from "@/components/remote";
import { isInheritanceJourneyPage } from "@/lib/inheritance/journey";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { resolveConversionKey } from "@/lib/service-conversion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import {
  ArticleSummary,
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  WarningBox,
} from "@/components/readability";
import { recommendationFromService } from "@/lib/internal-links";
import { getSearchIntentContent } from "@/lib/local-landing/search-intent";
import { subproxyJurisdictionData } from "@/lib/local-landing/search-intent";
import { MassRegistryB2BAddon } from "@/components/b2b/MassRegistryB2BAddon";
import { allServiceDetails } from "@/lib/services-data";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import { shouldShowNationwideRegionChip } from "@/lib/nationwide/show-region-chip";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type SearchIntentPageViewProps = {
  page: PageData;
};

export function SearchIntentPageView({ page }: SearchIntentPageViewProps) {
  const content = getSearchIntentContent(page.slug);
  if (!content) return null;

  const cover = getCoverImageForPageData(page);
  const conversionKey = resolveConversionKey(page);
  const service = allServiceDetails.find((s) => s.slug === content.serviceSlug);

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const showJourney =
    content.showInheritanceJourney !== false &&
    isInheritanceJourneyPage(page.slug);

  const tocItems = [
    ...(showJourney
      ? [{ id: "inheritance-journey", label: "절차 여정" }]
      : []),
    { id: "article-body", label: "본문 안내" },
    ...(content.proseSections?.map((s) => ({ id: s.id, label: s.title })) ??
      []),
    { id: "documents", label: "준비서류" },
    { id: "procedures", label: "절차" },
    ...(content.showRemoteInheritance
      ? [{ id: "remote-inheritance", label: "비대면 진행" }]
      : []),
    ...(content.showRemoteLegalProcess
      ? [{ id: "remote-legal-process", label: "방문 전 확인" }]
      : []),
    ...(content.showInheritanceCostGuide
      ? [{ id: "inheritance-cost-guide", label: "비용 안내" }]
      : []),
    ...(content.showRemoteCostChecklist
      ? [{ id: "remote-cost-checklist", label: "비용 확인 정보" }]
      : []),
    { id: "mistakes", label: "자주 하는 실수" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "related-cases", label: "관련 사례" },
    { id: "related-services", label: "관련 서비스" },
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
      ? `이런 검색·상담이 많습니다. ${content.searchIntents.slice(0, 3).join(" ")}`
      : "",
    content.whenNeeded.length > 0
      ? `언제 필요한지부터 보면 판단이 쉬워집니다. ${content.whenNeeded.slice(0, 3).join(" ")}`
      : "",
  ].filter((p) => p.trim().length > 0);

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroParagraphs[0]}
        keywords={content.primaryKeywords}
        ctaLabel={
          content.showRemoteInheritance ||
          content.showInheritanceCostGuide ||
          content.showRemoteLegalProcess ||
          content.showRemoteCostChecklist
            ? "업무 가능 여부 확인하기"
            : "상담 문의하기"
        }
        showDiagnosisCta={false}
        showAboutLawyerCta
        showNationwideChip={showNationwide}
      />

      {showNationwide ? <NationwideServiceCard /> : null}

      <ArticleSummary
        conclusion={
          content.summaryBullets.slice(0, 2).join(" ") ||
          content.heroParagraphs[0]
        }
        checkItems={content.documents.slice(0, 3)}
        consultTriggers={content.whenNeeded.slice(0, 3)}
      />

      {showJourney ? (
        <InheritanceJourneyNav currentSlug={page.slug} />
      ) : null}

      {bodyParagraphs.length > 0 ? (
        <ContentSection id="article-body" title="자세히 알아보기">
          <div className="article-body">
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </ContentSection>
      ) : null}

      {content.proseSections?.map((section) => (
        <ContentSection key={section.id} id={section.id} title={section.title}>
          <ProseParagraphs paragraphs={section.paragraphs} />
        </ContentSection>
      ))}

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      {conversionKey ? (
        <ServiceConversionEnhancements
          conversionKey={conversionKey}
          pageSlug={page.slug}
          placement="top"
        />
      ) : null}

      <PageTableOfContents items={tocItems} />

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      {page.slug === "부산등기복대리" ? (
        <ContentSection id="jurisdictions" title="관할별 안내(사전 확인)">
          <p className="mb-4 text-sm text-navy/75">
            가능 여부는 일정·서류에 따라 달라질 수 있습니다. 수행하지 않는 업무를
            가능하다고 표시하지 않습니다.
          </p>
          <div className="space-y-4">
            {subproxyJurisdictionData.map((row) => (
              <div
                key={row.officeName}
                className="rounded-xl border border-beige-dark bg-white px-4 py-4"
              >
                <h3 className="font-semibold text-navy">{row.officeName}</h3>
                <p className="mt-1 text-sm text-navy/75">{row.jurisdiction}</p>
                <p className="mt-2 text-sm">
                  <span className="font-medium">가능 업무: </span>
                  {row.acceptedWork.join(", ")}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-medium">제외: </span>
                  {row.excludedWork.join(", ")}
                </p>
                <p className="mt-1 text-sm text-navy/70">{row.contactNotice}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ContentSection id="documents" title="준비서류">
        <ChecklistBox
          items={content.documents}
          note={content.documentsNote}
        />
      </ContentSection>

      <ContentSection id="procedures" title="절차">
        <StepTimeline steps={content.procedures} />
      </ContentSection>

      {content.showRemoteInheritance ? (
        <RemoteInheritanceProcess fromPage={page.slug} />
      ) : null}

      {content.showRemoteLegalProcess ? (
        <RemoteLegalProcess
          fromPage={page.slug}
          inquiryField={content.serviceSlug}
        />
      ) : null}

      {content.showInheritanceCostGuide ? (
        <InheritanceCostGuide fromPage={page.slug} />
      ) : null}

      {content.showRemoteCostChecklist ? (
        <RemoteCostChecklist
          fromPage={page.slug}
          inquiryField={content.serviceSlug}
          variant={content.remoteCostChecklistVariant ?? "inheritance"}
        />
      ) : null}

      <ContentSection id="mistakes" title="자주 하는 실수">
        <WarningBox title="상담 전에 자주 놓치는 부분">
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy/85 md:text-base">
            {content.commonMistakes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </WarningBox>
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      {page.slug === "부산집단등기" ? <MassRegistryB2BAddon /> : null}

      <ContentSection id="related-cases" title="관련 사례">
        {content.relatedCaseLinks.length > 0 ? (
          <RelatedContentGrid links={content.relatedCaseLinks} />
        ) : (
          <RelatedContentGrid
            links={[{ href: "/cases", label: "사례 탐색기 전체 보기" }]}
          />
        )}
      </ContentSection>

      <ContentSection id="related-services" title="관련 서비스">
        <RelatedContentGrid links={content.relatedServiceLinks} />
        <div className="mt-6">
          <RelatedContentGrid links={content.relatedGuideLinks} />
        </div>
      </ContentSection>

      {service ? (
        <RelatedRecommendations
          source={recommendationFromService(service)}
          title="함께 보면 좋은 안내"
        />
      ) : null}

      <div id="consultation">
        <ConsultationCTA
          title="현재 상황에 필요한 절차부터 확인해보세요"
          description={content.bottomCtaText}
          buttonLabel={
            content.showRemoteInheritance ||
            content.showInheritanceCostGuide ||
            page.slug.includes("증여")
              ? "업무 가능 여부 확인하기"
              : "상담 내용 남기기"
          }
          inquiryField={content.serviceSlug ?? page.serviceSlug}
          fromPage={page.slug}
          intent={
            page.slug.includes("증여")
              ? "증여등기 서류·비용 구성 확인"
              : content.showInheritanceCostGuide || content.showRemoteInheritance
                ? "상속 절차·비용 확인"
                : undefined
          }
        />
        <div className="mt-6">
          <CTASection
            pageType="faq"
            title="부산 법무사 상담"
            description={content.bottomCtaText}
            pageSlug={page.slug}
            serviceSlug={content.serviceSlug ?? page.serviceSlug}
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
