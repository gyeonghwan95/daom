"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  LocationIcon,
  NaverIcon,
} from "@/components/consultation/ConsultationIcons";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { trackCTA } from "@/lib/analytics/track-cta";
import { trackNaverPlaceClick } from "@/lib/admin-ops/track-client";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import {
  isNaverSmartPlaceConfigured,
  resolveNaverSmartPlaceHref,
  type NaverSmartPlacePlacement,
  type NaverSmartPlaceVariant,
} from "@/lib/naver-smartplace/cta";
import {
  pickShortReviewQuote,
  REVIEW_TOTAL,
} from "@/lib/naver-place-reviews/static-quotes";

/**
 * 비용 문의 안내 — 본문형 페이지 공통(서두: HeroContactButtons·PageHero 등, 말미: MainContactPhone).
 *
 * 서두(intro)는 "결정 카드"다. 정보를 찾으러 온 방문자가 첫 화면 근처에서
 *  ① 맡길 근거(실제 방문자 후기·대표 직접 진행·협회장 표창) ② 비용 걱정을 덜어 주는 안내(문구 고정)
 *  ③ 가장 먼저 누를 하나의 행동(1분 상담 신청) ④ 네이버 예약·지도
 * 를 한 번에 보게 한다. 말미(outro)는 같은 채널 버튼이 바로 위 신뢰 블록과 겹치지 않도록 문장 속 링크로만 둔다.
 * 클릭은 trackCTA(cost_intro / cost_outro)·trackNaverPlaceClick(decision_card)으로 집계한다.
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

function StarIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 1.8l2.5 5.1 5.6.8-4.1 4 1 5.6L10 14.6l-5 2.7 1-5.6-4.1-4 5.6-.8L10 1.8z" />
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

/** 네이버 스마트플레이스 링크(예약·지도·후기) */
function PlaceLink({
  variant,
  label,
  icon,
  placement = "decision_card",
}: {
  variant: NaverSmartPlaceVariant;
  label: string;
  icon: ReactNode;
  placement?: NaverSmartPlacePlacement;
}) {
  const href = resolveNaverSmartPlaceHref(variant);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="naver-place"
      data-cta-variant={variant}
      data-cta-placement={placement}
      onClick={() => trackNaverPlaceClick({ variant, placement, href })}
      className="inline-flex min-h-10 items-center gap-1.5 text-[0.85rem] font-semibold text-navy/80 no-underline underline-offset-4 transition-colors hover:text-navy hover:underline"
    >
      {icon}
      {label}
      <span className="sr-only"> (새 창)</span>
    </a>
  );
}

/** 비용 문의 고정 문구 — 서두 */
function IntroMessage({ placement }: { placement: string }) {
  const { phone, kakao, naverTalk } = getContactInfo();
  const phoneHref = getPhoneHref(phone);
  return (
    <p className="text-[0.95rem] leading-relaxed text-navy/85">
      혼자 비용을 예상하며 고민하지 않으셔도 됩니다.{" "}
      <InlineChannel href={phoneHref} external={false} kind="phone" placement={placement}>
        전화
      </InlineChannel>
      ·
      <InlineChannel href={naverTalk} external kind="naver-talk" placement={placement}>
        네이버 톡톡
      </InlineChannel>
      ·
      <InlineChannel href={kakao} external kind="kakao" placement={placement}>
        카카오톡
      </InlineChannel>
      으로 <strong className="font-semibold text-navy">“이 경우 얼마인가요?”</strong>
      라고 먼저 물어보세요. 상황을 확인한 뒤 예상 비용을 안내해 드리겠습니다.
    </p>
  );
}

function DecisionCard({ className }: { className: string }) {
  const pathname = usePathname() ?? "/";
  const { phone } = getContactInfo();
  const phoneHref = getPhoneHref(phone);
  const quote = pickShortReviewQuote(pathname);
  const naverOn = isNaverSmartPlaceConfigured();
  const placement = "cost_intro";

  return (
    <aside
      aria-label="상담 안내"
      data-decision-card
      className={`decision-card ${className}`.trim()}
    >
      {/* ① 맡길 근거 — 후기 수는 H1 아래 신뢰 띠와 아래 '후기 보기' 링크에 있으므로 여기선 진행 방식·표창만 */}
      <ul className="decision-card__proof" aria-label="맡기기 전 확인할 근거">
        <li>대표 법무사가 처음부터 직접 진행</li>
        <li>대한법무사협회장 표창</li>
      </ul>

      {quote ? (
        <figure className="decision-card__quote">
          <blockquote>
            <p>“{quote.excerpt}”</p>
          </blockquote>
          <figcaption>네이버 방문자 후기</figcaption>
        </figure>
      ) : null}

      {/* ② 비용 걱정 — 고정 문구 */}
      <div className="decision-card__cost">
        <IntroMessage placement={placement} />
      </div>

      {/* ③ 가장 먼저 누를 하나의 행동 + 전화 */}
      <div className="decision-card__actions">
        <InquiryStartButton
          source="landing"
          pageSlug={pathname}
          note="결정 카드에서 상담 신청"
          className="decision-card__primary"
        >
          1분만에 상담 신청
        </InquiryStartButton>
        <a
          href={phoneHref}
          data-cta="phone"
          data-cta-placement={placement}
          onClick={() => trackCTA("phone", currentSlug(), phoneHref)}
          className="decision-card__secondary"
          aria-label={`전화 상담 ${phone}`}
        >
          <PhoneIcon className="h-4 w-4 shrink-0" />
          {phone}
        </a>
      </div>
      <p className="decision-card__hint">서류가 없어도 상황만 남겨 주시면 됩니다.</p>

      {/* ④ 네이버 예약·지도(페이지마다 최소 1개) */}
      {naverOn ? (
        <div className="decision-card__places">
          <PlaceLink
            variant="reservation"
            label="네이버 예약"
            icon={<NaverIcon className="h-3.5 w-3.5 text-[#03C75A]" />}
          />
          <PlaceLink
            variant="map"
            label="네이버 지도"
            icon={<LocationIcon className="h-3.5 w-3.5 text-[#03C75A]" />}
          />
          {REVIEW_TOTAL > 0 ? (
            <PlaceLink
              variant="review"
              label={`후기 ${REVIEW_TOTAL}건 보기`}
              icon={<StarIcon className="h-3.5 w-3.5 text-[#c9a86a]" />}
            />
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}

/** 본문 끝 방문 안내 한 줄 — 서두 결정 카드가 없는 페이지에도 네이버 예약·지도가 하나씩은 있게 한다 */
export function NaverVisitLinks({ className = "" }: { className?: string }) {
  if (!isNaverSmartPlaceConfigured()) return null;
  return (
    <p className={`flex flex-wrap items-center gap-x-2.5 text-sm text-navy/70 ${className}`.trim()}>
      <span className="font-medium text-navy">방문 상담</span>
      <PlaceLink
        variant="reservation"
        label="네이버 예약"
        placement="main_contact"
        icon={<NaverIcon className="h-3.5 w-3.5 text-[#03C75A]" />}
      />
      <span aria-hidden className="text-navy/25">·</span>
      <PlaceLink
        variant="map"
        label="네이버 지도"
        placement="main_contact"
        icon={<LocationIcon className="h-3.5 w-3.5 text-[#03C75A]" />}
      />
    </p>
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
  const phoneHref = getPhoneHref(phone);

  if (variant === "intro") {
    return <DecisionCard className={className} />;
  }

  const placement = "cost_outro";

  // 말미 — 바로 위 신뢰 블록에 같은 채널 버튼이 있으므로 버튼 줄 대신 문장 속 링크로 둔다.
  return (
    <aside
      aria-label="비용 문의 안내"
      className={`rounded-2xl border border-beige-dark bg-[var(--surface-muted)]/60 px-5 py-5 md:px-6 ${className}`.trim()}
    >
      <p className="text-[0.95rem] leading-relaxed text-navy/85 md:text-base">
        <strong className="font-semibold text-navy">
          맡길지 결정하기 전에, 비용부터 물어보셔도 됩니다.
        </strong>{" "}
        지금{" "}
        <InlineChannel href={phoneHref} external={false} kind="phone" placement={placement}>
          전화
        </InlineChannel>
        ·
        <InlineChannel href={naverTalk} external kind="naver-talk" placement={placement}>
          네이버 톡톡
        </InlineChannel>
        ·
        <InlineChannel href={kakao} external kind="kakao" placement={placement}>
          카카오톡
        </InlineChannel>
        으로 상황을 한두 줄만 알려주세요. 확인이 필요한 내용과 예상 비용을 안내해
        드리겠습니다.
      </p>
    </aside>
  );
}
