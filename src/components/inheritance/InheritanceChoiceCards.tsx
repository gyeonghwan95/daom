import Link from "next/link";

const CHOICES = [
  {
    href: "/부산상속등기",
    title: "부동산을 상속받아야 함",
    hint: "명의이전·서류·등기소 안내",
  },
  {
    href: "/부산상속포기",
    title: "빚이 많아 상속을 받지 않으려 함",
    hint: "3개월 기한·후순위 효과",
  },
  {
    href: "/부산한정승인",
    title: "재산은 남기고 채무만 제한하고 싶음",
    hint: "한정승인 절차 안내",
  },
  {
    href: "/사망자재산채무조회",
    title: "재산과 채무를 아직 모름",
    hint: "조회부터 확인",
  },
  {
    href: "/사망후3개월지난상속",
    title: "사망 후 3개월이 지남",
    hint: "특별한정승인 검토",
  },
] as const;

/** 첫 화면 선택 UI — 키워드 반복이 아니라 상황 분기. */
export function InheritanceChoiceCards() {
  return (
    <nav
      aria-label="상속 절차 선택"
      className="rounded-xl border border-beige-dark bg-[var(--surface-muted)] p-4 sm:p-5"
    >
      <p className="text-xs font-semibold tracking-wide text-navy/65">
        지금 상황에 가까운 안내
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {CHOICES.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-lg border border-beige-dark bg-white px-3 py-3 text-navy no-underline transition-colors hover:border-navy/30"
            >
              <span className="block text-sm font-semibold">{item.title}</span>
              <span className="mt-1 block text-xs text-navy/70">{item.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
