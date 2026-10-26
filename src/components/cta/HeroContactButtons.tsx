"use client";

import Link from "next/link";
import { CostInquiryNote } from "@/components/cta/CostInquiryNote";
import { trackCTA } from "@/lib/analytics/track-cta";
import type { NaverSmartPlacePlacement } from "@/lib/naver-smartplace/cta";

type HeroContactButtonsProps = {
  placement: NaverSmartPlacePlacement;
  pageSlug?: string;
  /** 예전 호출부 호환용(결정 카드가 상담 신청을 맡는다) */
  inquiryFallbackHref?: string;
  /** 예전 호출부 호환용(네이버 예약은 결정 카드에 항상 있다) */
  showReservation?: boolean;
  className?: string;
};

function PersonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.6" />
      <path
        d="M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 본문형 페이지 글 시작 부분 — 결정 카드(근거·비용 문의 안내·1분 상담 신청·전화·네이버 예약·지도) 하나로 모은다.
 * 예전에는 PC 채널 줄(톡톡·카카오·문의·예약·후기)과 지도 줄을 따로 두어 같은 선택지가 반복됐다.
 * 그 아래에는 법무사 소개로 이어지는 내부 링크 한 줄만 둔다.
 */
export function HeroContactButtons({
  pageSlug = "",
  className = "",
}: HeroContactButtonsProps) {
  return (
    <div className={className}>
      <CostInquiryNote variant="intro" />
      <Link
        href="/about"
        className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[0.95rem] font-semibold text-navy no-underline md:min-h-0"
        onClick={() => trackCTA("about", pageSlug, "/about")}
      >
        <PersonIcon className="h-4 w-4 shrink-0 text-[#8a7a63]" />
        <span className="underline-offset-4 group-hover:underline">
          안윤정 법무사는 누구일까?
        </span>
        <span aria-hidden className="text-navy/40">
          ›
        </span>
      </Link>
    </div>
  );
}
