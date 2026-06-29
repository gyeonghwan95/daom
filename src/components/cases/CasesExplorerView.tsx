import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { CASE_DISCLAIMER } from "@/lib/cases/types";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import type { CaseRecord } from "@/lib/cases/types";
import { CasesExplorerGrid } from "./CasesExplorerGrid";

type CasesExplorerViewProps = {
  page: PageData;
  cases: CaseRecord[];
};

export function CasesExplorerView({ page, cases }: CasesExplorerViewProps) {
  const cover = getCoverImageForPageData(page);

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          Case Explorer
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <p
        className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3.5 text-sm leading-relaxed text-navy/75"
        role="note"
      >
        {CASE_DISCLAIMER}
      </p>

      <CasesExplorerGrid cases={cases} />

      <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">함께 보면 좋은 안내</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/services", label: "업무안내" },
            { href: "/자가진단", label: "자가진단" },
            { href: "/tools", label: "법률 계산기" },
            { href: "/contact", label: "상담 문의" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="interactive-surface card-surface flex min-h-11 items-center justify-center px-4 py-3 text-sm font-semibold text-navy hover:bg-beige/50"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <DiagnosisFAQ items={page.faqs} />

      <div id="consultation">
        <LawyerConsultationGuide
          pageType="hub"
          title={page.ctaTitle}
          description={page.ctaText}
          showSecondaryLinks
          pageSlug="cases"
        />
      </div>
    </article>
  );
}
