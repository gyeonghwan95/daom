"use client";

import Link from "next/link";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { trackCTA } from "@/lib/analytics/track-cta";

/**
 * 본문 상단 상담 안내 — 첫 상담 링크가 본문 깊숙이 있던 페이지용(문의 폼 + 전화 두 버튼만).
 * from 파라미터로 유입 위치를 남겨 문의 효과를 측정한다.
 */
export function EarlyConsultCta({ slug, message }: { slug: string; message?: string }) {
  const { phone } = getContactInfo();
  const inquiryHref = `/contact/inquiry?from=${encodeURIComponent(`${slug}-early`)}`;
  return (
    <div
      className="mt-5 flex flex-col gap-3 rounded-xl border border-beige-dark bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
      data-early-consult=""
    >
      <p className="text-sm leading-relaxed text-navy/85 md:text-base">
        {message ?? "서류가 없어도 지금 상황만 알려 주시면 필요한 절차부터 정리해 드립니다."}
      </p>
      <div className="flex shrink-0 gap-2">
        <Link
          href={inquiryHref}
          data-cta="inquiry"
          data-cta-placement="early"
          onClick={() => trackCTA("inquiry", slug, inquiryHref)}
          className="btn-primary inline-flex min-h-11 items-center justify-center px-4 text-sm"
        >
          1분 문의하기
        </Link>
        {phone ? (
          <a
            href={getPhoneHref(phone)}
            data-cta="phone"
            data-cta-placement="early"
            onClick={() => trackCTA("phone", slug, getPhoneHref(phone))}
            className="btn-secondary inline-flex min-h-11 items-center justify-center px-4 text-sm"
          >
            전화 {phone}
          </a>
        ) : null}
      </div>
    </div>
  );
}
