"use client";

import { useCallback, useId, useMemo, useState } from "react";
import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import {
  isTurnstileConfigured,
  TurnstileWidget,
} from "@/components/quick-inquiry/TurnstileWidget";
import {
  INQUIRY_FIELD_OPTIONS,
  getInquiryFieldLabel,
  type InquiryFieldValue,
} from "@/lib/service-conversion/inquiry-fields";
import { INQUIRY_RELAXED_NOTE } from "@/lib/service-conversion/copy";
import {
  getContactInfo,
  getDirectConsultationChannels,
  getPhoneHref,
} from "@/lib/contact";
import { consultationCopy } from "@/lib/consultation";
import {
  clientParseContact,
  submitQuickInquiry,
} from "@/lib/quick-inquiry/client";
import { HONEYPOT_FIELD } from "@/lib/quick-inquiry/shared";

export type ConsultationInquiryFormProps = {
  defaultField?: string;
  /** 전국 의뢰 전용 안내·추가 입력 */
  nationwideMode?: boolean;
  /** 지역 랜딩에서 넘어온 부동산 소재 지역 */
  defaultPropertyRegion?: string;
  /** 유입 페이지 slug */
  sourcePage?: string;
  /** 확인하고 싶은 내용 */
  intentHint?: string;
  /** 준비된 서류 힌트 */
  preparedDocsHint?: string;
  /** 비용 안내 요청 여부 */
  costGuideRequested?: boolean;
};

type FormState = {
  name: string;
  phone: string;
  field: InquiryFieldValue | "";
  situation: string;
  hasDocuments: boolean;
  agreed: boolean;
  clientRegion: string;
  propertyRegion: string;
  propertyCount: string;
  heirCount: string;
  visitPossible: string;
  contactTime: string;
};

type FieldErrors = {
  name?: string;
  phone?: string;
  field?: string;
  situation?: string;
  agreed?: string;
  turnstile?: string;
  form?: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  field: "",
  situation: "",
  hasDocuments: false,
  agreed: false,
  clientRegion: "",
  propertyRegion: "",
  propertyCount: "",
  heirCount: "",
  visitPossible: "",
  contactTime: "",
};

function buildInquiryBody(
  form: FormState,
  nationwideMode: boolean,
  meta: {
    sourcePage?: string;
    intentHint?: string;
    preparedDocsHint?: string;
    costGuideRequested?: boolean;
    pageUrl?: string;
  },
): string {
  const fieldLabel = form.field ? getInquiryFieldLabel(form.field) : "미선택";
  const lines = [
    nationwideMode
      ? "[다옴법무사사무소 전국 의뢰 상담 신청]"
      : "[다옴법무사사무소 상담 신청]",
    `이름: ${form.name.trim()}`,
    `연락처: ${form.phone.trim()}`,
    `상담 분야: ${fieldLabel}`,
    `서류 보유: ${form.hasDocuments ? "있음" : "없음/일부만 있음"}`,
    `유입 페이지: ${meta.sourcePage?.trim() || "-"}`,
    `문의 지역: ${form.propertyRegion.trim() || form.clientRegion.trim() || "부산(기본)"}`,
    `확인하고 싶은 내용: ${meta.intentHint?.trim() || "-"}`,
    `준비된 서류: ${meta.preparedDocsHint?.trim() || (form.hasDocuments ? "있음(상세는 본문)" : "없음/일부")}`,
    `비용 안내 요청: ${meta.costGuideRequested ? "예" : "아니오(본문 참고)"}`,
    `제출 URL: ${meta.pageUrl ?? "-"}`,
  ];

  if (nationwideMode) {
    lines.push(
      `의뢰인 거주 지역: ${form.clientRegion.trim() || "미기재"}`,
      `부동산·법인 소재 지역: ${form.propertyRegion.trim() || "미기재"}`,
      `부동산·법인 수: ${form.propertyCount.trim() || "미기재"}`,
      `상속인 수: ${form.heirCount.trim() || "미기재"}`,
      `방문 가능 여부: ${form.visitPossible.trim() || "미기재"}`,
      `연락 가능 시간: ${form.contactTime.trim() || "미기재"}`,
    );
  }

  lines.push("", "현재 상황:", form.situation.trim());
  return lines.join("\n");
}

export function ConsultationInquiryForm({
  defaultField,
  nationwideMode = false,
  defaultPropertyRegion,
  sourcePage,
  intentHint,
  preparedDocsHint,
  costGuideRequested = false,
}: ConsultationInquiryFormProps) {
  const channels = getDirectConsultationChannels();
  const { phone } = getContactInfo();
  const phoneHref = phone ? getPhoneHref(phone) : "/contact";
  const formId = useId();

  const intentPrefix = [
    intentHint ? `확인하고 싶은 내용: ${intentHint}` : "",
    preparedDocsHint ? `준비된 서류: ${preparedDocsHint}` : "",
    costGuideRequested ? "비용 안내 요청: 예" : "",
  ]
    .filter(Boolean)
    .join("\n");

  const [form, setForm] = useState<FormState>({
    ...initialState,
    field: (defaultField as InquiryFieldValue) || "",
    propertyRegion: defaultPropertyRegion ?? "",
    situation: intentPrefix ? `${intentPrefix}\n\n` : "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pageMeta = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        pageTitle: "상담 신청",
        pageUrl: "https://다옴법무사사무소.kr/contact/inquiry",
      };
    }
    return {
      pageTitle: document.title || "상담 신청",
      pageUrl: window.location.href,
    };
  }, []);

  const handleTurnstileToken = useCallback((nextToken: string) => {
    setToken(nextToken);
    if (!nextToken) return;
    setErrors((prev) => {
      if (!prev.turnstile) return prev;
      const rest = { ...prev };
      delete rest.turnstile;
      return rest;
    });
  }, []);

  const handleTurnstileError = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      turnstile: "보안 확인을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.",
    }));
  }, []);

  const validateLocal = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = "이름을 입력해 주세요.";
    if (!clientParseContact(form.phone)) {
      next.phone = "전화번호 또는 이메일 형식을 확인해 주세요.";
    }
    if (!form.field) next.field = "상담 분야를 선택해 주세요.";
    if (form.situation.trim().length < 5) {
      next.situation = "현재 상황을 조금 더 구체적으로 적어 주세요.";
    }
    if (!form.agreed) {
      next.agreed = "개인정보 수집·이용에 동의해 주세요.";
    }
    if (isTurnstileConfigured() && !token) {
      next.turnstile = "보안 확인을 완료해 주세요.";
    }
    return next;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const localErrors = validateLocal();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const message = buildInquiryBody(form, nationwideMode, {
        sourcePage,
        intentHint,
        preparedDocsHint,
        costGuideRequested:
          costGuideRequested || form.situation.includes("비용"),
        pageUrl: pageMeta.pageUrl,
      });
      const result = await submitQuickInquiry({
        message,
        contact: form.phone.trim(),
        consent: form.agreed,
        turnstileToken: token,
        website: honeypot,
        pageTitle: pageMeta.pageTitle,
        pageUrl: pageMeta.pageUrl,
      });

      if (result.ok) {
        setSubmitted(true);
        setToken("");
        setResetSignal((n) => n + 1);
        return;
      }

      const fieldErrors: FieldErrors = {};
      if (result.field === "contact") fieldErrors.phone = result.message;
      else if (result.field === "consent") fieldErrors.agreed = result.message;
      else if (result.field === "turnstile") fieldErrors.turnstile = result.message;
      else if (result.field === "message") fieldErrors.situation = result.message;
      else fieldErrors.form = result.message;

      setErrors(fieldErrors);
      setResetSignal((n) => n + 1);
      setToken("");
    } catch {
      setErrors({
        form: "네트워크 연결을 확인해 주세요. 작성하신 내용은 그대로 유지됩니다.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const fieldLabel = form.field ? getInquiryFieldLabel(form.field) : "";

  if (submitted) {
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
        <h2 className="inquiry-form__success-title">
          상담 신청이 정상적으로 전달되었습니다
        </h2>
        <p className="inquiry-form__success-text">
          남겨주신 내용을 확인한 뒤 연락처로 안내드리겠습니다.
          {fieldLabel ? ` (상담 분야: ${fieldLabel})` : ""}
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
          <button
            type="button"
            className="btn-secondary min-h-11"
            onClick={() => {
              setSubmitted(false);
              setForm({
                ...initialState,
                field: (defaultField as InquiryFieldValue) || "",
                propertyRegion: defaultPropertyRegion ?? "",
              });
              setErrors({});
              setHoneypot("");
              setToken("");
              setResetSignal((n) => n + 1);
            }}
          >
            새 상담 신청 작성
          </button>
          <Link href="/" className="btn-secondary min-h-11 inline-flex items-center justify-center">
            홈으로 돌아가기
          </Link>
        </div>

        <ConsultationFeeNotice />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="inquiry-form card-surface"
      noValidate
      aria-busy={submitting}
    >
      <header className="inquiry-form__header">
        <p className="inquiry-form__eyebrow">이메일 상담 신청</p>
        <h2 className="inquiry-form__title">
          {nationwideMode ? "전국 의뢰 상담 신청" : "상담 신청서"}
        </h2>
        <p className="inquiry-form__lead">
          {nationwideMode
            ? "서류를 모두 준비하지 않아도 됩니다. 알고 계신 지역과 상황만 남겨 주시면 전국 진행 가능 여부와 먼저 준비할 자료부터 확인합니다."
            : `${consultationCopy.contact} ${INQUIRY_RELAXED_NOTE}`}
        </p>
        <ul className="inquiry-form__reassure">
          <li>제출하시면 사무소 이메일로 안전하게 전달됩니다</li>
          <li>사이트에는 개인정보를 저장하지 않습니다</li>
          <li>급하시면 전화·카카오톡·톡톡도 이용하실 수 있습니다</li>
        </ul>
      </header>

      {nationwideMode ? (
        <fieldset className="inquiry-form__fieldset">
          <legend className="inquiry-form__legend">전국 의뢰 추가 정보</legend>
          <div className="inquiry-form__grid">
            <label className="inquiry-form__field">
              <span className="inquiry-form__label">의뢰인 거주 지역</span>
              <input
                type="text"
                name="clientRegion"
                value={form.clientRegion}
                disabled={submitting}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, clientRegion: e.target.value }))
                }
                className="inquiry-form__input"
                placeholder="예: 서울 강남구"
              />
            </label>
            <label className="inquiry-form__field">
              <span className="inquiry-form__label">부동산·법인 소재 지역</span>
              <input
                type="text"
                name="propertyRegion"
                value={form.propertyRegion}
                disabled={submitting}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, propertyRegion: e.target.value }))
                }
                className="inquiry-form__input"
                placeholder="예: 제주·경기 성남"
              />
            </label>
            <label className="inquiry-form__field">
              <span className="inquiry-form__label">부동산 개수 또는 법인 수</span>
              <input
                type="text"
                name="propertyCount"
                value={form.propertyCount}
                disabled={submitting}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, propertyCount: e.target.value }))
                }
                className="inquiry-form__input"
                placeholder="예: 부동산 2건"
              />
            </label>
            <label className="inquiry-form__field">
              <span className="inquiry-form__label">상속인 수(해당 시)</span>
              <input
                type="text"
                name="heirCount"
                value={form.heirCount}
                disabled={submitting}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, heirCount: e.target.value }))
                }
                className="inquiry-form__input"
                placeholder="예: 3명"
              />
            </label>
            <label className="inquiry-form__field">
              <span className="inquiry-form__label">방문 가능 여부</span>
              <input
                type="text"
                name="visitPossible"
                value={form.visitPossible}
                disabled={submitting}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, visitPossible: e.target.value }))
                }
                className="inquiry-form__input"
                placeholder="예: 방문 어려움 / 일정 조율 가능"
              />
            </label>
            <label className="inquiry-form__field">
              <span className="inquiry-form__label">연락 가능한 시간</span>
              <input
                type="text"
                name="contactTime"
                value={form.contactTime}
                disabled={submitting}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactTime: e.target.value }))
                }
                className="inquiry-form__input"
                placeholder="예: 평일 오후"
              />
            </label>
          </div>
        </fieldset>
      ) : null}

      <div className="inquiry-form__grid">
        <label className="inquiry-form__field" htmlFor={`${formId}-name`}>
          <span className="inquiry-form__label">
            이름 <span className="inquiry-form__req">*</span>
          </span>
          <input
            id={`${formId}-name`}
            type="text"
            name="name"
            autoComplete="name"
            required
            disabled={submitting}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="inquiry-form__input"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <span className="inquiry-form__error" role="alert">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className="inquiry-form__field" htmlFor={`${formId}-phone`}>
          <span className="inquiry-form__label">
            연락처 <span className="inquiry-form__req">*</span>
          </span>
          <input
            id={`${formId}-phone`}
            type="tel"
            name="phone"
            autoComplete="tel"
            required
            disabled={submitting}
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            className="inquiry-form__input"
            placeholder="010-0000-0000"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? (
            <span className="inquiry-form__error" role="alert">
              {errors.phone}
            </span>
          ) : null}
        </label>
      </div>

      <label className="inquiry-form__field" htmlFor={`${formId}-field`}>
        <span className="inquiry-form__label">
          상담 분야 <span className="inquiry-form__req">*</span>
        </span>
        <select
          id={`${formId}-field`}
          name="field"
          required
          disabled={submitting}
          value={form.field}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              field: e.target.value as InquiryFieldValue,
            }))
          }
          className="inquiry-form__input"
          aria-invalid={Boolean(errors.field)}
        >
          <option value="">선택해 주세요</option>
          {INQUIRY_FIELD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.field ? (
          <span className="inquiry-form__error" role="alert">
            {errors.field}
          </span>
        ) : null}
      </label>

      <label className="inquiry-form__field" htmlFor={`${formId}-situation`}>
        <span className="inquiry-form__label">
          현재 상황 간단히 작성 <span className="inquiry-form__req">*</span>
        </span>
        <textarea
          id={`${formId}-situation`}
          name="situation"
          required
          rows={5}
          disabled={submitting}
          value={form.situation}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, situation: e.target.value }))
          }
          className="inquiry-form__textarea"
          placeholder={
            nationwideMode
              ? "예: 사망일, 상속인 간 협의 여부, 해외 거주자 포함 여부, 준비된 서류"
              : "예: 잔금일이 다음 주이고 근저당 말소가 필요합니다."
          }
          aria-invalid={Boolean(errors.situation)}
        />
        {errors.situation ? (
          <span className="inquiry-form__error" role="alert">
            {errors.situation}
          </span>
        ) : null}
      </label>

      <label className="inquiry-form__check inquiry-form__check--soft">
        <input
          type="checkbox"
          name="hasDocuments"
          disabled={submitting}
          checked={form.hasDocuments}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, hasDocuments: e.target.checked }))
          }
          className="inquiry-form__checkbox"
        />
        <span>
          등기부등본·계약서 등 기본 서류를 일부 보유하고 있습니다.
        </span>
      </label>

      <label className="inquiry-form__check" htmlFor={`${formId}-agreed`}>
        <input
          id={`${formId}-agreed`}
          type="checkbox"
          name="agreed"
          required
          disabled={submitting}
          checked={form.agreed}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, agreed: e.target.checked }))
          }
          className="inquiry-form__checkbox"
          aria-invalid={Boolean(errors.agreed)}
        />
        <span>
          문의 확인과 연락을 위한 개인정보 수집·이용에 동의합니다. 상담 목적 외
          사용하지 않으며, 사이트 서버에 저장하지 않습니다.{" "}
          <Link href="/contact" className="inquiry-form__link">
            상담 안내
          </Link>
        </span>
      </label>
      {errors.agreed ? (
        <p className="inquiry-form__error" role="alert">
          {errors.agreed}
        </p>
      ) : null}

      <div className="inquiry-form__hp" aria-hidden="true">
        <label htmlFor={`${formId}-hp`}>회사 웹사이트</label>
        <input
          id={`${formId}-hp`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <TurnstileWidget
        onToken={handleTurnstileToken}
        onError={handleTurnstileError}
        resetSignal={resetSignal}
      />
      {errors.turnstile ? (
        <p className="inquiry-form__error" role="alert">
          {errors.turnstile}
        </p>
      ) : null}

      {errors.form ? (
        <div className="inquiry-form__alert" role="alert">
          <span className="inquiry-form__alert-icon" aria-hidden>
            !
          </span>
          <div>
            <p className="inquiry-form__alert-title">상담 신청을 완료하지 못했습니다</p>
            <p className="inquiry-form__alert-text">{errors.form}</p>
          </div>
        </div>
      ) : null}

      {submitting ? (
        <div className="inquiry-form__sending" role="status" aria-live="polite">
          <span className="inquiry-form__spinner" aria-hidden />
          <span>상담 신청 내용을 안전하게 전송하고 있습니다</span>
        </div>
      ) : null}

      <div className="inquiry-form__actions">
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="btn-primary inquiry-form__submit"
        >
          {submitting ? (
            <>
              <span
                className="inquiry-form__spinner inquiry-form__spinner--button"
                aria-hidden
              />
              보내는 중…
            </>
          ) : (
            "상담 신청서 제출하기"
          )}
        </button>
        {phone ? (
          <a href={phoneHref} className="btn-secondary inquiry-form__phone-btn">
            전화로 일정 확인하기
          </a>
        ) : null}
      </div>

      <ConsultationFeeNotice />
    </form>
  );
}
