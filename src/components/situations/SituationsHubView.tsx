import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { getAllSituationPages } from "@/lib/situations";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type SituationsHubViewProps = {
  page: PageData;
};

export function SituationsHubView({ page }: SituationsHubViewProps) {
  const cover = getCoverImageForPageData(page);
  const situations = getAllSituationPages();

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          Legal Situations
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <section id="situation-cards">
        <h2 className="section-heading">상황별 안내</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/65 sm:text-base">
          지금 겪고 계신 문제에 가까운 카드를 선택하세요. 각 페이지에서 체크리스트·서류·절차·관련 링크를 확인할 수 있습니다.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {situations.map((situation) => (
            <li key={situation.slug}>
              <Link
                href={situation.path}
                className="interactive-surface group flex h-full flex-col rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/30 to-beige/40 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] hover:border-navy/20 hover:shadow-[0_8px_32px_rgba(26,39,68,0.08)] sm:p-6"
              >
                <h3 className="text-lg font-semibold text-navy group-hover:text-navy-dark">
                  {situation.cardTitle}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                  {situation.cardDescription}
                </p>
                <span className="mt-4 text-sm font-semibold text-navy-light group-hover:text-navy">
                  안내 보기 →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="related-hubs" className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">함께 보면 좋은 안내</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/자가진단", label: "업무별 자가진단" },
            { href: "/services", label: "업무안내" },
            { href: "/faq", label: "FAQ" },
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
          pageSlug="situations"
        />
      </div>
    </article>
  );
}
