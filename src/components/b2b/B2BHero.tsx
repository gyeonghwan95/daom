import Link from "next/link";
import type { TrustItem } from "@/lib/b2b/types";

type B2BHeroProps = {
  eyebrow: string;
  h1: string;
  intro: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  audienceLabels?: string[];
  trustItems?: TrustItem[];
  hideInquiryBadge?: boolean;
};

export function B2BHero({
  eyebrow,
  h1,
  intro,
  primaryCta,
  secondaryCta,
  audienceLabels = [],
  trustItems = [],
  hideInquiryBadge = false,
}: B2BHeroProps) {
  return (
    <header className="b2b-hero space-y-5 border-b border-beige-dark pb-8 md:space-y-6 md:pb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy/55 md:text-sm">
        {eyebrow}
      </p>
      <h1 className="page-title max-w-4xl">{h1}</h1>
      <p className="body-text max-w-3xl text-[0.9375rem] leading-relaxed text-navy/80 md:text-base">
        {intro}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={primaryCta.href}
          className="btn-primary inline-flex min-h-12 items-center px-6"
        >
          {!hideInquiryBadge && !primaryCta.href.startsWith("#") ? (
            <span className="mr-2 rounded bg-white/20 px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wide">
              협업 문의
            </span>
          ) : null}
          {primaryCta.label}
        </Link>
        {secondaryCta.href.startsWith("tel:") ? (
          <a
            href={secondaryCta.href}
            className="btn-secondary inline-flex min-h-12 items-center px-6"
          >
            {secondaryCta.label}
          </a>
        ) : (
          <Link
            href={secondaryCta.href}
            className="btn-secondary inline-flex min-h-12 items-center px-6"
          >
            {secondaryCta.label}
          </Link>
        )}
      </div>
      {audienceLabels.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="대상 유형">
          {audienceLabels.map((label) => (
            <li
              key={label}
              className="rounded-md border border-beige-dark bg-beige/40 px-2.5 py-1 text-xs text-navy/75 md:text-sm"
            >
              {label}
            </li>
          ))}
        </ul>
      ) : null}
      {trustItems.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <li
              key={item.label}
              className="rounded-lg border border-beige-dark/80 bg-white/70 px-3 py-3"
            >
              <p className="text-sm font-semibold text-navy">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-navy/65">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
