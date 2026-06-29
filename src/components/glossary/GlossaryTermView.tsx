import Link from "next/link";
import { PageConversionCTA } from "@/components/consultation/PageConversionCTA";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import { recommendationFromGlossaryTerm } from "@/lib/internal-links";
import { getGlossaryTermBySlug } from "@/lib/glossary";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import type { PageData } from "@/lib/pageData/types";

type GlossaryTermViewProps = {
  page: PageData;
  slug: string;
};

function LinkGrid({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold text-navy sm:text-lg">{title}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="interactive-surface card-surface flex min-h-11 items-center px-4 py-3 text-sm font-semibold text-navy hover:bg-beige/50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GlossaryTermView({ page, slug }: GlossaryTermViewProps) {
  const term = getGlossaryTermBySlug(slug);
  const cover = getCoverImageForPageData(page);

  if (!term) return null;

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          Legal Glossary
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5 text-lg font-medium text-navy">
          {term.oneLineDefinition}
        </p>
      </header>

      <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">쉽게 풀어쓴 설명</h2>
        <p className="mt-3 text-sm leading-relaxed text-navy/80 sm:text-base">
          {term.plainExplanation}
        </p>
      </section>

      <PageConversionCTA
        pageType="glossary"
        variant="mid"
        pageSlug={slug}
        diagnosisHref={term.diagnosisLinks[0]?.href ?? "/자가진단"}
      />

      <section className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">언제 문제가 되는지</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-navy/75">
          {term.whenItMatters.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </section>

      <section
        id="glossary-checks"
        className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-6"
      >
        <h2 className="text-base font-semibold text-navy sm:text-lg">준비서류 또는 확인사항</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-navy/75">
          {term.checks.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </section>

      <LinkGrid title="관련 자가진단" links={term.diagnosisLinks} />
      <LinkGrid title="관련 서비스" links={term.serviceLinks} />
      <LinkGrid title="관련 FAQ" links={term.faqLinks} />
      <LinkGrid title="관련 사례" links={term.caseLinks} />

      <RelatedRecommendations source={recommendationFromGlossaryTerm(term)} />

      <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/glossary"
            className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
          >
            ← 법률 용어사전 목록
          </Link>
          <Link
            href="/situations"
            className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
          >
            상황별 법률문제
          </Link>
        </div>
      </section>

      <DiagnosisFAQ items={page.faqs} />

      <div id="consultation">
        <LawyerConsultationGuide
          pageType="glossary"
          title={page.ctaTitle}
          description={page.ctaText}
          showSecondaryLinks
          pageSlug={slug}
          diagnosisHref={term.diagnosisLinks[0]?.href ?? "/자가진단"}
        />
      </div>
    </article>
  );
}
