import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { PageContainer } from "@/components/layout/PageContainer";
import { CTASection } from "@/components/sections/CTASection";
import {
  getSearchGuideEntriesByCategory,
} from "@/lib/local-landing/search-intent";

export function SearchGuidesHubView() {
  const groups = getSearchGuideEntriesByCategory();
  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: "검색의도 안내" },
  ];

  return (
    <PageContainer>
      <article className="space-y-10 md:space-y-14">
        <Breadcrumb items={breadcrumbs} />
        <BreadcrumbJsonLd items={breadcrumbs} currentPath="/search-guides" />

        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
            Search Intent Hub
          </p>
          <h1 className="page-title mt-2">검색의도 SEO 안내</h1>
          <p className="body-text mt-4 md:mt-5">
            업무명만이 아니라, 실제 고객이 검색하는 추천·비용·서류·기한·공공기관·건축주
            키워드까지 상담 전 체크포인트로 정리했습니다. 기존에 있는 페이지는 URL을
            유지한 채 연결하고, 새로운 검색의도만 추가로 안내합니다.
          </p>
          <p className="mt-3 text-sm text-navy/65">
            URL에 ‘전문’이 포함된 기존 주소는 유지하되, 화면 문구는 실무·절차 안내로
            정리합니다. 전문 자격·인증을 단정하지 않습니다.
          </p>
        </header>

        <nav aria-label="카테고리 바로가기">
          <ul className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <li key={group.category}>
                <a
                  href={`#guide-${group.category}`}
                  className="inline-flex min-h-10 items-center rounded-full border border-beige-dark bg-cream/40 px-3 text-sm font-medium text-navy hover:border-navy/20 hover:bg-beige/50"
                >
                  {group.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {groups.map((group) => (
          <section
            key={group.category}
            id={`guide-${group.category}`}
            className="scroll-mt-24"
          >
            <h2 className="section-heading">{group.label}</h2>
            <p className="mt-2 text-sm text-navy/60">
              {group.entries.filter((e) => e.existing).length > 0
                ? "기존 페이지와 신규 검색의도 페이지를 함께 모았습니다."
                : "검색 키워드별 랜딩 안내입니다."}
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.entries.map((entry) => (
                <li key={`${entry.href}-${entry.label}`}>
                  <Link
                    href={entry.href}
                    className="interactive-surface flex min-h-[4.75rem] flex-col justify-center rounded-2xl border border-beige-dark bg-white px-4 py-3 no-underline hover:border-navy/20 hover:bg-beige/30"
                  >
                    <span className="font-semibold text-navy">{entry.label}</span>
                    {entry.existing ? (
                      <span className="mt-1 text-xs text-navy/45">기존 안내 페이지</span>
                    ) : (
                      <span className="mt-1 text-xs text-navy/45">검색의도 가이드</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <CTASection
          pageType="faq"
          title="검색 키워드로 찾기 어려우신가요?"
          description="상황·서류를 말씀해 주시면 맞는 안내 페이지와 상담 순서를 안내해 드립니다."
          pageSlug="search-guides"
        />
      </article>
    </PageContainer>
  );
}
