import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";

const POPULAR_SEARCH_CARDS = [
  {
    href: "/부산법무사추천",
    label: "부산 법무사 추천",
    hint: "상담 전 선택 기준",
  },
  {
    href: "/부산등기법무사추천",
    label: "부산 등기 법무사",
    hint: "등기 업무별 확인",
  },
  {
    href: "/부산상속등기전문",
    label: "부산 상속등기 상담",
    hint: "절차·서류·기한",
  },
  {
    href: "/부산부동산등기전문",
    label: "부산 부동산등기 상담",
    hint: "매매·말소·이전",
  },
  {
    href: "/부산법인등기전문",
    label: "부산 법인등기 상담",
    hint: "설립·임원·본점",
  },
  {
    href: "/부산법무사비용",
    label: "부산 법무사 비용",
    hint: "수임료·공과금 구분",
  },
] as const;

export function HomePopularSearches() {
  return (
    <section
      id="home-popular-searches"
      className="relative w-full border-t border-beige-dark bg-white py-14 md:py-20"
    >
      <Container>
        <HomeSectionHeader
          label="Popular searches"
          title="많이 찾는 검색어"
          description="추천·비용·상담·업무별 안내 페이지로 바로 이동할 수 있습니다."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_SEARCH_CARDS.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="interactive-surface flex min-h-[5.5rem] flex-col justify-center rounded-2xl border border-beige-dark bg-cream/30 px-5 py-4 no-underline hover:border-navy/20 hover:bg-beige/40"
              >
                <span className="text-base font-semibold text-navy md:text-lg">
                  {card.label}
                </span>
                <span className="mt-1 text-sm text-navy/65">{card.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
