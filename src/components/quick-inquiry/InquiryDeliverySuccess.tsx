"use client";

import Link from "next/link";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { PostInquiryNextSteps } from "@/components/consultation/PostInquiryNextSteps";
import { PostInquiryPhoneCta } from "@/components/consultation/PostInquiryPhoneCta";

type InquiryDeliverySuccessProps = {
  title?: string;
  description?: string;
  detail?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  onReset?: () => void;
  resetLabel?: string;
  showFeeNotice?: boolean;
};

const successLinkClass =
  "font-medium text-navy underline decoration-navy/25 underline-offset-4";

export function InquiryDeliverySuccess({
  title = "남겨 주셨습니다",
  description,
  detail,
  secondaryHref = "/",
  secondaryLabel = "홈으로 돌아가기",
  onReset,
  resetLabel = "새 문의 작성",
  showFeeNotice = false,
}: InquiryDeliverySuccessProps) {
  return (
    <div
      className="inquiry-form inquiry-form--success card-surface"
      role="status"
      aria-live="polite"
    >
      <div className="inquiry-form__success-badge" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" className="inquiry-form__success-check">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
          <path
            d="M7.5 12.5l3 3 6-6.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="inquiry-form__success-title">{title}</h2>
      {description || detail ? (
        <p className="inquiry-form__success-text">
          {description}
          {detail ? ` (${detail})` : ""}
        </p>
      ) : null}
      <PostInquiryNextSteps />

      <PostInquiryPhoneCta
        className="inquiry-form__success-call"
        hintClassName="inquiry-form__success-call-hint"
        buttonClassName="btn-primary inquiry-form__success-call-btn"
        phoneNumClassName="inquiry-form__phone-num"
      />

      <div className="inquiry-form__success-actions">
        {onReset ? (
          <button type="button" className={successLinkClass} onClick={onReset}>
            {resetLabel}
          </button>
        ) : null}
        <Link href={secondaryHref} className={successLinkClass}>
          {secondaryLabel}
        </Link>
      </div>

      {showFeeNotice ? <ConsultationFeeNotice /> : null}
    </div>
  );
}
