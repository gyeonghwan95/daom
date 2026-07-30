"use client";

import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import {
  getContactInfo,
  getDirectConsultationChannels,
  getPhoneHref,
} from "@/lib/contact";

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

export function InquiryDeliverySuccess({
  title = "문의가 정상적으로 전달되었습니다",
  description = "남겨주신 내용을 확인한 뒤 연락처로 안내드리겠습니다.",
  detail,
  secondaryHref = "/",
  secondaryLabel = "홈으로 돌아가기",
  onReset,
  resetLabel = "새 문의 작성",
  showFeeNotice = false,
}: InquiryDeliverySuccessProps) {
  const channels = getDirectConsultationChannels();
  const { phone } = getContactInfo();
  const phoneHref = phone ? getPhoneHref(phone) : "/contact";

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
      <p className="inquiry-form__success-text">
        {description}
        {detail ? ` (${detail})` : ""}
      </p>

      <div className="inquiry-form__success-call">
        <p className="inquiry-form__success-call-hint">
          급하시면 전화로 바로 문의해 주세요.
        </p>
        <a href={phoneHref} className="btn-primary inquiry-form__success-call-btn">
          전화로 바로 문의하기
          {phone ? <span className="inquiry-form__phone-num">{phone}</span> : null}
        </a>
      </div>

      <div className="inquiry-form__success-channels">
        <p className="inquiry-form__section-label">다른 연락 방법</p>
        <ConsultationButtons channels={channels} theme="light" layout="grid" />
      </div>

      <div className="inquiry-form__success-actions">
        {onReset ? (
          <button type="button" className="btn-secondary min-h-11" onClick={onReset}>
            {resetLabel}
          </button>
        ) : null}
        <Link
          href={secondaryHref}
          className="btn-secondary min-h-11 inline-flex items-center justify-center"
        >
          {secondaryLabel}
        </Link>
      </div>

      {showFeeNotice ? <ConsultationFeeNotice /> : null}
    </div>
  );
}
