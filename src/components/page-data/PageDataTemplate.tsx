import type { ReactNode } from "react";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  buildPageSummaryBullets,
  buildPageTocItems,
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  InfoCard,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData, PageSection } from "@/lib/pageData/types";
import type { RecommendationSource } from "@/lib/internal-links";
import { PageDataNapSection } from "./PageDataNapSection";

type PageDataTemplateProps = {
  page: PageData;
  children?: ReactNode;
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
          id={`section-${index}`}
          title={section.title}
        >
          <ProseParagraphs paragraphs={[section.body]} />
          {section.items && section.items.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                <InfoCard key={item}>
                  <p className="text-sm leading-relaxed text-navy/85 md:text-base">
                    {item}
                  </p>
                </InfoCard>
              ))}
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
  showCover = true,
  recommendationSource,
}: PageDataTemplateProps) {
  const cover = getCoverImageForPageData(page);
  const displayFaqs = page.faqs.slice(0, 3);
  const summaryBullets = buildPageSummaryBullets(page);
  const tocItems = buildPageTocItems(page, {
    hasDetailContent: Boolean(children),
  });

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      {showCover ? <PageCoverBanner image={cover} /> : null}

      <PageHero
        h1={page.h1}
        introParagraphs={page.introParagraphs}
        keywords={page.primaryKeywords}
        ctaLabel="상담 문의하기"
      />

      <SummaryBox items={summaryBullets} />

      <PageTableOfContents items={tocItems} />

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

      <ConsultationCTA
        title={page.ctaTitle}
        description={page.ctaText}
        buttonLabel="내 상황에 맞게 상담하기"
      />

      {page.consultationPoints.length > 0 ? (
        <ContentSection id="consultation-points" title="상담 포인트">
          <div className="grid gap-3 sm:grid-cols-2">
            {page.consultationPoints.map((point) => (
              <InfoCard key={point} variant="highlight">
                <p className="text-sm leading-relaxed text-navy/85 md:text-base">
                  {point}
                </p>
              </InfoCard>
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ContentSection id="consultation-example" title="실제 상담 상황 예시">
        <InfoCard variant="highlight">
          <h3 className="text-lg font-semibold text-navy">
            {page.consultationExample.title}
          </h3>
          <p className="body-text mt-3">{page.consultationExample.body}</p>
        </InfoCard>
      </ContentSection>

      <ExtraSections sections={page.sections} />

      {children ? (
        <ContentSection id="detail-content" title="상세 안내">
          <div className="mdx-content">{children}</div>
        </ContentSection>
      ) : null}

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={displayFaqs} />
      </ContentSection>

      <ContentSection id="related" title="관련 페이지">
        <RelatedContentGrid links={page.internalLinks} />
      </ContentSection>

      {recommendationSource ? (
        <RelatedRecommendations source={recommendationSource} />
      ) : null}

      <div id="consultation">
        <ConsultationCTA
          title="내 상황에 맞는 서류와 절차를 확인하고 상담하기"
          description={page.ctaText}
          buttonLabel="상담 문의하기"
        />
        <div className="mt-6">
          <CTASection
            pageType="faq"
            title={page.ctaTitle}
            description={page.ctaText}
            pageSlug={page.slug}
          />
        </div>
      </div>

      <PageDataNapSection
        contactLinks={page.relatedLinks.filter((link) =>
          link.href.startsWith("tel:") ||
          link.label.includes("카카오") ||
          link.label.includes("톡톡") ||
          link.href === "/location",
        )}
      />
    </article>
  );
}
