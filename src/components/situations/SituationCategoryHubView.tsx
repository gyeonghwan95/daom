import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  getSituationCategoryById,
  getSituationsByCategory,
  type SituationCategoryId,
} from "@/lib/situations";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type SituationCategoryHubViewProps = {
  page: PageData;
  categoryId: SituationCategoryId;
};

export function SituationCategoryHubView({
  page,
  categoryId,
}: SituationCategoryHubViewProps) {
  const cover = getCoverImageForPageData(page);
  const category = getSituationCategoryById(categoryId);
  const pages = getSituationsByCategory(categoryId);

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          {category.shortLabel} · 상황별 안내
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">대표적인 고민</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-navy/75 sm:text-base">
          {category.representativeConcerns.map((concern) => (
            <li key={concern}>· {concern}</li>
          ))}
        </ul>
      </section>

      <section id="category-situations">
        <h2 className="section-heading">{category.label} 안내 목록</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
          아래에서 지금 상황과 가장 가까운 항목을 선택하세요.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {pages.map((situation) => (
            <li key={situation.slug}>
              <Link
                href={situation.path}
                className="interactive-surface group flex h-full flex-col rounded-2xl border border-navy/10 bg-gradient-to-br from-white via-cream/30 to-beige/40 p-5 shadow-[0_4px_24px_rgba(26,39,68,0.05)] hover:border-navy/20 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {situation.urgent ? (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                      긴급
                    </span>
                  ) : null}
                  {situation.isNew ? (
                    <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy">
                      NEW
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-navy group-hover:text-navy-dark">
                  {situation.cardTitle}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">
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

      <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">다른 분류 보기</h2>
        <p className="mt-2 text-sm text-navy/70">
          <Link href="/situations" className="font-semibold text-navy-light hover:text-navy">
            상황별 법률문제 전체 허브
          </Link>
          에서 다른 분류와 검색도 이용할 수 있습니다.
        </p>
      </section>

      <DiagnosisFAQ items={page.faqs} />

      <div id="consultation">
        <LawyerConsultationGuide
          pageType="hub"
          title={page.ctaTitle}
          description={page.ctaText}
          showSecondaryLinks
          pageSlug={`situations-${category.id}`}
        />
      </div>
    </article>
  );
}
