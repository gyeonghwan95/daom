import type { ReactNode } from "react";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import { ServiceConversionEnhancements } from "@/components/conversion";
import {
  getConversionFaqsForPage,
  resolveConversionKey,
} from "@/lib/service-conversion";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import {
  InheritanceCostGuide,
  InheritanceJourneyNav,
  RemoteInheritanceProcess,
} from "@/components/inheritance";
import {
  isInheritanceFlagshipPage,
  isInheritanceJourneyPage,
} from "@/lib/inheritance/journey";
import {
  buildPageTocItems,
  ArticleSummary,
  ChecklistBox,
  ContentSection,
  InfoCard,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  WarningBox,
} from "@/components/readability";
import type { RecommendationSource } from "@/lib/internal-links";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData, PageSection } from "@/lib/pageData/types";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import {
  getNationwideBannerHeadline,
  NATIONWIDE_SERVICE_SLUGS,
  shouldShowNationwideRegionChip,
} from "@/lib/nationwide/show-region-chip";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { CorporateLegalOperationsModules } from "@/components/local-landing/CorporateLegalOperationsModules";
import {
  CORPORATE_LEGAL_OPERATIONS_SLUG,
  corporateLegalHeroCta,
  corporateLegalInquiryHref,
} from "@/lib/local-landing/corporate-legal-operations-modules";

type PageDataTemplateProps = {
  page: PageData;
  children?: ReactNode;
  /** H1·인트로 바로 아래(첫 화면)에 붙는 안내 — 전국 수임 배지 등 */
  heroAddon?: ReactNode;
  showCover?: boolean;
  recommendationSource?: RecommendationSource;
};

function ExtraSections({ sections }: { sections: PageSection[] }) {
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => (
        <ContentSection
          key={`${section.title}-${index}`}
          id={section.id ?? `section-${index}`}
          title={section.title}
        >
          <ProseParagraphs paragraphs={[section.body]} />
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
    </>
  );
}

export function PageDataTemplate({
  page,
  children,
  heroAddon,
  showCover = true,
  recommendationSource,
}: PageDataTemplateProps) {
  const cover = getCoverImageForPageData(page);
  const tocItems = buildPageTocItems(page, {
    hasDetailContent: Boolean(children),
  });
  const conversionKey = resolveConversionKey(page);
  const showNationwide = shouldShowNationwideRegionChip(
    page.path,
    page.slug,
    page.serviceSlug,
  );
  const isDedicatedNationwideHub =
    page.path.startsWith("/전국") ||
    page.path === "/여러지역상속부동산등기" ||
    page.slug === "전국업무";
  /** 업무안내·전국허브는 NationwideServiceNotice가 있어 배너 중복 생략 */
  const showRemoteBanner =
    showNationwide &&
    !isDedicatedNationwideHub &&
    !(page.category === "service" && NATIONWIDE_SERVICE_SLUGS.has(page.slug));
  const showInheritanceJourney = isInheritanceJourneyPage(page.slug);
  const showInheritanceExtras = isInheritanceFlagshipPage(page.slug);
  const isCorporateLegalOps = page.slug === CORPORATE_LEGAL_OPERATIONS_SLUG;
  const conversionFaqs = conversionKey
    ? getConversionFaqsForPage(page.slug, page.path)
    : [];
  const displayFaqs = page.faqs;

  const conversionBlock = (placement: Parameters<typeof ServiceConversionEnhancements>[0]["placement"]) =>
    conversionKey ? (
      <ServiceConversionEnhancements
        conversionKey={conversionKey}
        pageSlug={page.slug}
        serviceSlug={page.category === "service" ? page.slug : undefined}
        placement={placement}
      />
    ) : null;

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd
        data={buildJsonLdForPageData(page, { extraFaqs: conversionFaqs })}
      />

      {showCover ? <PageCoverBanner image={cover} /> : null}

      <PageHero
        h1={page.h1}
        introParagraphs={page.introParagraphs}
        keywords={page.primaryKeywords}
        ctaLabel={
          showInheritanceExtras
            ? "업무 가능 여부 확인하기"
            : isCorporateLegalOps
              ? corporateLegalHeroCta
              : consultationInquiryCopy.ctaShort
        }
        ctaHref={isCorporateLegalOps ? corporateLegalInquiryHref : "/contact/inquiry"}
        showDiagnosisCta={false}
        showAboutLawyerCta
        showNationwideChip={showNationwide}
      />

      {showRemoteBanner ? (
        <NationwideServiceCard
          headline={getNationwideBannerHeadline(page.slug)}
        />
      ) : null}

      {heroAddon}

      {showInheritanceJourney ? (
        <InheritanceJourneyNav currentSlug={page.slug} />
      ) : null}

      {conversionBlock("top")}

      <ArticleSummary
        conclusion={
          page.introParagraphs[0]?.trim() ||
          page.intro.trim() ||
          `${page.h1}에 대한 핵심 절차와 준비사항을 정리했습니다.`
        }
        checkItems={[
          page.procedures[0] ? `진행: ${page.procedures[0]}` : "",
          page.documents[0] ? `서류: ${page.documents[0]}` : "",
          page.consultationPoints[0] || "",
        ].filter(Boolean)}
        consultTriggers={page.consultationPoints.slice(0, 3)}
      />

      {isCorporateLegalOps ? <CorporateLegalOperationsModules /> : null}

      <BusinessCredentialSlot path={page.path} slug={page.slug} />

      {page.introParagraphs.length > 1 ? (
        <ContentSection id="article-body" title="자세히 알아보기">
          <ProseParagraphs paragraphs={page.introParagraphs.slice(1)} />
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

      <ContentSection id="procedures" title="핵심 절차">
        <StepTimeline steps={page.procedures} />
        <WarningBox title="절차 안내">
          <p>
            위 순서는 일반적인 흐름을 정리한 것입니다. 사안에 따라 단계나
            소요 기간이 달라질 수 있으니 상담 시 확인해 보시면 좋습니다.
          </p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="documents" title="필요 서류">
        <ChecklistBox
          items={page.documents}
          note="사건마다 추가 서류가 필요할 수 있습니다. 상담 전에 체크리스트를 확인해 두시면 준비가 수월합니다."
        />
      </ContentSection>

      {showInheritanceExtras ? (
        <>
          <RemoteInheritanceProcess fromPage={page.slug} />
          <InheritanceCostGuide fromPage={page.slug} />
        </>
      ) : null}

      {page.consultationPoints.length > 0 ? (
        <ContentSection id="consultation-points" title="상담 포인트">
          <ChecklistBox items={page.consultationPoints} />
        </ContentSection>
      ) : null}

      <ArticleVisualSlot
        path={page.path}
        slot="before-example"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <ContentSection id="consultation-example" title="실제 상담 상황 예시">
        <InfoCard variant="plain">
          <h3 className="section-subheading">{page.consultationExample.title}</h3>
          <p className="body-text mt-3">{page.consultationExample.body}</p>
        </InfoCard>
      </ContentSection>

      {conversionBlock("detail")}

      <ExtraSections sections={page.sections} />

      {children ? (
        <ContentSection id="detail-content" title="상세 안내">
          <div className="mdx-content prose-measure">{children}</div>
        </ContentSection>
      ) : null}

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={displayFaqs} />
      </ContentSection>

      {conversionBlock("post-faq")}

      <ContentSection id="related" title="관련 페이지">
        <RelatedContentGrid links={page.internalLinks} />
      </ContentSection>

      {conversionBlock("footer")}

      {recommendationSource ? (
        <RelatedRecommendations source={recommendationSource} />
      ) : null}

      <div id="consultation" className="space-y-6">
        <CTASection
          pageType="faq"
          title={isCorporateLegalOps ? corporateLegalHeroCta : page.ctaTitle}
          description={
            isCorporateLegalOps
              ? "대표·임원·본점·목적·자본 등 변경 사실과 등기부만 알려 주시면, 필요한 등기와 준비서류부터 확인합니다."
              : page.ctaText
          }
          pageSlug={page.slug}
          showChannelButtons={false}
        />
      </div>
    </article>
  );
}
