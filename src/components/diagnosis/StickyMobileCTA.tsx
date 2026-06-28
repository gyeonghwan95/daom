"use client";

import Link from "next/link";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { trackCTA, type CTAType } from "@/lib/analytics/track-cta";
import { KakaoIcon, PhoneIcon } from "@/components/consultation/ConsultationIcons";

type StickyMobileCTAProps = {
  visible?: boolean;
  pageSlug?: string;
};

function handleCtaClick(type: CTAType, pageSlug: string) {
  trackCTA(type, pageSlug);
}

export function StickyMobileCTA({
  visible = true,
  pageSlug = "자가진단",
}: StickyMobileCTAProps) {
  if (!visible) return null;

  const { phone, kakao } = getContactInfo();

  return (
    <div
      className="diagnosis-sticky-cta fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      role="region"
      aria-label="모바일 상담 바로가기"
    >
      <div className="mx-auto max-w-lg px-3 pt-2">
        <div className="flex gap-2 rounded-2xl border border-navy/10 bg-white/95 p-2 shadow-[0_-8px_32px_rgba(26,39,68,0.12)] backdrop-blur-md">
          {phone ? (
            <a
              href={getPhoneHref(phone)}
              data-cta="phone"
              onClick={() => handleCtaClick("phone", pageSlug)}
              className="diagnosis-sticky-cta__btn diagnosis-sticky-cta__btn--phone"
            >
              <PhoneIcon className="h-4 w-4 shrink-0" />
              전화
            </a>
          ) : null}
          {kakao ? (
            <a
              href={kakao}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="kakao"
              onClick={() => handleCtaClick("kakao", pageSlug)}
              className="diagnosis-sticky-cta__btn diagnosis-sticky-cta__btn--kakao"
            >
              <KakaoIcon className="h-4 w-4 shrink-0" />
              카카오톡
            </a>
          ) : null}
          <Link
            href="/contact"
            data-cta="contact"
            onClick={() => handleCtaClick("contact", pageSlug)}
            className="diagnosis-sticky-cta__btn diagnosis-sticky-cta__btn--contact"
          >
            상담 문의
          </Link>
        </div>
      </div>
    </div>
  );
}
