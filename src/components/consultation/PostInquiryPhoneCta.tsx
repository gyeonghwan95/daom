"use client";

import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { getContactInfo, getPhoneHref } from "@/lib/contact";

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
  const { isOpen, isResolved } = useConsultationAvailability();
  const { phone, kakao } = getContactInfo();
  const phoneReady = Boolean(phone) && (!isResolved || isOpen);

  if (phoneReady && phone) {
    return (
      <div className={className}>
        <p className={hintClassName}>
          급하시면 전화로 문의해 주세요. 상황을 확인한 뒤 예상 비용 범위를
          안내해 드립니다.
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
        지금은 메시지 상담만 바로 가능합니다. 남겨 주시면 확인 후
        연락드립니다. 전화는 평일 09:00–18:00에 가능합니다.
      </p>
      <a
        href={chatHref}
        className={buttonClassName}
        {...(kakao
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {kakao ? "카카오톡으로 이어가기" : "문의 페이지로 이동"}
      </a>
    </div>
  );
}
