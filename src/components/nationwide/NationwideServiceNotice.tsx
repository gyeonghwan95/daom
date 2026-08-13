import {
  getNationwideNotice,
  type NationwideServiceType,
} from "@/lib/nationwide";

type NationwideServiceNoticeProps = {
  type: NationwideServiceType;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function NationwideServiceNotice({
  type,
  ctaLabel,
  ctaHref,
  className = "",
}: NationwideServiceNoticeProps) {
  const notice = getNationwideNotice(type, { ctaLabel, ctaHref });

  return (
    <aside
      className={`rounded-xl border border-beige-dark border-l-4 border-l-navy bg-white p-4 md:p-5 ${className}`}
      aria-label="전국 의뢰 안내"
    >
      <p className="inline-flex items-center rounded-md bg-navy px-2.5 py-1 text-xs font-semibold tracking-wide text-white">
        {notice.badge}
      </p>
      <h2 className="mt-3 text-lg font-bold leading-snug text-[var(--text-primary)] md:text-xl">
        {notice.title}
      </h2>
      <div className="mt-3 space-y-2 text-[1.015rem] leading-[1.7] text-[var(--text-body)] md:text-base">
        {notice.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <p>
          관할·서류 조건이 맞으면 방문 없이도 끝까지 진행할 수 있습니다. 현재
          상황만 남겨 주시면 바로 안내해 드립니다.
        </p>
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-3">
        {notice.steps.map((step, index) => (
          <li
            key={step}
            className="rounded-lg border border-beige-dark bg-[var(--surface-muted)] px-3 py-2.5 text-sm text-[var(--text-body)]"
          >
            <span className="block text-xs font-bold text-[var(--text-muted)]">
              {index + 1}단계
            </span>
            <span className="mt-1 block leading-snug font-medium">{step}</span>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
        {notice.caution}
      </p>
    </aside>
  );
}
