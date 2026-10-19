import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { PageSerpCarousel } from "@/components/carousel/PageSerpCarousel";

const POPULAR_SEARCH_CARDS = [
  {
    href: "/부산법무사상담",
    label: "부산 법무사 상담",
    hint: "전화·카카오톡·예약 방문",
  },
  {
    href: "/부산법무사추천",
    label: "부산 법무사 추천",
    hint: "상담 전 확인할 7가지 기준",
  },
  {
    href: "/부산법무사",
    label: "다옴법무사사무소 업무 안내",
    hint: "상속·등기·법인·공탁 업무별 안내",
  },
  {
    href: "/부산상속법무사",
    label: "부산 상속 법무사",
    hint: "등기·포기·한정승인 먼저 확인",
  },
  {
    href: "/부산상속등기",
    label: "부산 상속등기 법무사",
    hint: "명의이전 서류와 진행 순서",
  },
  {
    href: "/부산상속포기",
    label: "부산 상속포기 법무사",
    hint: "3개월·후순위·단순승인 위험",
  },
  {
    href: "/부산한정승인",
    label: "부산 한정승인 법무사",
    hint: "상속받은 재산 한도에서 빚 변제",
  },
  {
    href: "/부산공탁",
    label: "부산 공탁",
    hint: "변제·형사·집행 공탁 절차",
  },
  {
    href: "/부산부동산등기",
    label: "부산 부동산등기",
    hint: "매매·증여·말소 등기",
  },
  {
    href: "/부산법인설립등기",
    label: "부산 법인설립 법무사",
    hint: "새 회사의 정관·임원·자본금 준비",
  },
  {
    href: "/부산법인법무사",
    label: "부산 법인 법무사",
    hint: "운영 중 법인의 변경·해산까지",
  },
  {
    href: "/부산개인회생법무사",
    label: "부산 개인회생 법무사",
    hint: "회생·파산 절차 안내",
  },
  {
    href: "/해운대법무사",
    label: "해운대 법무사",
    hint: "센텀 사무소 생활권 안내",
  },
  {
    href: "/센텀법무사",
    label: "센텀 법무사",
    hint: "해운대 센텀 업무지구",
  },
  {
    href: "/연제구법무사",
    label: "연제구 법무사",
    hint: "연산·거제·등기국 인근",
  },
  {
    href: "/busan-legal-map",
    label: "부산 법률지도",
    hint: "구·군·동 안내로 이동",
  },
  {
    href: "/about",
    label: "안윤정 법무사 소개",
    hint: "경력·활동·언론",
  },
] as const;

export function HomePopularSearches() {
  return (
    <section
      id="home-popular-searches"
      className="relative w-full border-t border-beige-dark bg-white py-14 md:py-20"
    >
      <Container>
        <div className="mb-12">
          <PageSerpCarousel path="/" className="mt-0" />
        </div>
        <HomeSectionHeader
          label="Quick links"
          title="바로 찾는 안내"
          description="상담·선택 기준·상속·공탁·등기·법인·회생 안내로 바로 이동합니다. 구·군·동은 부산 법률지도에서 고르시면 됩니다."
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
