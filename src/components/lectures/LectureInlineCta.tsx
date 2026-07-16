import Link from "next/link";

type LectureInlineCtaProps = {
  title: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

/** 중간·하단 전환용 짧은 CTA 블록 */
export function LectureInlineCta({
  title,
  text,
  primaryLabel = "강의 일정 문의하기",
  primaryHref = "/강의문의",
  secondaryLabel,
  secondaryHref,
}: LectureInlineCtaProps) {
  return (
    <aside className="rounded-2xl border border-navy/15 bg-navy px-5 py-6 text-white md:px-7 md:py-7">
      <p className="text-lg font-semibold tracking-tight md:text-xl">{title}</p>
      {text ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
          {text}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={primaryHref}
          className="inline-flex min-h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-navy no-underline hover:bg-cream"
        >
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link
            href={secondaryHref}
            className="inline-flex min-h-11 items-center rounded-lg border border-white/35 px-4 text-sm font-medium text-white no-underline hover:bg-white/10"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
