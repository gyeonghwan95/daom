"use client";

import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { PhoneIcon } from "@/components/consultation/ConsultationIcons";
import { trackCtaEvent } from "@/lib/admin-ops/track-client";

type TrustContactActionsProps = {
  phone: string;
  phoneHref: string;
  hours: string;
};

/**
 * 법무사 소개 블록 끝의 연락 패널.
 * 바로 위 '상담 안내' 패널(전화·카카오·톡톡·예약·지도)과 모바일 하단 고정 바가 같은 채널을 이미 보여 주므로,
 * 모바일에서는 숨기고 PC에서는 전화번호와 상담 신청 하나만 둔다.
 */
export function TrustContactActions({ phone, phoneHref, hours }: TrustContactActionsProps) {
  return (
    <div className="@container relative overflow-hidden rounded-2xl bg-navy p-5 text-white max-lg:hidden @md:p-6">
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
        {hours} · 방문 상담은 예약제입니다
      </p>

      <div className="relative mt-5">
        <InquiryStartButton
          source="cta"
          note="법무사 이력 확인 후 상담"
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-white px-5 text-base font-bold text-navy shadow-sm transition hover:bg-cream"
        >
          1분 만에 상담 신청하기
        </InquiryStartButton>
      </div>
    </div>
  );
}
