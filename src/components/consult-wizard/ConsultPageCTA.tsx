"use client";

import Link from "next/link";
import {
  CONTACT_INQUIRY_PATH,
  consultationInquiryCopy,
} from "@/lib/consultation-inquiry";
import type { ConsultSituationId } from "@/lib/consult-wizard/catalog";

type ConsultPageCTAProps = {
  pageTitle: string;
  pageUrl?: string;
  presetSituationIds?: ConsultSituationId[];
  className?: string;
};

/** 페이지당 최대 1회 배치용 문맥형 CTA — 상담 신청서로 이동 */
export function ConsultPageCTA({
  pageTitle: _pageTitle,
  pageUrl: _pageUrl,
  presetSituationIds: _presetSituationIds,
  className = "",
}: ConsultPageCTAProps) {
  void _pageTitle;
  void _pageUrl;
  void _presetSituationIds;
  return (
    <section
      className={`consult-page-cta ${className}`.trim()}
      aria-label="상담 신청"
    >
      <p className="consult-page-cta__eyebrow">상담 신청</p>
      <h2 className="consult-page-cta__title">
        준비된 서류가 없어도 문의할 수 있습니다
      </h2>
      <p className="consult-page-cta__body">
        {consultationInquiryCopy.oneMinute} 어떤 업무인지 몰라도 현재 상황부터
        확인해 드립니다.
      </p>
      <ul className="consult-page-cta__list">
        <li>업무명을 모르셔도 현재 상황만 적어 주세요</li>
        <li>준비된 서류가 없어도 문의할 수 있습니다</li>
        <li>{consultationInquiryCopy.oneMinuteShort}</li>
      </ul>
      <Link
        href={CONTACT_INQUIRY_PATH}
        className="btn-primary consult-page-cta__btn"
      >
        {consultationInquiryCopy.ctaPrimary}
      </Link>
    </section>
  );
}
