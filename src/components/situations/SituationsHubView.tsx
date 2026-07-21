import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import {
  SituationExplorer,
  type SituationSearchItem,
} from "@/components/situations/SituationExplorer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  getAllSituationPages,
  getPopularSituations,
  getRecentSituations,
  getSituationCategoryById,
  getUrgentSituations,
  SITUATION_CATEGORY_ORDER,
  SITUATION_CATEGORY_LABELS,
} from "@/lib/situations";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type SituationsHubViewProps = {
  page: PageData;
};

function toSearchItem(
  situation: ReturnType<typeof getAllSituationPages>[number],
): SituationSearchItem {
  return {
    slug: situation.slug,
    path: situation.path,
    cardTitle: situation.cardTitle,
    cardDescription: situation.cardDescription,
    searchIntent: situation.searchIntent,
    situationCategory: situation.situationCategory,
    categoryLabel: SITUATION_CATEGORY_LABELS[situation.situationCategory],
    urgent: situation.urgent,
    isNew: situation.isNew,
    priority: situation.priority,
  };
}

export function SituationsHubView({ page }: SituationsHubViewProps) {
  const cover = getCoverImageForPageData(page);
  const situations = getAllSituationPages();
  const searchItems = situations.map(toSearchItem);

  const grouped = SITUATION_CATEGORY_ORDER.map((categoryId) => {
    const category = getSituationCategoryById(categoryId);
    return {
      category: categoryId,
      label: category.label,
      categoryPath: category.path,
      items: searchItems.filter((item) => item.situationCategory === categoryId),
    };
  }).filter((group) => group.items.length > 0);

  const urgentItems = getUrgentSituations(6).map(toSearchItem);
  const popularItems = getPopularSituations(8).map(toSearchItem);
  const recentItems = getRecentSituations(6).map(toSearchItem);

  return (
    <article className="content-stack">
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

      <section aria-label="분류별 안내">
        <h2 className="section-heading">분류별로 찾기</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
          법률 업무명을 몰라도 괜찮습니다. 지금 처한 상황과 가까운 분류를
          선택하세요.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITUATION_CATEGORY_ORDER.map((categoryId) => {
            const category = getSituationCategoryById(categoryId);
            const count = situations.filter(
              (item) => item.situationCategory === categoryId,
            ).length;
            return (
              <li key={categoryId}>
                <Link
                  href={category.path}
                  className="interactive-surface group flex h-full flex-col rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/30 to-beige/40 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] hover:border-navy/20 sm:p-6"
                >
                  <h3 className="text-lg font-semibold text-navy group-hover:text-navy-dark">
                    {category.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">
                    {category.description}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-navy-light group-hover:text-navy">
                    {count}개 안내 · 분류 허브 →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <SituationExplorer
        groups={grouped}
        urgentItems={urgentItems}
        popularItems={popularItems}
        recentItems={recentItems}
      />

      <section id="related-hubs" className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">함께 보면 좋은 안내</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/자가진단", label: "업무별 자가진단" },
            { href: "/glossary", label: "법률용어사전" },
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
