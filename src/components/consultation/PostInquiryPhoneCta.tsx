"use client";

import { usePathname } from "next/navigation";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { useConsultChatLaunch } from "@/hooks/useConsultChatLaunch";
import { isConsultationPhoneOffered } from "@/lib/consultation-availability";
import { getConsultEmpathy } from "@/lib/consultation-empathy";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { consultChatButtonLabel } from "@/lib/open-consult-chat";

type PostInquiryPhoneCtaProps = {
  /** 성공 화면 카드 클래스 (폼마다 스타일 토큰이 다름) */
  className?: string;
  hintClassName?: string;
  buttonClassName?: string;
  phoneNumClassName?: string;
};

/**
 * 문의 전송 직후 CTA.
 * 영업중: 전화 유도(비용은 확인 후 안내).
 * 영업외·미확정: 닫힘 문구와 맞게 카카오(또는 문의)로 이어가고 전화 단정을 하지 않는다.
 */
export function PostInquiryPhoneCta({
  className,
  hintClassName,
  buttonClassName = "btn-primary",
  phoneNumClassName,
}: PostInquiryPhoneCtaProps) {
  const pathname = usePathname() ?? "/";
  const { isOpen, isResolved } = useConsultationAvailability();
  const { phone, kakao } = getContactInfo();
  const { status, launch } = useConsultChatLaunch();
  const example = getConsultEmpathy(pathname).example;
  const phoneReady = Boolean(phone) && isConsultationPhoneOffered(isResolved, isOpen);

  if (phoneReady && phone) {
    return (
      <div className={className}>
        <p className={hintClassName}>
          급하시면 전화로 이어가셔도 됩니다. 제가 확인하고 필요한 것만 안내합니다.
        </p>
        <a href={getPhoneHref(phone)} className={buttonClassName}>
          전화로 상담 문의하기
          {phoneNumClassName ? (
            <span className={phoneNumClassName}>{phone}</span>
          ) : null}
        </a>
      </div>
    );
  }

  const chatHref = kakao || "/contact/inquiry";
  return (
    <div className={className}>
      <p className={hintClassName}>
        지금 남기시면 내일 아침 제가 봅니다. 오늘 밤 정하지 않으셔도 됩니다.
      </p>
      <a
        href={chatHref}
        className={buttonClassName}
        {...(kakao
          ? {
              target: "_blank",
              rel: "noopener noreferrer",
              onClick: () => launch(example),
            }
          : {})}
      >
        {kakao
          ? consultChatButtonLabel(status, "카카오톡으로 이어가기")
          : "문의 페이지로 이동"}
      </a>
    </div>
  );
}
