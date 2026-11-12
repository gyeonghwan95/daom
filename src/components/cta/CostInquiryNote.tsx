"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  KakaoIcon,
  LocationIcon,
  NaverIcon,
} from "@/components/consultation/ConsultationIcons";
import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { trackCTA } from "@/lib/analytics/track-cta";
import { isB2BPath } from "@/lib/b2b/options";
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
  REVIEW_PAGE_URL,
} from "@/lib/naver-place-reviews/static-quotes";
import { isLecturePagePath } from "@/data/seoExperiments/lecture-targets";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { consultationReplySla } from "@/lib/consultation-copy";
import {
  consultPasteText,
  getConsultEmpathy,
} from "@/lib/consultation-empathy";
import { useConsultChatLaunch } from "@/hooks/useConsultChatLaunch";
import { isConsultationPhoneOffered } from "@/lib/consultation-availability";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { siteImages } from "@/lib/site-images";

/**
 * 비용 문의 안내 — 본문형 페이지 공통(서두: HeroContactButtons·PageHero 등, 말미: MainContactPhone).
 *
 * 서두(intro)는 "결정 카드"다. 정보를 찾으러 온 방문자가 첫 화면 근처에서
 *  ① 맡길 근거(실제 방문자 후기·대표 직접 진행·협회장 표창) ② 비용 걱정을 덜어 주는 안내(문구 고정)
 *  ③ 편한 채널을 고르는 선택지(카카오톡·네이버 톡톡·간편 문의·전화)
 *  ④ 네이버 예약·지도
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
  className = "",
}: {
  variant: NaverSmartPlaceVariant;
  label: string;
  icon: ReactNode;
  placement?: NaverSmartPlacePlacement;
  className?: string;
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
      className={`naver-place-btn ${className}`.trim()}
    >
      {icon}
      <span className="truncate">{label}</span>
      <svg
        className="naver-place-btn__ext"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path d="M6 3.5h6.5V10M12.5 3.5 4 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only"> (새 창)</span>
    </a>
  );
}

function DecisionCard({ className }: { className: string }) {
  const pathname = usePathname() ?? "/";
  const { phone, kakao, naverTalk } = getContactInfo();
  const phoneHref = getPhoneHref(phone);
  const { isOpen, isResolved } = useConsultationAvailability();
  const phoneVisible = Boolean(phone) && isConsultationPhoneOffered(isResolved, isOpen);
  const lecture = isLecturePagePath(pathname);
  const b2b = isB2BPath(pathname);
  const empathy = getConsultEmpathy(pathname);
  const quiet = !lecture && !b2b && empathy.quiet;
  const quote = lecture || b2b ? null : pickShortReviewQuote(pathname);
  const naverOn = isNaverSmartPlaceConfigured();
  const placement = "cost_intro";
  const portrait = siteImages.about.portrait;
  const showPhone = phoneVisible && !quiet;
  // PC에서 전화 칸을 처음부터 잡아 둔다: 시각이 확정된 뒤 칸이 생기며 버튼 배치가 움직이지 않게 한다(CLS 방지).
  const phoneSlot = Boolean(phone) && !quiet && !b2b && !lecture;
  const afterHours = isResolved && !isOpen;
  const paste = lecture
    ? "강의 주제와 희망 날짜를 알려 드립니다."
    : consultPasteText(empathy);
  const { launch } = useConsultChatLaunch();
  const hint = lecture
    ? `${consultationReplySla.line} 기관 강사료 기준이 있으면 그 범위에서 맞춰 드립니다.`
    : afterHours
      ? consultationReplySla.night
      : `${consultationReplySla.weekday}. 맡기기 전에 물어보셔도 됩니다.`;
  const intent = lecture ? "lecture" : b2b ? "b2b" : empathy.intent;
  // 모바일은 하단 고정바가 전화·카카오톡·톡톡·예약을 맡는다(협업 페이지의 하단바는 전화·카카오톡만).
  // 카드에서는 같은 버튼을 되풀이하지 않고 대표 행동 하나(간편 문의)만 크게 둔다. PC는 카드가 주 CTA다.
  const barCoversChat = !b2b;
  const chatBtnHidden = barCoversChat ? " max-lg:hidden" : "";

  const openChat = (kind: string, href: string) => {
    trackCTA(kind, currentSlug(), href, intent);
    launch(paste);
  };

  return (
    <aside
      aria-label="상담 안내"
      data-decision-card
      data-consult-intent={intent}
      className={`decision-card ${className}`.trim()}
    >
      <div className="decision-card__head">
        {lecture ? null : (
          <div className="decision-card__photo">
            <Image
              src={encodePublicSrc(portrait.src)}
              alt={portrait.alt}
              fill
              sizes="6rem"
              className="object-cover object-top"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="decision-card__voice">안윤정 법무사</p>
          {/* 히어로의 공감 한 줄(ConsultEmpathyLead)과 같은 문장을 한 페이지에 두 번 쓰지 않도록, 카드는 남기는 예시를 보여 준다 */}
          <p className="decision-card__empathy">
            {lecture
              ? "이렇게 남기셔도 됩니다 — 강의 주제, 희망 날짜, 대상 인원"
              : b2b
                ? "잔금일과 거래 유형만 알려 주시면 협업 가능 여부부터 회신합니다."
                : `이렇게 남기셔도 됩니다 — “${empathy.example}”`}
          </p>
          {lecture || b2b ? null : (
            <p className="decision-card__award">대한법무사협회장 표창 · 제가 처음부터 직접 진행합니다</p>
          )}
        </div>
      </div>

      {quote ? (
        <a
          href={REVIEW_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="decision-card__quote"
          onClick={() =>
            trackNaverPlaceClick({
              variant: "review",
              placement: "decision_card",
              href: REVIEW_PAGE_URL,
            })
          }
        >
          <blockquote>
            <p>“{quote.excerpt}”</p>
          </blockquote>
          <span className="decision-card__quote-more">
            네이버 플레이스에서 이어서 보기
            <span className="sr-only"> (새 창)</span>
          </span>
        </a>
      ) : null}

      <div className={`decision-card__actions${showPhone || phoneSlot ? " decision-card__actions--phone" : ""}`}>
        {kakao ? (
          <a
            href={kakao}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="kakao"
            data-cta-placement={placement}
            onClick={() => openChat("kakao", kakao)}
            className={`decision-card__kakao${chatBtnHidden}`}
          >
            <KakaoIcon className="h-4 w-4 shrink-0" />
            {quiet ? "이름 없이 카카오톡" : "카카오톡"}
            <span className="sr-only"> (새 창)</span>
          </a>
        ) : null}
        {naverTalk ? (
          <a
            href={naverTalk}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="naver-talk"
            data-cta-placement={placement}
            onClick={() => openChat("naver-talk", naverTalk)}
            className={`decision-card__naver${chatBtnHidden}`}
          >
            <NaverIcon className="h-4 w-4 shrink-0" />
            네이버톡톡
            <span className="sr-only"> (새 창)</span>
          </a>
        ) : null}
        {b2b ? (
          <Link href="/협업문의" className="decision-card__inquiry">
            협업 문의
          </Link>
        ) : (
          <InquiryStartButton
            source="landing"
            pageSlug={pathname}
            note={lecture ? "결정 카드에서 강의 문의" : "결정 카드에서 간편 문의"}
            className="decision-card__inquiry"
          >
            {lecture ? "강의 문의 남기기" : "간편 문의"}
          </InquiryStartButton>
        )}
        {showPhone ? (
          <a
            href={phoneHref}
            data-cta="phone"
            data-cta-placement={placement}
            onClick={() => trackCTA("phone", currentSlug(), phoneHref, intent)}
            className="decision-card__secondary max-lg:hidden"
            aria-label={`전화 상담 ${phone}`}
          >
            <PhoneIcon className="h-4 w-4 shrink-0" />
            {phone}
          </a>
        ) : phoneSlot ? (
          <span
            className="decision-card__secondary pointer-events-none opacity-70 max-lg:hidden"
            aria-label="전화 상담은 평일 09시부터 18시까지"
          >
            <PhoneIcon className="h-4 w-4 shrink-0" />
            전화 평일 09–18시
          </span>
        ) : null}
      </div>
      {barCoversChat ? (
        <p className="decision-card__hint lg:hidden">
          {showPhone ? "전화·카카오톡·네이버톡톡" : "카카오톡·네이버톡톡"}은 화면 아래 바에서 바로 누를 수 있습니다.
        </p>
      ) : null}
      <p className="decision-card__hint">{hint}</p>
      {lecture || b2b ? null : (
        <>
          <p className="decision-card__process">{empathy.costLine}</p>
          <p className="decision-card__process max-lg:hidden">{empathy.afterInquiry}</p>
          {empathy.photoHint ? (
            <p className="decision-card__photo-hint max-lg:hidden">{empathy.photoHint}</p>
          ) : null}
        </>
      )}

      {naverOn ? (
        <div className="decision-card__places">
          <PlaceLink
            variant="reservation"
            label="네이버예약"
            icon={<NaverIcon className="naver-place-btn__icon" />}
          />
          <PlaceLink
            variant="map"
            label="네이버지도"
            icon={<LocationIcon className="naver-place-btn__icon" />}
          />
        </div>
      ) : null}
    </aside>
  );
}

/** 본문 끝 방문 안내 한 줄 — 서두 결정 카드가 없는 페이지에도 네이버 예약·지도가 하나씩은 있게 한다 */
export function NaverVisitLinks({ className = "" }: { className?: string }) {
  if (!isNaverSmartPlaceConfigured()) return null;
  return (
    <div className={`naver-visit ${className}`.trim()}>
      <p className="naver-visit__label">방문 상담</p>
      <div className="naver-visit__actions">
        <PlaceLink
          variant="reservation"
          label="네이버예약"
          placement="main_contact"
          icon={<NaverIcon className="naver-place-btn__icon" />}
        />
        <PlaceLink
          variant="map"
          label="네이버지도"
          placement="main_contact"
          icon={<LocationIcon className="naver-place-btn__icon" />}
        />
      </div>
    </div>
  );
}

export function CostInquiryNote({
  variant,
  className = "",
}: {
  variant: Variant;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const { phone, kakao, naverTalk } = getContactInfo();
  const phoneHref = getPhoneHref(phone);
  const { isOpen, isResolved } = useConsultationAvailability();
  const quiet = getConsultEmpathy(pathname).quiet;
  const phoneVisible =
    Boolean(phone) && isConsultationPhoneOffered(isResolved, isOpen) && !quiet;

  if (variant === "intro") {
    return <DecisionCard className={className} />;
  }

  const placement = "cost_outro";

  return (
    <aside
      aria-label="비용 문의 안내"
      className={`rounded-2xl border border-beige-dark bg-[var(--surface-muted)]/60 px-5 py-5 md:px-6 ${className}`.trim()}
    >
      <p className="text-[0.95rem] leading-relaxed text-navy/85 md:text-base">
        <strong className="font-semibold text-navy">제가 내용을 확인하고, 필요한 것만 안내합니다.</strong>{" "}
        맡기기 전에 물어보셔도 됩니다.{" "}
        {phoneVisible ? (
          <>
            <InlineChannel href={phoneHref} external={false} kind="phone" placement={placement}>
              전화
            </InlineChannel>
            ·
          </>
        ) : null}
        <InlineChannel href={kakao} external kind="kakao" placement={placement}>
          카카오톡
        </InlineChannel>
        ·
        <InlineChannel href={naverTalk} external kind="naver-talk" placement={placement}>
          네이버톡톡
        </InlineChannel>
        으로 한두 줄만 남겨 주세요.
      </p>
    </aside>
  );
}
