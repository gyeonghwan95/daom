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
import { getContactInfo, getNaverBlogUrl } from "@/lib/contact";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { NAVER_BLOG_MORE_POSTS_LABEL } from "@/lib/naver-blog/more-posts-cta";
import {
  isNaverSmartPlaceConfigured,
  resolveNaverSmartPlaceHref,
  type NaverSmartPlaceVariant,
} from "@/lib/naver-smartplace/cta";

const PLACEMENT = "homepage_hero" as const;

function PersonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path
        d="m12 3.6 2.5 5.1 5.6.8-4.05 3.95.95 5.6L12 16.4l-5 2.65.95-5.6L3.9 9.5l5.6-.8L12 3.6Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg className="home-hero__guide-chevron" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 메인 첫 화면 좌측 패널의 연락·안내.
 * - 상담 연결(PC·태블릿만): 1분만에 문의하기(대표) + 네이버 톡톡·카카오톡·네이버예약.
 *   전화는 패널 아래 번호 줄과 모바일 하단 바에서 안내한다.
 *   모바일은 하단 고정 상담 바가 같은 역할을 하므로 숨긴다.
 * - 안내 목록(모든 화면): 안윤정 법무사는 누구일까? · 네이버 지도 · 블로그 · 네이버 후기·사진
 */
export function HomeHeroChannels() {
  const { kakao, naverTalk } = getContactInfo();
  const naverOn = isNaverSmartPlaceConfigured();
  const track = (kind: string, href?: string) => trackCTA(`home-hero-${kind}`, "/", href);

  const place = (variant: NaverSmartPlaceVariant) => {
    const href = resolveNaverSmartPlaceHref(variant);
    return {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      "data-cta": "naver-place",
      "data-cta-variant": variant,
      "data-cta-placement": PLACEMENT,
      onClick: () => trackNaverPlaceClick({ variant, placement: PLACEMENT, href }),
    } as const;
  };

  const quick: ReactNode[] = [];
  if (naverTalk) {
    quick.push(
      <a
        key="talk"
        href={naverTalk}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="naver-talk"
        className="home-hero__chip"
        onClick={() => track("naver-talk", naverTalk)}
      >
        <span className="home-hero__chip-icon home-hero__chip-icon--naver" aria-hidden>
          <NaverIcon className="h-3.5 w-3.5" />
        </span>
        <span>네이버 톡톡</span>
        <span className="sr-only"> (새 창)</span>
      </a>,
    );
  }
  if (kakao) {
    quick.push(
      <a
        key="kakao"
        href={kakao}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="kakao"
        className="home-hero__chip"
        onClick={() => track("kakao", kakao)}
      >
        <span className="home-hero__chip-icon home-hero__chip-icon--kakao" aria-hidden>
          <KakaoIcon className="h-4 w-4" />
        </span>
        <span>카카오톡</span>
        <span className="sr-only"> (새 창)</span>
      </a>,
    );
  }
  if (naverOn) {
    quick.push(
      <a
        key="reservation"
        {...place("reservation")}
        aria-label="네이버예약 — 네이버 플레이스 예약 (새 창)"
        className="home-hero__chip"
      >
        <span className="home-hero__chip-icon home-hero__chip-icon--naver" aria-hidden>
          <NaverIcon className="h-3.5 w-3.5" />
        </span>
        <span>네이버예약</span>
      </a>,
    );
  }

  return (
    <div className="home-hero__channels">
      <div className="home-hero__contact">
        <InquiryStartButton
          className="home-hero__primary"
          source="inline"
          note="메인 첫 화면 1분만에 문의하기"
        >
          <span className="home-hero__primary-icon" aria-hidden>
            <FormIcon className="h-5 w-5" />
          </span>
          <span className="home-hero__primary-text">
            <span className="home-hero__primary-title">{consultationInquiryCopy.ctaShort}</span>
            <span className="home-hero__primary-sub">상황만 남기시면 필요한 순서부터 정리해 드립니다</span>
          </span>
          <span className="home-hero__primary-arrow" aria-hidden>
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M4 10h11m-4-4.5L15.5 10 11 14.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </InquiryStartButton>
        {quick.length > 0 ? (
          <ul className="home-hero__chips" aria-label="상담 연결">
            {quick.map((node, i) => (
              <li key={i}>{node}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <ul className="home-hero__guide-list" aria-label="사무소·법무사 안내">
        <li>
          <Link href="/about" className="home-hero__guide" onClick={() => track("about", "/about")}>
            <span className="home-hero__guide-icon home-hero__guide-icon--about" aria-hidden>
              <PersonIcon className="h-4 w-4" />
            </span>
            <span className="home-hero__guide-text">안윤정 법무사는 누구일까?</span>
            <Chevron />
          </Link>
        </li>
        {naverOn ? (
          <li>
            <a {...place("map")} aria-label="네이버 지도에서 사무소 위치 확인 (새 창)" className="home-hero__guide">
              <span className="home-hero__guide-icon home-hero__guide-icon--map" aria-hidden>
                <LocationIcon className="h-4 w-4" />
              </span>
              <span className="home-hero__guide-text">네이버 지도에서 사무소 위치 확인</span>
              <Chevron />
            </a>
          </li>
        ) : null}
        <li>
          <a
            href={getNaverBlogUrl()}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="naver-blog-more"
            className="home-hero__guide"
            onClick={() => track("blog", getNaverBlogUrl())}
          >
            <span className="home-hero__guide-icon home-hero__guide-icon--naver" aria-hidden>
              <NaverIcon className="h-3 w-3" />
            </span>
            <span className="home-hero__guide-text">{NAVER_BLOG_MORE_POSTS_LABEL}</span>
            <span className="sr-only"> (새 창)</span>
            <Chevron />
          </a>
        </li>
        {naverOn ? (
          <li>
            <a
              {...place("review")}
              aria-label="네이버 후기·사진 — 네이버 플레이스 리뷰 (새 창)"
              className="home-hero__guide"
            >
              <span className="home-hero__guide-icon home-hero__guide-icon--review" aria-hidden>
                <StarIcon className="h-4 w-4" />
              </span>
              <span className="home-hero__guide-text">네이버 후기·사진</span>
              <Chevron />
            </a>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
