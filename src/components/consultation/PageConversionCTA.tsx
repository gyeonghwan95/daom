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
  /** false면 전화·카카오·톡톡 등 채널 그리드 대신 상담 문의 버튼만 표시 */
  showChannelButtons?: boolean;
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
  showChannelButtons = true,
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
      ? "rounded-xl bg-navy p-5 text-white sm:p-6 md:p-8"
      : "rounded-xl border border-beige-dark border-l-4 border-l-navy bg-white p-5 sm:p-6 md:p-8"
    : "rounded-xl border border-beige-dark bg-[var(--surface-muted)] p-5 sm:p-6";

  const titleClass = isBottom
    ? theme === "dark"
      ? "text-lg font-bold sm:text-xl md:text-2xl"
      : "text-lg font-bold text-[var(--text-primary)] sm:text-xl"
    : "text-base font-bold text-[var(--text-primary)] sm:text-lg";

  const bodyClass =
    theme === "dark"
      ? "mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base"
      : "mt-2 text-[1.015rem] leading-[1.7] text-[var(--text-secondary)] sm:text-base";

  const hintClass =
    theme === "dark"
      ? "mt-2 text-sm font-medium text-white/80"
      : "mt-2 text-sm font-medium text-[var(--text-muted)]";

  const primaryBtnClass =
    theme === "dark"
      ? "btn-primary inline-flex min-h-12 w-full items-center justify-center bg-white px-6 text-navy hover:bg-beige sm:w-auto"
      : "btn-primary inline-flex min-h-12 w-full items-center justify-center px-6 sm:w-auto";

  return (
    <aside
      className={`${shellClass} ${className}`.trim()}
      aria-label="상담 안내"
    >
      {!isBottom || theme === "dark" ? null : (
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          상담 안내
        </p>
      )}

      <header className={isBottom && theme !== "dark" ? "mt-2 max-w-2xl" : "max-w-2xl"}>
        <h2 className={titleClass}>{config.title}</h2>
        <p className={bodyClass}>{config.description}</p>
        {config.hint ? <p className={hintClass}>{config.hint}</p> : null}
      </header>

      <div className="mt-5">
        {showChannelButtons ? (
          <ConversionActionButtons
            documentsHref={config.documentsHref}
            diagnosisHref={config.diagnosisHref}
            theme={theme}
            pageSlug={slug}
          />
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              data-cta="contact"
              onClick={() => trackCTA("contact", slug)}
              className={primaryBtnClass}
            >
              상담 문의하기
            </Link>
            <Link
              href="/contact/inquiry"
              data-cta="contact"
              onClick={() => trackCTA("contact", slug)}
              className={
                theme === "dark"
                  ? "inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-white/40 px-6 text-sm font-semibold text-white hover:bg-white/10"
                  : "btn-secondary inline-flex min-h-12 items-center justify-center px-6"
              }
            >
              상담 신청서 작성
            </Link>
          </div>
        )}
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
