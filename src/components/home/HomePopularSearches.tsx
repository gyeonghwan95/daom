import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { BUSAN_DISTRICT_HUBS } from "@/lib/geo/busan-district-hubs";

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
          description="상담·선택 기준·자가진단·업무 사례·협업 안내로 바로 이동합니다. 구·군은 아래 생활권 안내에서 고르시면 됩니다."
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
        <div className="mt-10 rounded-2xl border border-beige-dark bg-cream/20 px-5 py-6 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-light">
                구·군별 안내
              </p>
              <h3 className="mt-1 text-lg font-semibold text-navy">
                구·군별 생활권 안내
              </h3>
              <p className="mt-1 text-sm text-navy/65">
                거주지나 부동산·법인 소재지에 맞는 안내입니다. 사무소는 해운대
                센텀에 있고, 해당 구에 있어야만 진행되는 것은 아닙니다. 관할
                등기소와 사무소 위치는 별도로 확인하시면 됩니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/busan-legal-map"
                className="inline-flex min-h-10 items-center rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-medium text-navy no-underline hover:bg-beige/50"
              >
                부산 법률지도
              </Link>
              <Link
                href="/등기관할과사무소위치"
                className="inline-flex min-h-10 items-center rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-medium text-navy no-underline hover:bg-beige/50"
              >
                등기 관할·사무소 위치
              </Link>
            </div>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUSAN_DISTRICT_HUBS.map((hub) => (
              <li key={hub.href}>
                <Link
                  href={hub.href}
                  className="interactive-surface flex min-h-[4.25rem] flex-col justify-center rounded-xl border border-beige-dark bg-white px-3 py-2.5 no-underline hover:border-navy/20 hover:bg-beige/40"
                >
                  <span className="text-sm font-semibold text-navy">
                    {hub.label}
                  </span>
                  <span className="mt-0.5 text-xs text-navy/60">{hub.hint}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
