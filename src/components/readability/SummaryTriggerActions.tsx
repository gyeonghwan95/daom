"use client";

import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { trackCTA } from "@/lib/analytics/track-cta";
import { getContactInfo, getPhoneHref } from "@/lib/contact";

function currentSlug(): string {
  if (typeof window === "undefined") return "";
  try {
    return decodeURIComponent(window.location.pathname);
  } catch {
    return window.location.pathname;
  }
}

/** 핵심 요약 "혼자 진행하면 막히기 쉬운 경우" 아래 — 상황을 바로 물어보는 버튼 + 전화 */
export function SummaryTriggerActions() {
  const { phone } = getContactInfo();
  const phoneHref = getPhoneHref(phone);
  return (
    <div className="article-summary__triggers-actions">
      <InquiryStartButton
        source="landing"
        note="핵심 요약 — 혼자 진행하면 막히기 쉬운 경우"
        className="article-summary__triggers-primary"
        onClick={() => trackCTA("contact", currentSlug(), "#summary-triggers")}
      >
        이 상황, 1분만에 물어보기
      </InquiryStartButton>
      <a
        href={phoneHref}
        data-cta="phone"
        data-cta-placement="summary_triggers"
        onClick={() => trackCTA("phone", currentSlug(), phoneHref)}
        className="article-summary__triggers-phone"
        aria-label={`전화 상담 ${phone}`}
      >
        전화 {phone}
      </a>
    </div>
  );
}
