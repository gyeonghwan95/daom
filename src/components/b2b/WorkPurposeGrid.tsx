import Link from "next/link";

export type WorkPurposeCard = {
  id: string;
  title: string;
  href: string;
};

export const WORK_PURPOSE_CARDS: WorkPurposeCard[] = [
  { id: "delegation", title: "부산 복대리", href: "/부산법무사복대리" },
  {
    id: "receipt",
    title: "현지 접수·보정",
    href: "/부산등기접수협업",
  },
  {
    id: "balance",
    title: "잔금일 등기 협업",
    href: "/부산잔금등기협업",
  },
  {
    id: "preservation",
    title: "신축건물 보존등기",
    href: "/부산신축건물보존등기",
  },
  { id: "bulk", title: "집단·대량등기", href: "/부산집단등기" },
  { id: "sale", title: "분양등기", href: "/부산분양등기" },
  {
    id: "corporate",
    title: "반복 법인등기",
    href: "/부산법인등기아웃소싱",
  },
  {
    id: "public",
    title: "공공기관 등기업무",
    href: "/공공기관등기업무",
  },
  { id: "trust", title: "신탁·담보 관련 등기", href: "/부산신탁등기" },
  {
    id: "special",
    title: "특수 부동산등기",
    href: "/특수등기의뢰",
  },
  {
    id: "quote",
    title: "견적·제안 검토",
    href: "/협업문의?type=quote",
  },
  {
    id: "unsure",
    title: "아직 잘 모르겠음",
    href: "/협업문의?partner=other",
  },
];

export function WorkPurposeGrid({
  cards = WORK_PURPOSE_CARDS,
}: {
  cards?: WorkPurposeCard[];
}) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <li key={card.id}>
          <Link
            href={card.href}
            className="flex min-h-12 items-center rounded-xl border border-beige-dark bg-white px-4 py-3 text-sm font-medium text-navy no-underline transition-colors hover:bg-beige/40"
          >
            {card.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
