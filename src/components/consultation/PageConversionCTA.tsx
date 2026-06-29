"use client";

import Link from "next/link";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { ConversionActionButtons } from "@/components/consultation/ConversionActionButtons";
import {
  resolveConversionCTAConfig,
  type ConversionPageType,
  type ConversionVariant,
} from "@/lib/conversion-cta";
import { trackCTA } from "@/lib/analytics/track-cta";

type PageConversionCTAProps = {
  pageType?: ConversionPageType;
  variant?: ConversionVariant;
  title?: string;
  description?: string;
  hint?: string;
  documentsHref?: string;
  diagnosisHref?: string;
  serviceSlug?: string;
  pageSlug?: string;
  showFeeNotice?: boolean;
  showSecondaryLinks?: boolean;
  tone?: "light" | "dark";
  className?: string;
};

const secondaryLinkClass =
  "interactive-surface inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border-2 border-beige-muted bg-white px-4 text-sm font-semibold text-navy hover:border-navy-light hover:bg-beige sm:min-h-12";

export function PageConversionCTA({
  pageType = "default",
  variant = "mid",
  title,
  description,
  hint,
  documentsHref,
  diagnosisHref,
  serviceSlug,
  pageSlug,
  showFeeNotice,
  showSecondaryLinks = false,
  tone,
  className = "",
}: PageConversionCTAProps) {
  const config = resolveConversionCTAConfig({
    pageType,
    variant,
    title,
    description,
    hint,
    documentsHref,
    diagnosisHref,
    serviceSlug,
  });

  const isBottom = variant === "bottom";
  const theme = tone ?? (isBottom ? "light" : "light");
  const slug = pageSlug ?? pageType;
  const feeNotice = showFeeNotice ?? isBottom;

  const shellClass = isBottom
    ? theme === "dark"
      ? "card-surface bg-navy p-5 text-white sm:p-6 md:p-8 lg:p-10"
      : "overflow-hidden rounded-2xl border border-navy/10 bg-gradient-to-br from-beige/80 via-cream to-white p-5 shadow-[0_8px_32px_rgba(26,39,68,0.06)] sm:p-6 md:p-8"
    : "rounded-2xl border border-beige-dark bg-beige/20 p-5 sm:p-6";

  const titleClass = isBottom
    ? theme === "dark"
      ? "text-lg font-semibold sm:text-xl md:text-2xl"
      : "text-lg font-semibold text-navy sm:text-xl"
    : "text-base font-semibold text-navy sm:text-lg";

  const bodyClass =
    theme === "dark"
      ? "mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base"
      : "mt-2 text-sm leading-relaxed text-navy/75 sm:text-base";

  const hintClass =
    theme === "dark"
      ? "mt-2 text-sm font-medium text-white/75"
      : "mt-2 text-sm font-medium text-navy/65";

  return (
    <aside
      className={`${shellClass} ${className}`.trim()}
      aria-label="상담 안내"
    >
      {!isBottom || theme === "dark" ? null : (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
          Consultation
        </p>
      )}

      <header className={isBottom && theme !== "dark" ? "mt-2 max-w-2xl" : "max-w-2xl"}>
        <h2 className={titleClass}>{config.title}</h2>
        <p className={bodyClass}>{config.description}</p>
        {config.hint ? <p className={hintClass}>{config.hint}</p> : null}
      </header>

      <div className="mt-5">
        <ConversionActionButtons
          documentsHref={config.documentsHref}
          diagnosisHref={config.diagnosisHref}
          theme={theme}
          pageSlug={slug}
        />
      </div>

      {feeNotice ? (
        <ConsultationFeeNotice
          theme={theme === "dark" ? "dark" : "light"}
          className="mt-4"
        />
      ) : null}

      {showSecondaryLinks ? (
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/contact"
            data-cta="contact"
            onClick={() => trackCTA("contact", slug)}
            className={secondaryLinkClass}
          >
            상담 문의
          </Link>
          <Link
            href="/location"
            data-cta="location"
            onClick={() => trackCTA("location", slug)}
            className={secondaryLinkClass}
          >
            오시는 길
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
