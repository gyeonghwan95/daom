import Link from "next/link";

const NATIONWIDE_HOME_CARDS = [
  {
    href: "/전국상속등기",
    title: "전국 상속등기",
    body: "부동산 소재지가 달라도 관할 특례를 검토합니다.",
  },
  {
    href: "/전국유증등기",
    title: "전국 유증등기",
    body: "유언에 따른 이전 절차를 비대면으로 상담합니다.",
  },
  {
    href: "/여러지역상속부동산등기",
    title: "여러 지역 상속부동산",
    body: "흩어진 부동산을 한 곳에서 목록·일정까지 정리합니다.",
  },
  {
    href: "/전국법인본점이전등기",
    title: "전국 법인 본점이전",
    body: "서울·경기·부산 등 타지역 이전을 관할 확인 후 진행합니다.",
  },
  {
    href: "/전국업무",
    title: "전국 업무 전체 보기",
    body: "관할 특례·비대면 수임 업무를 한눈에 확인합니다.",
  },
] as const;

export function HomeNationwideSection() {
  return (
    <section
      className="home-section mx-auto w-full max-w-6xl px-4 py-10 md:py-14"
      aria-labelledby="home-nationwide-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy/45">
        Nationwide matters
      </p>
      <h2
        id="home-nationwide-heading"
        className="mt-2 text-2xl font-bold text-navy md:text-3xl"
      >
        부산에 사무소가 있어도 전국 의뢰가 가능한 업무가 있습니다
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-navy/75">
        상속·유증등기, 타지역 법인 본점이전, 여러 지역 부동산 공동담보 등은 사건
        구조에 따라 전국에서 상담하고 진행할 수 있습니다. 방문이 어려운 경우
        전화·카카오톡·우편을 활용한 진행 방법을 먼저 안내합니다.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NATIONWIDE_HOME_CARDS.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="flex h-full flex-col rounded-2xl border border-beige-dark bg-white/90 p-4 no-underline shadow-sm transition-colors hover:bg-beige/40"
            >
              <span className="font-semibold text-navy">{card.title}</span>
              <span className="mt-2 text-sm leading-relaxed text-navy/70">
                {card.body}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
