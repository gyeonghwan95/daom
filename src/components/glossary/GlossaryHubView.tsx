import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  GLOSSARY_CATEGORY_LABELS,
  getAllGlossaryTerms,
  type GlossaryCategory,
} from "@/lib/glossary";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type GlossaryHubViewProps = {
  page: PageData;
};

const CATEGORY_ORDER: GlossaryCategory[] = [
  "inheritance",
  "real-estate",
  "rights",
  "civil",
  "rehab",
  "corporate",
  "tax-fee",
];

export function GlossaryHubView({ page }: GlossaryHubViewProps) {
  const cover = getCoverImageForPageData(page);
  const terms = getAllGlossaryTerms();
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    label: GLOSSARY_CATEGORY_LABELS[category],
    terms: terms.filter((t) => t.category === category),
  })).filter((g) => g.terms.length > 0);

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          Legal Glossary
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">이 용어사전으로 할 수 있는 것</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-navy/75">
          <li>· 상속·등기·민사·회생·법인 용어를 한 줄 정의와 쉬운 설명으로 빠르게 이해할 수 있습니다.</li>
          <li>· 각 용어 페이지에서 관련 자가진단·FAQ·사례·업무안내로 바로 이동할 수 있습니다.</li>
          <li>· 용어 이해 후 상담 CTA로 구체적 사건을 검토받을 수 있습니다.</li>
        </ul>
      </section>

      {grouped.map((group) => (
        <section key={group.category} id={`glossary-${group.category}`}>
          <h2 className="section-heading">{group.label}</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.terms.map((term) => (
              <li key={term.slug}>
                <Link
                  href={term.path}
                  className="interactive-surface group flex h-full flex-col rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/30 to-beige/40 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] hover:border-navy/20 hover:shadow-[0_8px_32px_rgba(26,39,68,0.08)] sm:p-6"
                >
                  <h3 className="text-lg font-semibold text-navy group-hover:text-navy-dark">
                    {term.term}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                    {term.cardDescription}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-navy-light group-hover:text-navy">
                    뜻과 절차 보기 →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section id="related-hubs" className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">함께 보면 좋은 안내</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/situations", label: "상황별 법률문제" },
            { href: "/tools", label: "법률 계산기" },
            { href: "/cases", label: "사례 탐색기" },
            { href: "/자가진단", label: "자가진단" },
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
          pageSlug="glossary"
        />
      </div>
    </article>
  );
}
