"use client";

import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { consultationCopy } from "@/lib/consultation";
import {
  getDirectConsultationChannels,
  type ConsultationChannel,
} from "@/lib/contact";
import { trackCTA, type CTAType } from "@/lib/analytics/track-cta";

type LawyerConsultationGuideProps = {
  title?: string;
  description?: string;
  hint?: string;
  channels?: ConsultationChannel[];
  showFeeNotice?: boolean;
  showSecondaryLinks?: boolean;
  compact?: boolean;
  className?: string;
  pageSlug?: string;
};

const secondaryLinkClass =
  "interactive-surface inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border-2 border-beige-muted bg-white px-4 text-sm font-semibold text-navy hover:border-navy-light hover:bg-beige sm:min-h-12";

function handleSecondaryClick(type: CTAType, pageSlug: string) {
  trackCTA(type, pageSlug);
}

export function LawyerConsultationGuide({
  title = "법무사 상담 안내",
  description = consultationCopy.default,
  hint = "전화 · 카카오톡 · 네이버 톡톡 중 편한 방법을 선택해 주세요.",
  channels = getDirectConsultationChannels(),
  showFeeNotice = true,
  showSecondaryLinks = false,
  compact = false,
  className = "",
  pageSlug,
}: LawyerConsultationGuideProps) {
  const slug = pageSlug ?? "consultation";

  return (
    <aside
      className={`lawyer-consultation-guide overflow-hidden rounded-2xl border border-navy/10 bg-gradient-to-br from-beige/80 via-cream to-white shadow-[0_8px_32px_rgba(26,39,68,0.06)] ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6 md:p-8"
      } ${className}`.trim()}
      aria-label="법무사 상담 안내"
    >
      {!compact ? (
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
            Consultation
          </p>
          <h2 className="mt-2 text-lg font-semibold text-navy sm:text-xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/75 sm:text-base">
            {description}
          </p>
          {hint ? (
            <p className="mt-2 text-sm font-medium text-navy/70">{hint}</p>
          ) : null}
        </header>
      ) : null}

      <div className={compact ? "" : "mt-6"}>
        <ConsultationButtons
          channels={channels}
          theme="light"
          layout="grid"
          pageSlug={pageSlug}
        />
      </div>

      {showFeeNotice && !compact ? (
        <ConsultationFeeNotice className="mt-4" />
      ) : null}

      {showSecondaryLinks ? (
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/contact"
            data-cta="contact"
            onClick={() => handleSecondaryClick("contact", slug)}
            className={secondaryLinkClass}
          >
            상담 문의
          </Link>
          <Link
            href="/location"
            data-cta="location"
            onClick={() => handleSecondaryClick("location", slug)}
            className={secondaryLinkClass}
          >
            오시는 길
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
