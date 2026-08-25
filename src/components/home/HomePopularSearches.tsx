import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";

const POPULAR_SEARCH_CARDS = [
  {
    href: "/",
    label: "부산 법무사",
    hint: "다옴법무사사무소 · 안윤정 법무사",
  },
  {
    href: "/부산법무사추천",
    label: "부산 법무사 추천",
    hint: "사무소 선택 기준·상담 전 확인",
  },
  {
    href: "/부산법무사상담",
    label: "부산 법무사 상담",
    hint: "전화·카카오톡·예약 방문",
  },
  {
    href: "/자가진단",
    label: "업무별 자가진단",
    hint: "상속·등기·회생 자가점검",
  },
  {
    href: "/업무사례",
    label: "업무 사례",
    hint: "지역·업무별 실무 사례",
  },
  {
    href: "/법률강의",
    label: "법률 강의·특강",
    hint: "기관·시민 법률교육",
  },
  {
    href: "/partners",
    label: "협업문의",
    hint: "복대리·집단등기·기업 협업",
  },
  {
    href: "/부산법무사",
    label: "부산에서 법무사 찾을 때",
    hint: "업무·비용·선택 기준 안내",
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
          label="Quick links"
          title="바로 찾는 안내"
          description="상담·선택 기준·자가진단·업무 사례·협업 안내로 바로 이동합니다."
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
