"use client";

import { InquiryFailureFallback } from "@/components/conversion/InquiryFailureFallback";
import { useCallback, useId, useMemo, useState } from "react";
import Link from "next/link";
import { PostInquiryNextSteps } from "@/components/consultation/PostInquiryNextSteps";
import { PostInquiryPhoneCta } from "@/components/consultation/PostInquiryPhoneCta";
import { InquiryAltChannels } from "@/components/conversion/InquiryAltChannels";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import {
  isTurnstileConfigured,
  TurnstileWidget,
} from "@/components/quick-inquiry/TurnstileWidget";
import {
  CORPORATE_LEGAL_TASK_OPTIONS,
  INQUIRY_FIELD_OPTIONS,
  getCorporateLegalTaskLabel,
  getInquiryFieldLabel,
  type CorporateLegalTaskValue,
  type InquiryFieldValue,
} from "@/lib/service-conversion/inquiry-fields";
import { trackB2BEvent } from "@/lib/analytics/track-b2b";
import {
  getContactInfo,
  getPhoneHref,
} from "@/lib/contact";
import { consultationCopy } from "@/lib/consultation";
import {
  clientParseContact,
  submitQuickInquiry,
} from "@/lib/quick-inquiry/client";
import { HONEYPOT_FIELD } from "@/lib/quick-inquiry/shared";
import { PrivacyConsentLabel } from "@/components/legal/PrivacyConsentLabel";

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
  /** 유입 클러스터 (개인정보 아님). 예: corporate-legal */
  inquiryCluster?: string;
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
  corporateTask: CorporateLegalTaskValue | "";
  /** 업무별 기한 기준일(사망일·잔금일·임기 만료일) — 회신 순서를 정하는 데 쓴다 */
  keyDate: string;
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
  corporateTask: "",
  keyDate: "",
};

/**
 * 업무마다 기한을 가르는 날짜가 다르다(상속포기 3개월, 잔금일, 임원 변경 2주).
 * 이 날짜 하나만 있으면 회신 순서와 첫 안내가 정해지므로, 분야를 고르면 그 날짜만 따로 묻는다.
 */
function keyDatePrompt(field: InquiryFieldValue | ""): { label: string; placeholder: string } | null {
  switch (field) {
    case "inheritance-registration":
    case "inheritance-renunciation":
      return { label: "돌아가신 날 또는 상속인이 된 것을 안 날 (선택)", placeholder: "예: 9월 28일" };
    case "real-estate-registration":
    case "mortgage":
      return { label: "잔금일·대출 실행일 (선택)", placeholder: "예: 11월 30일 잔금" };
    case "corporate-registration":
      return { label: "임기 만료일·변경 결의일 (선택)", placeholder: "예: 대표이사 임기 12월 10일 만료" };
    case "preservation-registration":
      return { label: "사용승인일 (선택)", placeholder: "예: 10월 15일 사용승인" };
    default:
      return null;
  }
}

function buildInquiryBody(
  form: FormState,
  nationwideMode: boolean,
  meta: {
    sourcePage?: string;
    intentHint?: string;
    preparedDocsHint?: string;
    costGuideRequested?: boolean;
    pageUrl?: string;
    inquiryCluster?: string;
  },
): string {
  const fieldLabel = form.field ? getInquiryFieldLabel(form.field) : "미선택";
  const lines = [
    nationwideMode
      ? "[다옴법무사사무소 전국 의뢰 상담 신청]"
      : "[다옴법무사사무소 상담 신청]",
    `이름: ${form.name.trim() || "미기재"}`,
    `연락처: ${form.phone.trim()}`,
    `상담 분야: ${fieldLabel}`,
    `기한 기준일: ${form.keyDate.trim() || "-"}`,
    `서류 보유: ${form.hasDocuments ? "있음" : "없음/일부만 있음"}`,
    `유입 페이지: ${meta.sourcePage?.trim() || "-"}`,
    `문의 지역: ${form.propertyRegion.trim() || form.clientRegion.trim() || "부산(기본)"}`,
    `확인하고 싶은 내용: ${meta.intentHint?.trim() || "-"}`,
    `준비된 서류: ${meta.preparedDocsHint?.trim() || (form.hasDocuments ? "있음(상세는 본문)" : "없음/일부")}`,
    `비용 안내 요청: ${meta.costGuideRequested ? "예" : "아니오(본문 참고)"}`,
    `제출 URL: ${meta.pageUrl ?? "-"}`,
    `유입 클러스터: ${meta.inquiryCluster?.trim() || "-"}`,
    `기업 업무 선택: ${
      form.corporateTask ? getCorporateLegalTaskLabel(form.corporateTask) : "-"
    }`,
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

  lines.push("", "현재 상황:", form.situation.trim() || "(미기재)");
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
  inquiryCluster,
}: ConsultationInquiryFormProps) {
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
    if (!clientParseContact(form.phone)) {
      next.phone = "전화번호 또는 이메일 형식을 확인해 주세요.";
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
        inquiryCluster,
      });
      if (inquiryCluster === "corporate-legal") {
        trackB2BEvent("collaboration_form_submit", {
          source_page: sourcePage,
          category: "CORPORATE_LEGAL",
          service_type: form.corporateTask || form.field || undefined,
        });
      }
      const result = await submitQuickInquiry({
        message,
        contact: form.phone.trim(),
        consent: form.agreed,
        turnstileToken: token,
        website: honeypot,
        pageTitle: pageMeta.pageTitle,
        pageUrl: pageMeta.pageUrl,
        analyticsMeta: {
          kind: inquiryCluster === "corporate-legal" ? "corporate-legal" : "inquiry",
          field: String(form.field || inquiryCluster || "").slice(0, 40),
        },
        qualifyText: [
          intentPrefix && form.situation.startsWith(intentPrefix)
            ? form.situation.slice(intentPrefix.length)
            : form.situation,
          form.propertyRegion.trim() &&
          form.propertyRegion.trim() !== (defaultPropertyRegion ?? "").trim()
            ? form.propertyRegion
            : "",
          form.clientRegion,
        ]
          .join("\n")
          .trim(),
        hasDocuments: form.hasDocuments,
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
          남겨 주셨습니다
        </h2>
        {fieldLabel ? (
          <p className="inquiry-form__success-text">상담 분야: {fieldLabel}</p>
        ) : null}
        <PostInquiryNextSteps field={form.field || undefined} />

        <PostInquiryPhoneCta
          className="inquiry-form__success-call"
          hintClassName="inquiry-form__success-call-hint"
          buttonClassName="btn-primary inquiry-form__success-call-btn"
          phoneNumClassName="inquiry-form__phone-num"
        />

        <div className="inquiry-form__success-actions">
          <button
            type="button"
            className="font-medium text-navy underline decoration-navy/25 underline-offset-4"
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
          <Link
            href="/"
            className="font-medium text-navy underline decoration-navy/25 underline-offset-4"
          >
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
            : consultationCopy.contact}
        </p>
        <ul className="inquiry-form__reassure">
          <li>제출하시면 안윤정 법무사에게 메시지·이메일로 바로 전달되며, 사이트에는 저장하지 않습니다</li>
          <li>서류가 아직 없어도 됩니다. 알고 계신 상황만 적어 주세요</li>
          <li>급하시면 전화·카카오톡·네이버톡톡도 이용하실 수 있습니다</li>
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
          <span className="inquiry-form__label">성함 (선택)</span>
          <input
            id={`${formId}-name`}
            type="text"
            name="name"
            autoComplete="name"
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
        <span className="inquiry-form__label">상담 분야 (선택)</span>
        <select
          id={`${formId}-field`}
          name="field"
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

      {(() => {
        const prompt = keyDatePrompt(form.field);
        if (!prompt) return null;
        return (
          <label className="inquiry-form__field" htmlFor={`${formId}-key-date`}>
            <span className="inquiry-form__label">{prompt.label}</span>
            <input
              id={`${formId}-key-date`}
              type="text"
              name="keyDate"
              disabled={submitting}
              value={form.keyDate}
              onChange={(e) => setForm((prev) => ({ ...prev, keyDate: e.target.value }))}
              className="inquiry-form__input"
              placeholder={prompt.placeholder}
            />
            <span className="mt-1 block text-xs text-navy/55">
              기한이 가까운 문의부터 먼저 연락드립니다. 정확히 모르시면 대략만 적어 주세요.
            </span>
          </label>
        );
      })()}

      {form.field === "corporate-registration" ||
      inquiryCluster === "corporate-legal" ? (
        <label className="inquiry-form__field" htmlFor={`${formId}-corporate-task`}>
          <span className="inquiry-form__label">기업·법인 업무 (선택)</span>
          <select
            id={`${formId}-corporate-task`}
            name="corporateTask"
            disabled={submitting}
            value={form.corporateTask}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                corporateTask: e.target.value as CorporateLegalTaskValue | "",
              }))
            }
            className="inquiry-form__input"
          >
            <option value="">해당하면 선택해 주세요</option>
            {CORPORATE_LEGAL_TASK_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="inquiry-form__field" htmlFor={`${formId}-situation`}>
        <span className="inquiry-form__label">현재 상황 간단히 작성 (선택)</span>
        <textarea
          id={`${formId}-situation`}
          name="situation"
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
          <PrivacyConsentLabel
            linkClassName="inquiry-form__link"
            suffix="상담 목적 외 사용하지 않으며, 사이트 서버에 저장하지 않습니다."
          />
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

      {errors.form || errors.turnstile ? <InquiryFailureFallback className="mt-3" /> : null}

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

      <InquiryAltChannels
        channels={["kakao", "talk", "reservation", "map"]}
        placement="consult_page"
        pageSlug="contact-inquiry"
        title="신청서 대신 바로 연락하셔도 됩니다"
        description="작성이 번거로우시면 카카오톡·네이버톡톡으로 상황만 남기시거나, 네이버예약으로 방문 상담 일정을 잡으실 수 있습니다."
        className="mt-5"
      />

      <ConsultationFeeNotice />
    </form>
  );
}
