import Link from "next/link";
import { CaseRegionExplorer } from "@/components/case-regions/CaseRegionExplorer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { RelatedContentGrid } from "@/components/readability";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import { HubChildLinks } from "@/components/seo/HubChildLinks";
import { getAllContent } from "@/lib/content/loader";

/** 공개 사례: slug가 -case면 실제 처리 사례, -consultation이면 개인정보를 빼고 일반화한 상담 사례 */
function getPublishedCases() {
  const all = getAllContent("cases").filter((c) => c.slug !== "_template");
  const sortByDate = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);
  return {
    handled: all.filter((c) => c.slug.endsWith("-case")).sort(sortByDate),
    consulted: all.filter((c) => c.slug.endsWith("-consultation")).sort(sortByDate),
  };
}

export function CaseRegionsHubView({ page }: { page: PageData }) {
  const { handled, consulted } = getPublishedCases();
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
            href: "#case-list",
            title: "실제 업무 사례 바로 보기",
            body: "사무소에서 처리한 사례와 상담 사례를 이 페이지 아래에서 바로 열어 볼 수 있습니다.",
          },
          {
            href: "/업무사례/지역별",
            title: "지역별 업무 사례",
            body: "부산 구·군·동·생활권·법원 인근의 지역 안내입니다(처리 사례와는 별도).",
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

      <section id="case-list" aria-labelledby="case-list-heading" className="scroll-mt-[calc(var(--header-height)+1rem)] space-y-6">
        <h2 id="case-list-heading" className="section-heading">
          실제 업무 사례
        </h2>
        <CaseList
          title="사무소에서 처리한 사례"
          note="실제 진행한 사건을 개인정보를 빼고 정리했습니다. 결과는 사건마다 달라질 수 있습니다."
          items={handled}
        />
        <CaseList
          title="상담 사례"
          note="상담에서 자주 나오는 상황을 개인정보를 빼고 일반화한 사례입니다."
          items={consulted}
        />
      </section>
    </article>
  );
}

function CaseList({
  title,
  note,
  items,
}: {
  title: string;
  note: string;
  items: { href: string; slug: string; title: string; description: string; category: string }[];
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-lg font-bold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-navy/65">{note}</p>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {items.map((c) => (
          <li key={c.slug}>
            <Link
              href={c.href}
              className="flex h-full flex-col rounded-2xl border border-beige-dark bg-white p-4 no-underline transition-colors hover:border-navy/25 hover:bg-beige/20"
              data-case-card={c.slug}
            >
              <span className="text-xs font-semibold text-navy-light">{c.category}</span>
              <span className="mt-1 text-base font-semibold leading-snug text-navy">{c.title}</span>
              <span className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-navy/70">{c.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
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

      <HubChildLinks path={page.path} />

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
