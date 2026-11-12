"use client";

import type { ReactNode } from "react";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { isConsultationPhoneOffered } from "@/lib/consultation-availability";

type AvailabilityPhoneLinkProps = {
  /** tel: 링크 */
  href: string;
  className?: string;
  /** 상담 가능 시간에만 보이는 버튼 내용 */
  children: ReactNode;
  /**
   * 닫힘·확인 전에 대신 보일 내용. 없으면 아무것도 그리지 않는다.
   * 서버 HTML과 첫 렌더가 같도록 마운트 전에는 항상 fallback을 그린다.
   */
  fallback?: ReactNode;
  onClick?: () => void;
};

/**
 * 본문 안 「전화」 버튼 공통 규칙: 평일 09:00–18:00 확인된 때만 전화 링크를 켠다.
 * 닫힘이면 fallback(대개 카카오톡·간편 문의)으로 바꿔, 영업 외 시간에 전화를 유도하지 않는다.
 */
export function AvailabilityPhoneLink({
  href,
  className,
  children,
  fallback = null,
  onClick,
}: AvailabilityPhoneLinkProps) {
  const { isOpen, isResolved } = useConsultationAvailability();
  if (!isConsultationPhoneOffered(isResolved, isOpen)) return <>{fallback}</>;
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
