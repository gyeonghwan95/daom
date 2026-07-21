import Link from "next/link";
import { CaseRegionExplorer } from "@/components/case-regions/CaseRegionExplorer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { RelatedContentGrid } from "@/components/readability";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

export function CaseRegionsHubView({ page }: { page: PageData }) {
  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/50">
          Case guides
        </p>
        <h1 className="page-title">{page.h1}</h1>
        <p className="body-text max-w-3xl text-navy/80">{page.intro}</p>
      </header>

      <ul className="grid gap-4 md:grid-cols-3">
        {[
          {
            href: "/cases",
            title: "전체 업무 사례",
            body: "카테고리·상황·지역으로 정리된 실무 사례를 탐색합니다.",
          },
          {
            href: "/업무사례/지역별",
            title: "지역별 업무 사례",
            body: "부산 구·군·동·생활권·법원 인근 안내를 검색합니다.",
          },
          {
            href: "/업무사례/업무별",
            title: "업무별 업무 사례",
            body: "상속·부동산·법인·회생 등 업무 유형으로 연결합니다.",
          },
        ].map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="flex h-full flex-col rounded-2xl border border-beige-dark bg-white p-5 no-underline shadow-sm transition-colors hover:bg-beige/30"
            >
              <span className="text-base font-semibold text-navy">
                {card.title}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-navy/70">
                {card.body}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function CaseRegionsByAreaView({ page }: { page: PageData }) {
  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <header className="space-y-3">
        <h1 className="page-title">{page.h1}</h1>
        <p className="body-text max-w-3xl text-navy/80">{page.intro}</p>
      </header>

      <CaseRegionExplorer />

      <section>
        <h2 className="section-heading">자주 묻는 질문</h2>
        <div className="mt-4">
          <FAQAccordion items={page.faqs} />
        </div>
      </section>
    </article>
  );
}

export function CaseRegionsByServiceView({ page }: { page: PageData }) {
  const links = page.sections[0]?.links ?? [];

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <header className="space-y-3">
        <h1 className="page-title">{page.h1}</h1>
        <p className="body-text max-w-3xl text-navy/80">{page.intro}</p>
      </header>

      <section>
        <h2 className="section-heading">업무 유형</h2>
        <div className="mt-4">
          <RelatedContentGrid links={links} />
        </div>
        <p className="mt-6 text-sm text-navy/65">
          지역까지 함께 보려면{" "}
          <Link href="/업무사례/지역별" className="underline">
            지역별 업무 사례
          </Link>
          에서 구·군·동을 검색하세요.
        </p>
      </section>

      <section>
        <h2 className="section-heading">자주 묻는 질문</h2>
        <div className="mt-4">
          <FAQAccordion items={page.faqs} />
        </div>
      </section>
    </article>
  );
}
