"use client";

import type { ReactNode } from "react";
import {
  KakaoIcon,
  NaverIcon,
} from "@/components/consultation/ConsultationIcons";
import { trackCTA } from "@/lib/analytics/track-cta";
import { getContactInfo, getPhoneHref } from "@/lib/contact";

/**
 * 비용 문의 안내 — 본문형 페이지 공통(서두: HeroContactButtons, 말미: MainContactPhone).
 * 광고 배너처럼 보이지 않게 '안내 메모' 형태로 두고, 문장 속 채널 이름(전화·네이버 톡톡·카카오톡)을 바로 연결한다.
 * 본문 흐름과 구분되는 보조 정보라 <aside>로 감싼다. 클릭은 trackCTA(cost_intro / cost_outro)로 집계한다.
 */

type Variant = "intro" | "outro";

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path
        d="M5 4.5h3l1.5 4-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 클릭 시점의 경로(서버 렌더와 무관하게 이벤트에서만 읽는다) */
function currentSlug(): string {
  if (typeof window === "undefined") return "";
  try {
    return decodeURIComponent(window.location.pathname);
  } catch {
    return window.location.pathname;
  }
}

/** 문장 속 채널 링크 */
function InlineChannel({
  href,
  external,
  kind,
  placement,
  children,
}: {
  href: string;
  external: boolean;
  kind: string;
  placement: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-cta={kind}
      data-cta-placement={placement}
      onClick={() => trackCTA(kind, currentSlug(), href)}
      className="font-semibold text-navy underline decoration-[#c9a86a] decoration-2 underline-offset-[5px] transition-colors hover:decoration-navy"
    >
      {children}
      {external ? <span className="sr-only"> (새 창)</span> : null}
    </a>
  );
}

export function CostInquiryNote({
  variant,
  className = "",
}: {
  variant: Variant;
  className?: string;
}) {
  const { phone, kakao, naverTalk } = getContactInfo();
  const placement = variant === "intro" ? "cost_intro" : "cost_outro";
  const phoneHref = getPhoneHref(phone);

  if (variant === "intro") {
    return (
      <aside
        aria-label="비용 문의 안내"
        className={`rounded-r-xl border-l-[3px] border-[#c9a86a] bg-[var(--surface-muted)]/70 px-4 py-3 text-[0.95rem] leading-relaxed text-navy/85 md:px-5 ${className}`.trim()}
      >
        혼자 비용을 예상하며 고민하지 않으셔도 됩니다.{" "}
        <InlineChannel
          href={phoneHref}
          external={false}
          kind="phone"
          placement={placement}
        >
          전화
        </InlineChannel>
        ·
        <InlineChannel
          href={naverTalk}
          external
          kind="naver-talk"
          placement={placement}
        >
          네이버 톡톡
        </InlineChannel>
        ·
        <InlineChannel href={kakao} external kind="kakao" placement={placement}>
          카카오톡
        </InlineChannel>
        으로{" "}
        <strong className="font-semibold text-navy">
          “이 경우 얼마인가요?”
        </strong>
        라고 먼저 물어보세요. 상황을 확인한 뒤 예상 비용을 안내해 드리겠습니다.
      </aside>
    );
  }

  const chip =
    "flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-beige-dark bg-white px-2 text-[0.8125rem] font-semibold text-navy no-underline shadow-[0_1px_2px_rgba(21,42,69,0.05)] transition-colors hover:border-navy/30 hover:bg-cream sm:min-h-11 sm:gap-2 sm:px-3 sm:text-sm";

  return (
    <aside
      aria-label="비용 문의 안내"
      className={`rounded-2xl border border-beige-dark bg-[var(--surface-muted)]/60 px-5 py-5 md:px-6 ${className}`.trim()}
    >
      <p className="text-[0.95rem] leading-relaxed text-navy/85 md:text-base">
        <strong className="font-semibold text-navy">
          맡길지 결정하기 전에, 비용부터 물어보셔도 됩니다.
        </strong>{" "}
        지금 전화·네이버 톡톡·카카오톡으로 상황을 한두 줄만 알려주세요. 확인이
        필요한 내용과 예상 비용을 안내해 드리겠습니다.
      </p>
      <ul
        className="mt-4 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3"
        aria-label="비용 문의 연결"
      >
        <li>
          <a
            href={phoneHref}
            data-cta="phone"
            data-cta-placement={placement}
            onClick={() => trackCTA("phone", currentSlug(), phoneHref)}
            className={chip}
          >
            <PhoneIcon className="h-4 w-4 shrink-0 text-[#8a7a63]" />
            전화
          </a>
        </li>
        <li>
          <a
            href={naverTalk}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="naver-talk"
            data-cta-placement={placement}
            onClick={() => trackCTA("naver-talk", currentSlug(), naverTalk)}
            className={chip}
          >
            <NaverIcon className="h-3.5 w-3.5 shrink-0 text-[#03C75A]" />
            <span className="whitespace-nowrap">네이버 톡톡</span>
            <span className="sr-only"> (새 창)</span>
          </a>
        </li>
        <li>
          <a
            href={kakao}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="kakao"
            data-cta-placement={placement}
            onClick={() => trackCTA("kakao", currentSlug(), kakao)}
            className={chip}
          >
            <span
              className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FEE500] text-[#191919]"
              aria-hidden
            >
              <KakaoIcon className="h-2.5 w-2.5" />
            </span>
            카카오톡
            <span className="sr-only"> (새 창)</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}
