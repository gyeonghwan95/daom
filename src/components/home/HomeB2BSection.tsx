import Link from "next/link";

export function HomeB2BSection() {
  return (
    <section
      className="home-b2b-section mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-12"
      aria-labelledby="home-b2b-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy/50">
        Business & Professional Collaboration
      </p>
      <h2
        id="home-b2b-heading"
        className="mt-2 text-xl font-semibold text-navy md:text-2xl"
      >
        전문직·기업·기관 협업이 필요하신가요?
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
        부산 현지 등기, 법무사 복대리, 부동산·건축 협업, 신축건물 보존등기와
        여러 건의 프로젝트는 일반 상담과 구분해 업무 범위부터 확인합니다.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/부산법무사복대리", title: "법무사·전문직 협업" },
          { href: "/부산부동산협력법무사", title: "부동산·건축 협업" },
          { href: "/부산집단등기", title: "시행사·집단등기" },
          { href: "/공공기관등기업무", title: "기업·기관 등기" },
        ].map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="flex min-h-16 items-center rounded-xl border border-beige-dark bg-white px-4 py-3 text-sm font-semibold text-navy transition-colors hover:bg-beige/40"
            >
              {card.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/partners"
          className="btn-primary inline-flex min-h-11 items-center px-5 text-sm"
        >
          협업문의 전체 보기
        </Link>
        <Link
          href="/협업문의"
          className="btn-secondary inline-flex min-h-11 items-center px-5 text-sm"
        >
          협업 문의서 작성
        </Link>
      </div>
    </section>
  );
}
