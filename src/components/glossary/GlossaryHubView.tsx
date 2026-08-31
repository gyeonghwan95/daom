import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { GlossaryExplorer, type GlossarySearchItem } from "@/components/glossary/GlossaryExplorer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  GLOSSARY_CATEGORY_LABELS,
  getAllGlossaryTerms,
  isGlossaryDiscoverable,
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

function toSearchItem(
  term: ReturnType<typeof getAllGlossaryTerms>[number],
): GlossarySearchItem {
  return {
    slug: term.slug,
    path: term.path,
    term: term.term,
    category: term.category,
    categoryLabel: GLOSSARY_CATEGORY_LABELS[term.category],
    cardDescription: term.cardDescription,
    oneLineDefinition: term.oneLineDefinition,
    discoverable: isGlossaryDiscoverable(term.slug),
  };
}

export function GlossaryHubView({ page }: GlossaryHubViewProps) {
  const cover = getCoverImageForPageData(page);
  const terms = getAllGlossaryTerms();
  const searchItems = terms.map(toSearchItem);

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    label: GLOSSARY_CATEGORY_LABELS[category],
    terms: searchItems.filter((t) => t.category === category && t.discoverable),
  })).filter((g) => g.terms.length > 0);

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          용어 안내
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <section className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">이 목록의 역할</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-navy/75">
          <li>· 업무 중에 나오는 용어를 짧게 구분합니다.</li>
          <li>· 신청·등기·기한·서류의 대표 안내는 각 업무 페이지입니다.</li>
          <li>· 지금 할 일을 상황으로 찾으려면 상황별 안내를 먼저 보세요.</li>
        </ul>
      </section>

      <GlossaryExplorer groups={grouped} allTerms={searchItems} />

      <section id="related-hubs" className="rounded-2xl border border-beige-dark bg-beige/25 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-navy sm:text-lg">함께 보면 좋은 안내</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/situations", label: "상황별 법률문제" },
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
          pageSlug="glossary"
        />
      </div>
    </article>
  );
}
