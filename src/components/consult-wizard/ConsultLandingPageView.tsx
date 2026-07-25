"use client";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  ChecklistBox,
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { ConsultStartButton } from "@/components/consult-wizard/ConsultStartButton";
import { getConsultLanding } from "@/lib/consult-wizard/landings";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type ConsultLandingPageViewProps = {
  page: PageData;
};

export function ConsultLandingPageView({ page }: ConsultLandingPageViewProps) {
  const content = getConsultLanding(page.slug);
  if (!content) return null;

  const cover = getCoverImageForPageData(page);
  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const tocItems = [
    { id: "summary", label: "핵심 안내" },
    { id: "how", label: "상담 진행 방식" },
    { id: "preparation", label: "있으면 좋은 준비" },
    { id: "related", label: "관련 안내" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "start", label: "상담 시작" },
  ];

  return (
    <article className="content-stack consult-landing">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      {cover ? <PageCoverBanner image={cover} /> : null}

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        introParagraphs={content.paragraphs}
        keywords={[content.title, "법무사 상담", "간편 상담"]}
        ctaLabel=""
        showDiagnosisCta={false}
        showAboutLawyerCta={false}
      >
        <div className="mt-5 md:mt-6">
          <ConsultStartButton
            pageTitle={content.metaTitle}
            pageUrl={page.path}
            presetSituationIds={content.presetSituationIds}
            className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
          />
        </div>
      </PageHero>

      <div id="summary">
        <SummaryBox title="이런 분께 맞춰 두었습니다" items={content.bullets} />
      </div>

      <PageTableOfContents items={tocItems} />

      <ContentSection id="how" title="상담은 이렇게 진행됩니다">
        <ProseParagraphs
          paragraphs={[
            "긴 문의 글을 쓰지 않아도 됩니다. 해당하는 상황을 고르고, 준비된 자료가 있으면 표시한 뒤 연락처만 남겨 주시면 됩니다.",
            "필요한 절차와 준비자료를 확인한 뒤, 남겨주신 방법으로 안내드립니다.",
          ]}
        />
      </ContentSection>

      <ContentSection id="preparation" title="상담 전에 있으면 좋은 것">
        <ChecklistBox items={content.prepItems} />
        <WarningBox title="서류가 없어도 괜찮습니다">
          <p>
            준비되지 않은 항목이 있어도 상담 문의를 남길 수 있습니다. 상담 후
            필요한 목록을 안내드립니다.
          </p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="related" title="관련 안내">
        <RelatedContentGrid
          links={content.relatedLinks.map((link) => ({
            href: link.href,
            label: link.label,
          }))}
        />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <section id="start" className="consult-landing__start" aria-labelledby="consult-start-heading">
        <p className="consult-landing__start-eyebrow">간편 상담</p>
        <h2 id="consult-start-heading" className="consult-landing__start-title">
          상담 시작하기
        </h2>
        <p className="consult-landing__start-lead">
          업무명을 몰라도, 서류가 없어도 현재 상황만 선택해 주세요.
        </p>
        <div className="consult-landing__start-actions">
          <ConsultStartButton
            pageTitle={content.metaTitle}
            pageUrl={page.path}
            presetSituationIds={content.presetSituationIds}
            className="btn-primary consult-landing__start-btn"
          />
        </div>
      </section>
    </article>
  );
}
