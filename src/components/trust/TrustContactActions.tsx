"use client";

import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import {
  KakaoIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/consultation/ConsultationIcons";
import { trackCtaEvent } from "@/lib/admin-ops/track-client";

type TrustContactActionsProps = {
  phone: string;
  phoneHref: string;
  kakaoHref: string;
  naverTalkHref: string;
  hours: string;
};

export function TrustContactActions({
  phone,
  phoneHref,
  kakaoHref,
  naverTalkHref,
  hours,
}: TrustContactActionsProps) {
  return (
    <div className="@container relative overflow-hidden rounded-2xl bg-navy p-5 text-white @md:p-6">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/[0.06]"
        aria-hidden
      />
      <p className="relative text-sm font-medium text-white/80">
        업무명을 몰라도 괜찮습니다. 지금 상황만 말씀해 주세요.
      </p>
      <a
        href={phoneHref}
        onClick={() => trackCtaEvent("phone", undefined, phoneHref)}
        className="relative mt-2 inline-flex items-center gap-2.5 text-[1.75rem] font-bold leading-tight tracking-tight text-white no-underline hover:text-white/90 @md:text-[2rem]"
        aria-label={`안윤정 법무사에게 전화 상담 ${phone}`}
        data-cta="trust-phone"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy">
          <PhoneIcon className="h-5 w-5" />
        </span>
        {phone}
      </a>
      <p className="relative mt-1.5 text-xs text-white/70 @md:text-sm">
        {hours} · 방문 상담은 예약제 · 카카오톡·톡톡으로 먼저 남겨 두셔도 됩니다
      </p>

      <div className="relative mt-5 grid gap-2.5 @sm:grid-cols-2 @2xl:grid-cols-3">
        <InquiryStartButton
          source="cta"
          note="법무사 이력 확인 후 상담"
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-5 text-base font-bold text-navy shadow-sm transition hover:bg-cream @sm:col-span-2 @2xl:col-span-1"
        >
          1분 만에 상담 신청하기
        </InquiryStartButton>
        <a
          href={kakaoHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaEvent("kakao", undefined, kakaoHref)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 text-sm font-bold text-[#191919] no-underline transition hover:brightness-95"
          data-cta="trust-kakao"
        >
          <KakaoIcon className="h-5 w-5" />
          카카오톡 상담
          <span className="sr-only"> (새 창)</span>
        </a>
        <a
          href={naverTalkHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaEvent("naver-talk", undefined, naverTalkHref)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#03C75A] px-4 text-sm font-bold text-white no-underline transition hover:brightness-95"
          data-cta="trust-naver-talk"
        >
          <NaverIcon className="h-5 w-5" />
          네이버 톡톡 상담
          <span className="sr-only"> (새 창)</span>
        </a>
      </div>
    </div>
  );
}
