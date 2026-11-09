"use client";

import { KakaoIcon, PhoneIcon } from "@/components/consultation/ConsultationIcons";
import { trackCtaEvent } from "@/lib/admin-ops/track-client";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { useConsultChatLaunch } from "@/hooks/useConsultChatLaunch";
import { getContactInfo } from "@/lib/contact";
import { consultationReplySla } from "@/lib/consultation-copy";
import { getConsultEmpathy } from "@/lib/consultation-empathy";
import { isConsultationPhoneOffered } from "@/lib/consultation-availability";
import { consultChatButtonLabel } from "@/lib/open-consult-chat";
import { officeLocation } from "@/lib/office-location";
import { usePathname } from "next/navigation";

type TrustContactActionsProps = {
  phone: string;
  phoneHref: string;
  hours: string;
};

export function TrustContactActions({ phone, phoneHref, hours }: TrustContactActionsProps) {
  const pathname = usePathname() ?? "/";
  const { isOpen, isResolved } = useConsultationAvailability();
  const phoneVisible = Boolean(phone) && isConsultationPhoneOffered(isResolved, isOpen);
  const { kakao } = getContactInfo();
  const { status, launch } = useConsultChatLaunch();
  const night = isResolved && !isOpen;
  const example = getConsultEmpathy(pathname).example;

  return (
    <div className="@container relative overflow-hidden rounded-2xl bg-navy p-5 text-white max-lg:hidden @md:p-6">
      <p className="relative text-sm font-medium text-white/80">
        {night
          ? consultationReplySla.night
          : `제가 직접 확인합니다. ${consultationReplySla.line}`}
      </p>
      {phoneVisible ? (
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
      ) : kakao ? (
        <a
          href={kakao}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackCtaEvent("kakao", undefined, kakao);
            launch(example);
          }}
          className="relative mt-3 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#FEE500] px-4 text-base font-bold text-[#191919] no-underline"
          data-cta="trust-kakao"
        >
          <KakaoIcon className="h-5 w-5" />
          {consultChatButtonLabel(status, "카카오톡으로 남기기")}
          <span className="sr-only"> (새 창)</span>
        </a>
      ) : null}
      <p className="relative mt-1.5 text-xs text-white/70 @md:text-sm">
        {hours} · {officeLocation.visitNotice}
      </p>
    </div>
  );
}
