"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import {
  FormIcon,
  KakaoIcon,
  LocationIcon,
  NaverIcon,
} from "@/components/consultation/ConsultationIcons";
import { trackCTA } from "@/lib/analytics/track-cta";
import { trackNaverPlaceClick } from "@/lib/admin-ops/track-client";
import { getContactInfo } from "@/lib/contact";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import {
  isNaverSmartPlaceConfigured,
  resolveNaverSmartPlaceHref,
  type NaverSmartPlacePlacement,
  type NaverSmartPlaceVariant,
} from "@/lib/naver-smartplace/cta";

type HeroContactButtonsProps = {
  placement: NaverSmartPlacePlacement;
  pageSlug?: string;
  /** 1분만에 문의하기: 문의 창을 열 수 없을 때 이동할 주소 */
  inquiryFallbackHref?: string;
  /** 네이버 예약 표시(기본 true) */
  showReservation?: boolean;
  className?: string;
};

function PersonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6" strokeLinecap="round" />
    </svg>
  );
}

const linkClass =
  "inline-flex min-h-9 items-center gap-1.5 rounded-md px-1.5 text-sm font-medium text-navy/80 no-underline transition-colors hover:text-navy hover:underline underline-offset-4";

function Sep(): ReactNode {
  return (
    <li aria-hidden className="select-none px-0.5 text-navy/25">
      ·
    </li>
  );
}

/**
 * 본문형 페이지 글 시작 부분의 상담·안내 링크(광고처럼 보이지 않게 색 버튼 대신 글자 링크).
 * 1행(PC만): 네이버 톡톡 · 카카오톡 · 1분만에 문의하기 · 네이버 예약 · 네이버 후기
 *   — 모바일은 하단 고정 상담 바가 같은 역할을 하므로 숨긴다.
 * 2행(PC·모바일): 안윤정 법무사는 누구일까? · 네이버 지도에서 사무소 위치 확인
 */
export function HeroContactButtons({
  placement,
  pageSlug = "",
  inquiryFallbackHref,
  showReservation = true,
  className = "",
}: HeroContactButtonsProps) {
  const { kakao, naverTalk } = getContactInfo();
  const naverOn = isNaverSmartPlaceConfigured();
  const track = (kind: string, href?: string) => trackCTA(kind, pageSlug, href);

  const place = (variant: NaverSmartPlaceVariant) => {
    const href = resolveNaverSmartPlaceHref(variant);
    return {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      "data-cta": "naver-place",
      "data-cta-variant": variant,
      "data-cta-placement": placement,
      onClick: () => trackNaverPlaceClick({ variant, placement, href }),
    } as const;
  };

  const contacts: ReactNode[] = [];
  if (naverTalk) {
    contacts.push(
      <a
        key="talk"
        href={naverTalk}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="naver-talk"
        className={linkClass}
        onClick={() => track("naver-talk", naverTalk)}
      >
        <NaverIcon className="h-3.5 w-3.5 text-[#03C75A]" />
        네이버 톡톡
        <span className="sr-only"> (새 창)</span>
      </a>,
    );
  }
  if (kakao) {
    contacts.push(
      <a
        key="kakao"
        href={kakao}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="kakao"
        className={linkClass}
        onClick={() => track("kakao", kakao)}
      >
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FEE500] text-[#191919]" aria-hidden>
          <KakaoIcon className="h-2.5 w-2.5" />
        </span>
        카카오톡
        <span className="sr-only"> (새 창)</span>
      </a>,
    );
  }
  contacts.push(
    <InquiryStartButton
      key="inquiry"
      source="landing"
      fallbackHref={inquiryFallbackHref}
      pageSlug={pageSlug || undefined}
      className={`${linkClass} cursor-pointer border-0 bg-transparent`}
    >
      <FormIcon className="h-3.5 w-3.5 text-navy/70" />
      {consultationInquiryCopy.ctaShort}
    </InquiryStartButton>,
  );
  if (naverOn && showReservation) {
    contacts.push(
      <a key="reservation" {...place("reservation")} aria-label="네이버 예약 (새 창)" className={linkClass}>
        <NaverIcon className="h-3.5 w-3.5 text-[#03C75A]" />
        네이버 예약
      </a>,
    );
  }
  if (naverOn) {
    contacts.push(
      <a key="review" {...place("review")} aria-label="네이버 후기 — 네이버 플레이스 리뷰 (새 창)" className={linkClass}>
        <NaverIcon className="h-3.5 w-3.5 text-[#03C75A]" />
        네이버 후기
      </a>,
    );
  }

  const guideClass =
    "group flex min-h-11 items-center gap-2.5 py-2 text-[0.95rem] font-semibold text-navy no-underline md:min-h-0 md:py-1";

  return (
    <div className={`border-t border-beige-dark/80 pt-3 ${className}`.trim()}>
      <div className="hidden flex-wrap items-center gap-x-2 gap-y-1 md:flex">
        <span className="pr-1 text-xs font-semibold tracking-wide text-navy/50">바로 문의</span>
        <ul className="flex flex-wrap items-center" aria-label="상담 연결">
          {contacts.flatMap((node, i) => [
            ...(i > 0 ? [<Sep key={`sep-${i}`} />] : []),
            <li key={`item-${i}`}>{node}</li>,
          ])}
        </ul>
      </div>

      <ul
        className="flex flex-col divide-y divide-beige-dark/70 md:mt-2 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:divide-y-0"
        aria-label="사무소·법무사 안내"
      >
        <li>
          <Link href="/about" className={guideClass} onClick={() => track("about", "/about")}>
            <PersonIcon className="h-4 w-4 shrink-0 text-[#8a7a63]" />
            <span className="underline-offset-4 group-hover:underline">안윤정 법무사는 누구일까?</span>
            <span aria-hidden className="ml-auto pl-1 text-navy/40 md:ml-0">›</span>
          </Link>
        </li>
        {naverOn ? (
          <li>
            <a {...place("map")} aria-label="네이버 지도에서 사무소 위치 확인 (새 창)" className={guideClass}>
              <LocationIcon className="h-4 w-4 shrink-0 text-[#8a7a63]" />
              <span className="underline-offset-4 group-hover:underline">네이버 지도에서 사무소 위치 확인</span>
              <span aria-hidden className="ml-auto pl-1 text-navy/40 md:ml-0">›</span>
            </a>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
