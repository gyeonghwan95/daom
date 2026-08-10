"use client";

import Link from "next/link";
import {
  CONTACT_INQUIRY_PATH,
  consultationInquiryCopy,
} from "@/lib/consultation-inquiry";

type ConsultInlineCardProps = {
  pageTitle: string;
  pageUrl?: string;
  className?: string;
};

/**
 * 인라인 상담 카드 — 신청서 페이지로 이동 (플로팅 팝업 제외).
 */
export function ConsultInlineCard({
  pageTitle: _pageTitle,
  pageUrl: _pageUrl,
  className = "",
}: ConsultInlineCardProps) {
  void _pageTitle;
  void _pageUrl;
  return (
    <aside
      className={`consult-inline ${className}`.trim()}
      aria-label="상담 신청"
    >
      <p className="consult-inline__eyebrow">상담 신청</p>
      <h2 className="consult-inline__title">
        내 상황도 상담이 필요한지 확인하기
      </h2>
      <p className="consult-inline__desc">
        {consultationInquiryCopy.oneMinute} 업무명을 모르셔도 현재 상황만 적어
        주시면 됩니다.
      </p>
      <Link href={CONTACT_INQUIRY_PATH} className="btn-primary consult-inline__btn">
        {consultationInquiryCopy.ctaPrimary}
      </Link>
    </aside>
  );
}
