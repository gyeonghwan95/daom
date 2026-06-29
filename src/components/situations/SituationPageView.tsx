import type { ReactNode } from "react";
import Link from "next/link";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import { recommendationFromSituation } from "@/lib/internal-links";
import { getSituationBySlug } from "@/lib/situations";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type SituationPageViewProps = {
  page: PageData;
  slug: string;
};

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-beige-dark bg-white px-4 py-3.5 text-sm leading-relaxed text-navy/80 md:text-base"
        >
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-navy/20 text-[0.65rem] font-bold text-navy/50"
            aria-hidden
          >
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function LinkGrid({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="interactive-surface card-surface flex min-h-11 items-center px-4 py-3 text-sm font-semibold text-navy hover:bg-beige/40"
          >
            {link.label} →
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ContentSection({
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

export function SituationPageView({ page, slug }: SituationPageViewProps) {
  const situation = getSituationBySlug(slug);
  const cover = getCoverImageForPageData(page);

  if (!situation) return null;

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          Situation Guide
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <ContentSection id="situation-check" title="이런 상황인가요?">
        <Checklist items={situation.situationChecklist} />
      </ContentSection>

      <ContentSection id="first-checks" title="먼저 확인해야 할 것">
        <Checklist items={situation.firstChecks} />
      </ContentSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <ContentSection id="self-handle" title="혼자 처리해도 되는 경우">
          <Checklist items={situation.selfHandleCases} />
        </ContentSection>

        <ContentSection id="lawyer-needed" title="법무사 상담이 필요한 경우">
          <ul className="space-y-2.5">
            {situation.lawyerNeededCases.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-navy/15 bg-gradient-to-r from-beige/40 to-cream px-4 py-3.5 text-sm leading-relaxed text-navy/85 md:text-base"
              >
                {item}
              </li>
            ))}
          </ul>
        </ContentSection>
      </div>

      <ContentSection id="documents" title="필요한 서류">
        <Checklist items={situation.documents} />
      </ContentSection>

      <PageConversionCTA
        pageType="situation"
        variant="mid"
        pageSlug={slug}
        diagnosisHref={situation.diagnosisLinks[0]?.href ?? "/자가진단"}
      />

      <ContentSection id="procedures" title="예상 절차">
        <ol className="space-y-2.5">
          {situation.procedures.map((item, index) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-beige-dark bg-cream/60 px-4 py-3.5 text-sm leading-relaxed text-navy/80 md:text-base"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white"
                aria-hidden
              >
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </ContentSection>

      <ContentSection id="diagnosis-links" title="관련 자가진단">
        <p className="mb-4 text-sm text-navy/65">
          질문에 답하며 위험도와 다음 절차를 확인할 수 있습니다.
        </p>
        <LinkGrid links={situation.diagnosisLinks} />
      </ContentSection>

      <ContentSection id="service-links" title="관련 서비스·허브">
        <LinkGrid links={situation.serviceLinks} />
      </ContentSection>

      <ContentSection id="faq-links" title="관련 FAQ">
        <LinkGrid links={situation.faqLinks} />
      </ContentSection>

      {situation.extraLinks.length > 0 ? (
        <ContentSection id="more-links" title="더 보기">
          <LinkGrid links={situation.extraLinks} />
        </ContentSection>
      ) : null}

      <DiagnosisFAQ items={page.faqs} />

      <RelatedRecommendations source={recommendationFromSituation(situation)} />

      <div id="consultation">
        <LawyerConsultationGuide
          pageType="situation"
          title={page.ctaTitle}
          description={page.ctaText}
          showSecondaryLinks
          pageSlug={slug}
          diagnosisHref={situation.diagnosisLinks[0]?.href ?? "/자가진단"}
        />
      </div>
    </article>
  );
}
