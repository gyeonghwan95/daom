"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { InquiryDeliverySuccess } from "@/components/quick-inquiry/InquiryDeliverySuccess";
import {
  isTurnstileConfigured,
  TurnstileWidget,
} from "@/components/quick-inquiry/TurnstileWidget";
import { trackB2BEvent } from "@/lib/analytics/track-b2b";
import { trackCTA } from "@/lib/analytics/track-cta";
import {
  clientParseContact,
  submitQuickInquiry,
} from "@/lib/quick-inquiry/client";
import { HONEYPOT_FIELD } from "@/lib/quick-inquiry/shared";
import { PrivacyConsentLabel } from "@/components/legal/PrivacyConsentLabel";

const TOPICS = [
  "전세사기 예방",
  "청년 생활법률",
  "디지털 법률",
  "창업·기업 법률",
  "진로 특강",
  "기관 맞춤 기획",
  "기타·상담 후 결정",
] as const;

const FORMATS = [
  "미정",
  "특강",
  "워크숍",
  "세미나",
  "직원교육",
  "강연",
] as const;

const AUDIENCES = [
  "미정",
  "임직원",
  "신입사원",
  "공공기관 직원",
  "청년",
  "창업자",
  "기관 종사자",
] as const;

type FieldErrors = {
  contact?: string;
  agreed?: string;
  turnstile?: string;
  form?: string;
};

/**
 * 강의 문의 — Resend(quick-inquiry) 메일 접수.
 * 입력 항목을 최소화해 문의 문턱을 낮춥니다.
 */
export function LectureInquiryForm() {
  const formId = useId();
  const [institution, setInstitution] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("전세사기 예방");
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("미정");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("미정");
  const [memo, setMemo] = useState("");
  const [agree, setAgree] = useState(false);
  const startedRef = useRef(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  const summaryMultiline = useMemo(
    () =>
      [
        "[법률 강의 문의]",
        institution.trim() ? `기관: ${institution.trim()}` : "기관: (미기재)",
        `연락처: ${contact.trim() || "-"}`,
        `희망 주제: ${topic}`,
        format !== "미정" ? `행사 형태: ${format}` : "",
        audience !== "미정" ? `교육 대상: ${audience}` : "",
        memo.trim() ? `요청: ${memo.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [institution, contact, topic, format, audience, memo],
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const path =
      typeof window !== "undefined" ? window.location.pathname : "/강의문의";
    trackB2BEvent("lecture_inquiry_start", {
      source_page: path,
      category: "LECTURE",
      placement: "lecture_form",
    });
  }, []);

  const pageMeta = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        pageTitle: "강의문의",
        pageUrl: "https://다옴법무사사무소.kr/강의문의",
      };
    }
    return {
      pageTitle: document.title || "강의문의",
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

  function validateLocal(): FieldErrors {
    const next: FieldErrors = {};
    if (!clientParseContact(contact)) {
      next.contact = "회신 가능한 전화번호 또는 이메일을 입력해 주세요.";
    }
    if (!agree) next.agreed = "개인정보 수집 동의에 체크해 주세요.";
    if (isTurnstileConfigured() && !token) {
      next.turnstile = "보안 확인을 완료해 주세요.";
    }
    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const localErrors = validateLocal();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    const path =
      typeof window !== "undefined" ? window.location.pathname : "/강의문의";
    trackCTA("contact", path.replace(/^\//, "") || "강의문의", path);
    trackB2BEvent("lecture_inquiry_submit", {
      source_page: path,
      category: "LECTURE",
      lectureIntent: topic,
      placement: "lecture_form",
    });

    try {
      const result = await submitQuickInquiry({
        message: summaryMultiline,
        contact: contact.trim(),
        consent: agree,
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
      if (result.field === "contact") fieldErrors.contact = result.message;
      else if (result.field === "consent") fieldErrors.agreed = result.message;
      else if (result.field === "turnstile") fieldErrors.turnstile = result.message;
      else fieldErrors.form = result.message;
      setErrors(fieldErrors);
      setToken("");
      setResetSignal((n) => n + 1);
    } catch {
      setErrors({
        form: "네트워크 연결을 확인해 주세요. 작성하신 내용은 그대로 유지됩니다.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setInstitution("");
    setContact("");
    setTopic("전세사기 예방");
    setFormat("미정");
    setAudience("미정");
    setMemo("");
    setAgree(false);
    setErrors({});
    setSubmitted(false);
    setHoneypot("");
    setToken("");
    setResetSignal((n) => n + 1);
  }

  if (submitted) {
    return (
      <InquiryDeliverySuccess
        title="강의 문의가 전달되었습니다"
        description="사무소 이메일로 접수되었습니다. 확인 후 빠르게 회신드립니다."
        detail={`${institution.trim() || "기관"} · ${topic}`}
        secondaryHref="/강사소개"
        secondaryLabel="강사 프로필 보기"
        resetLabel="새 강의 문의 작성"
        onReset={resetForm}
      />
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-5 rounded-2xl border border-beige-dark bg-cream/50 p-5 md:p-6"
      aria-label="법률 강의 문의"
      noValidate
      aria-busy={submitting}
    >
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/50">
          이메일 문의 · Resend 접수
        </p>
        <h2 className="text-lg font-semibold text-navy">강의 문의</h2>
        <p className="text-sm leading-relaxed text-navy/70">
          연락처와 희망 주제만 남겨 주세요. 제출하시면 사무소 메일로 바로
          전달됩니다. 주민등록번호·사건 상세 등 민감정보는 적지 마세요.
        </p>
      </div>

      {errors.form ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {errors.form}
        </div>
      ) : null}

      <fieldset className="space-y-4" disabled={submitting}>
        <Field label="연락처" required error={errors.contact}>
          <input
            required
            aria-required="true"
            className={fieldControlClass(true)}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="전화번호 또는 이메일"
            aria-invalid={Boolean(errors.contact)}
            autoComplete="tel"
          />
        </Field>

        <Field label="기관명">
          <input
            className={fieldControlClass(false)}
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="예: ○○도서관, ○○청년센터 (나중에 알려주셔도 됩니다)"
          />
        </Field>

        <Field label="희망 주제">
          <select
            className={fieldControlClass(false)}
            value={topic}
            onChange={(e) =>
              setTopic(e.target.value as (typeof TOPICS)[number])
            }
          >
            {TOPICS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="행사 형태">
          <select
            className={fieldControlClass(false)}
            value={format}
            onChange={(e) =>
              setFormat(e.target.value as (typeof FORMATS)[number])
            }
          >
            {FORMATS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="교육 대상">
          <select
            className={fieldControlClass(false)}
            value={audience}
            onChange={(e) =>
              setAudience(e.target.value as (typeof AUDIENCES)[number])
            }
          >
            {AUDIENCES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="한 줄 요청">
          <textarea
            className={fieldControlClass(false)}
            rows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 9월 중 90분, 청년 30명 대상 (선택)"
          />
        </Field>

        <label className="flex items-start gap-3 rounded-xl border border-navy/25 bg-white px-4 py-3 text-sm text-navy shadow-[inset_3px_0_0_0_var(--navy)]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-navy"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.agreed)}
          />
          <span className="min-w-0 leading-relaxed">
            <span className="mb-1 flex flex-wrap items-center gap-2 font-semibold">
              개인정보 수집 동의
              <RequiredBadge />
            </span>
            <PrivacyConsentLabel
              lead="문의 회신을 위한"
              suffix="(민감정보 제외)"
            />
            {errors.agreed ? (
              <span className="mt-1 block text-red-700">{errors.agreed}</span>
            ) : null}
          </span>
        </label>
      </fieldset>

      <label className="inquiry-form__hp" htmlFor={`${formId}-hp`}>
        웹사이트
        <input
          id={`${formId}-hp`}
          name={HONEYPOT_FIELD}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      {isTurnstileConfigured() ? (
        <div>
          <TurnstileWidget
            onToken={handleTurnstileToken}
            onError={handleTurnstileError}
            resetSignal={resetSignal}
          />
          {errors.turnstile ? (
            <p className="mt-2 text-sm text-red-700" role="alert">
              {errors.turnstile}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!agree || submitting}
        className="interactive-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 text-sm font-semibold text-cream hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <span
              className="inquiry-form__spinner inquiry-form__spinner--button"
              aria-hidden
            />
            전송 중…
          </>
        ) : (
          "이메일로 문의 보내기"
        )}
      </button>

      <p className="text-center text-xs text-navy/55">
        보통 영업일 기준 빠르게 회신드립니다.{" "}
        <Link
          href="/강사소개"
          className="font-medium text-navy underline-offset-2 hover:underline"
        >
          강사 프로필
        </Link>
        {" · "}
        <Link
          href="/법률강의"
          className="font-medium text-navy underline-offset-2 hover:underline"
        >
          강의 안내
        </Link>
      </p>
    </form>
  );
}

function RequiredBadge() {
  return (
    <span className="inline-flex items-center rounded-md bg-navy px-1.5 py-0.5 text-[11px] font-bold leading-none tracking-wide text-cream">
      필수
    </span>
  );
}

function fieldControlClass(required: boolean) {
  if (required) {
    return "mt-2 w-full rounded-lg border border-navy/35 bg-white px-3 py-3 text-sm text-navy shadow-[inset_3px_0_0_0_var(--navy)] outline-none ring-navy/15 focus:ring-2 disabled:opacity-70";
  }
  return "mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm text-navy outline-none ring-navy/15 focus:ring-2 disabled:opacity-70";
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="flex flex-wrap items-center gap-2 font-semibold text-navy">
        {label}
        {required ? (
          <RequiredBadge />
        ) : (
          <span className="text-xs font-medium text-navy/40">선택</span>
        )}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-sm text-red-700" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
