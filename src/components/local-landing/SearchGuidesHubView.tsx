import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { PageContainer } from "@/components/layout/PageContainer";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/readability";
import {
  getSearchGuideEntriesByCategory,
} from "@/lib/local-landing/search-intent";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

export function SearchGuidesHubView() {
  const groups = getSearchGuideEntriesByCategory();
  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: "상황별 안내" },
  ];

  return (
    <PageContainer>
      <article className="content-stack">
        <Breadcrumb items={breadcrumbs} />
        <BreadcrumbJsonLd items={breadcrumbs} currentPath="/search-guides" />

        <PageHero
          h1="상황별로 확인할 안내"
          eyebrow="상담 전 체크포인트"
          intro="추천·비용·서류·기한처럼 상담 전에 자주 묻는 주제를 모았습니다. 이미 있는 안내는 그대로 연결하고, 아직 없는 주제만 추가로 정리합니다."
          ctaLabel={consultationInquiryCopy.ctaShort}
          showDiagnosisCta={false}
          showAboutLawyerCta
        >
          <p className="mt-3 text-sm text-navy/65">
            URL에 ‘전문’이 포함된 기존 주소는 유지하되, 화면 문구는 실무·절차 안내로
            정리합니다. 전문 자격·인증을 단정하지 않습니다.
          </p>
        </PageHero>

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
                ? "이미 있는 안내와 추가로 정리한 주제를 함께 모았습니다."
                : "주제별 상담 전 안내입니다."}
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
                      <span className="mt-1 text-xs text-navy/45">추가 안내</span>
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
