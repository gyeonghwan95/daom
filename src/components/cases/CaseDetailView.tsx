import type { ReactNode } from "react";
import Link from "next/link";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import { recommendationFromCaseRecord } from "@/lib/internal-links";
import { formatContentDate, getServiceLabel } from "@/lib/content/loader";
import { CASE_DISCLAIMER } from "@/lib/cases/types";
import type { CaseRecord } from "@/lib/cases/types";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import type { PageData } from "@/lib/pageData/types";

type CaseDetailViewProps = {
  page: PageData;
  record: CaseRecord;
  faqLinks: { href: string; label: string }[];
};

function DetailSection({
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

function ItemList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-beige-dark bg-white px-4 py-3.5 text-sm leading-relaxed text-navy/80 md:text-base"
        >
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-navy/15 text-[0.6rem] font-bold text-navy/45"
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

function OrderedList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ol className="space-y-2.5">
      {items.map((item, index) => (
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

export function CaseDetailView({ page, record, faqLinks }: CaseDetailViewProps) {
  const cover = getCoverImageForPageData(page);
  const { sections } = record;

  const serviceLinks = record.relatedServices.map((slug) => ({
    href: `/services/${slug}`,
    label: getServiceLabel(slug),
  }));

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />

      <PageCoverBanner image={cover} />

      <header>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
            {record.caseCategory}
          </span>
          <span className="rounded-full bg-beige px-3 py-1 text-xs font-medium text-navy-light">
            {record.region}
          </span>
          {record.situationTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-navy/10 bg-cream/60 px-3 py-1 text-xs font-medium text-navy/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="page-title mt-4">{page.h1}</h1>
        <p className="body-text mt-3 max-w-3xl">{page.intro}</p>
        <p className="mt-3 text-sm text-navy/55">
          {formatContentDate(record.date)} · {record.category}
        </p>
      </header>

      <p
        className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3.5 text-sm leading-relaxed text-navy/75"
        role="note"
      >
        {CASE_DISCLAIMER}
      </p>

      {sections.background ? (
        <DetailSection id="case-background" title="사건 배경">
          <p className="body-text whitespace-pre-line">{sections.background}</p>
        </DetailSection>
      ) : null}

      {sections.concerns.length > 0 ? (
        <DetailSection id="case-concerns" title="의뢰인이 처음 걱정한 점">
          <ItemList items={sections.concerns} />
        </DetailSection>
      ) : null}

      {sections.issues.length > 0 ? (
        <DetailSection id="case-issues" title="쟁점">
          <ItemList items={sections.issues} />
        </DetailSection>
      ) : null}

      {sections.documents.length > 0 ? (
        <DetailSection id="case-documents" title="준비서류">
          <ItemList items={sections.documents} />
        </DetailSection>
      ) : null}

      <PageConversionCTA
        pageType="case"
        variant="mid"
        pageSlug={record.slug}
        documentsHref="#case-documents"
      />

      {sections.procedures.length > 0 ? (
        <DetailSection id="case-procedures" title="진행 절차">
          <OrderedList items={sections.procedures} />
        </DetailSection>
      ) : null}

      {sections.outcome ? (
        <DetailSection id="case-outcome" title="결과">
          <p className="rounded-xl border border-beige-dark bg-beige/30 px-4 py-4 text-sm leading-relaxed text-navy/85 md:text-base">
            {sections.outcome}
          </p>
          <p className="mt-3 text-sm text-navy/60">
            위 결과는 해당 사건의 처리 경과를 참고용으로 정리한 것이며, 유사 사례에서도
            보장되지 않습니다.
          </p>
        </DetailSection>
      ) : null}

      {sections.cautions.length > 0 ? (
        <DetailSection id="case-cautions" title="비슷한 상황에서 주의할 점">
          <div className="space-y-3">
            {sections.cautions.map((item) => (
              <p
                key={item}
                className="rounded-xl border border-navy/10 bg-gradient-to-r from-beige/40 to-cream px-4 py-3.5 text-sm leading-relaxed text-navy/85 md:text-base"
              >
                {item}
              </p>
            ))}
          </div>
        </DetailSection>
      ) : null}

      {serviceLinks.length > 0 ? (
        <DetailSection id="case-services" title="관련 서비스">
          <LinkGrid links={serviceLinks} />
        </DetailSection>
      ) : null}

      {faqLinks.length > 0 ? (
        <DetailSection id="case-faqs" title="관련 FAQ">
          <LinkGrid links={faqLinks} />
        </DetailSection>
      ) : null}

      <RelatedRecommendations source={recommendationFromCaseRecord(record)} />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/cases"
          className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
        >
          ← 사례 탐색기
        </Link>
        <Link
          href="/services"
          className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
        >
          업무안내
        </Link>
      </div>

      <div id="consultation">
        <LawyerConsultationGuide
          pageType="case"
          showSecondaryLinks
          pageSlug={record.slug}
          documentsHref="#case-documents"
        />
      </div>
    </article>
  );
}
