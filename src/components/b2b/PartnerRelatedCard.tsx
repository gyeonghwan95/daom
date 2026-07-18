import Link from "next/link";

type PartnerRelatedCardProps = {
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
};

/** 기존 서비스 페이지 하단용 소형 협업 안내 카드 */
export function PartnerRelatedCard({
  title,
  description,
  href = "/partners",
  ctaLabel = "협업 안내 보기",
}: PartnerRelatedCardProps) {
  return (
    <aside className="mt-10 rounded-xl border border-beige-dark bg-beige/25 p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
        기업·전문직
      </p>
      <h2 className="mt-2 text-lg font-semibold text-navy">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/75">{description}</p>
      <Link
        href={href}
        className="btn-secondary mt-4 inline-flex min-h-11 items-center px-4 text-sm"
      >
        {ctaLabel}
      </Link>
    </aside>
  );
}
