import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { resolveConversionKey } from "@/lib/service-conversion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import {
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { recommendationFromService } from "@/lib/internal-links";
import { getSearchIntentContent } from "@/lib/local-landing/search-intent";
import { subproxyJurisdictionData } from "@/lib/local-landing/search-intent";
import { MassRegistryB2BAddon } from "@/components/b2b/MassRegistryB2BAddon";
import { allServiceDetails } from "@/lib/services-data";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
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

  const tocItems = [
    { id: "summary", label: "핵심 요약" },
    { id: "search-intents", label: "이런 분들이 많이 검색합니다" },
    { id: "when-needed", label: "언제 필요한가" },
    { id: "documents", label: "준비서류" },
    { id: "procedures", label: "절차" },
    { id: "mistakes", label: "자주 하는 실수" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "related-cases", label: "관련 사례" },
    { id: "related-services", label: "관련 서비스" },
    { id: "consultation", label: "상담 문의" },
  ];

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
        ctaLabel="상담 문의하기"
        showDiagnosisCta={false}
        showAboutLawyerCta
        showNationwideChip={shouldShowNationwideRegionChip(page.path, page.slug)}
      />

      <ProseParagraphs paragraphs={content.heroParagraphs.slice(1)} />

      {conversionKey ? (
        <ServiceConversionEnhancements
          conversionKey={conversionKey}
          pageSlug={page.slug}
          placement="top"
        />
      ) : null}

      <ContentSection id="summary" title="핵심 요약">
        <SummaryBox items={content.summaryBullets} />
      </ContentSection>

      <PageTableOfContents items={tocItems} />

      <ContentSection id="search-intents" title="이런 분들이 많이 검색합니다">
        <ChecklistBox items={content.searchIntents} />
      </ContentSection>

      <ContentSection id="when-needed" title="언제 필요한가">
        <ChecklistBox items={content.whenNeeded} />
      </ContentSection>

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
