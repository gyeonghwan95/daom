"use client";

import Link from "next/link";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import {
  FormIcon,
  KakaoIcon,
  LocationIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { trackCTA } from "@/lib/analytics/track-cta";
import { trackNaverPlaceClick } from "@/lib/admin-ops/track-client";
import { getContactInfo, getNaverBlogUrl, getPhoneHref } from "@/lib/contact";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";
import { NAVER_BLOG_MORE_POSTS_LABEL } from "@/lib/naver-blog/more-posts-cta";
import {
  isNaverSmartPlaceConfigured,
  resolveNaverSmartPlaceHref,
  type NaverSmartPlaceVariant,
} from "@/lib/naver-smartplace/cta";

const PLACEMENT = "homepage_hero" as const;

function PersonIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 메인 첫 화면 좌측 패널의 연락·안내 버튼.
 * 1열(상담 연결 6개, 3×2 타일): 네이버 톡톡 · 카카오톡 · 전화상담 / 1분만에 문의하기 · 네이버예약 · 네이버 후기·사진
 * 2열(안내 3개, 목록): 안윤정 법무사는 누구일까? · 네이버 지도에서 사무소 위치 확인 · 블로그에서 더 많은 글 보기
 * 모바일·PC 모두 3열 타일이라 순서가 왼쪽→오른쪽, 위→아래로 같다.
 */
export function HomeHeroChannels() {
  const { phone, kakao, naverTalk } = getContactInfo();
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

  return (
    <div className="home-hero__channels">
      <ul className="home-hero__channel-grid" aria-label="상담 연결">
        {naverTalk ? (
          <li>
            <a
              href={naverTalk}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="naver-talk"
              className="home-hero__channel home-hero__channel--talk"
              onClick={() => track("naver-talk", naverTalk)}
            >
              <NaverIcon className="home-hero__channel-icon" />
              <span>네이버 톡톡</span>
              <span className="sr-only"> (새 창)</span>
            </a>
          </li>
        ) : null}
        {kakao ? (
          <li>
            <a
              href={kakao}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="kakao"
              className="home-hero__channel home-hero__channel--kakao"
              onClick={() => track("kakao", kakao)}
            >
              <KakaoIcon className="home-hero__channel-icon" />
              <span>카카오톡</span>
              <span className="sr-only"> (새 창)</span>
            </a>
          </li>
        ) : null}
        {phone ? (
          <li>
            <a
              href={getPhoneHref(phone)}
              data-cta="phone"
              aria-label={`전화상담 ${phone}`}
              className="home-hero__channel home-hero__channel--phone"
              onClick={() => track("phone")}
            >
              <PhoneIcon className="home-hero__channel-icon" />
              <span>전화상담</span>
            </a>
          </li>
        ) : null}
        <li>
          <InquiryStartButton
            className="home-hero__channel home-hero__channel--inquiry"
            source="inline"
            note="메인 첫 화면 1분만에 문의하기"
          >
            <FormIcon className="home-hero__channel-icon" />
            <span>{consultationInquiryCopy.ctaShort}</span>
          </InquiryStartButton>
        </li>
        {naverOn ? (
          <>
            <li>
              <a
                {...place("reservation")}
                aria-label="네이버예약 — 네이버 플레이스 예약 (새 창)"
                className="home-hero__channel home-hero__channel--reservation"
              >
                <NaverIcon className="home-hero__channel-icon" />
                <span>네이버예약</span>
              </a>
            </li>
            <li>
              <a
                {...place("review")}
                aria-label="네이버 후기·사진 — 네이버 플레이스 리뷰 (새 창)"
                className="home-hero__channel home-hero__channel--review"
              >
                <NaverIcon className="home-hero__channel-icon" />
                <span>네이버 후기·사진</span>
              </a>
            </li>
          </>
        ) : null}
      </ul>

      <ul className="home-hero__guide-list" aria-label="사무소·법무사 안내">
        <li>
          <Link href="/about" className="home-hero__guide" onClick={() => track("about", "/about")}>
            <PersonIcon className="home-hero__guide-icon" />
            <span>안윤정 법무사는 누구일까?</span>
          </Link>
        </li>
        {naverOn ? (
          <li>
            <a
              {...place("map")}
              aria-label="네이버 지도에서 사무소 위치 확인 (새 창)"
              className="home-hero__guide"
            >
              <LocationIcon className="home-hero__guide-icon" />
              <span>네이버 지도에서 사무소 위치 확인</span>
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
            <span className="home-hero__guide-badge" aria-hidden>
              <NaverIcon className="h-3 w-3" />
            </span>
            <span>{NAVER_BLOG_MORE_POSTS_LABEL}</span>
            <span className="sr-only"> (새 창)</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
