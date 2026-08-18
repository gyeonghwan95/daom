"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { InquiryDeliverySuccess } from "@/components/quick-inquiry/InquiryDeliverySuccess";
import {
  isTurnstileConfigured,
  TurnstileWidget,
} from "@/components/quick-inquiry/TurnstileWidget";
import { getContactInfo, getDirectConsultationChannels } from "@/lib/contact";
import {
  clientParseContact,
  submitQuickInquiry,
} from "@/lib/quick-inquiry/client";
import { HONEYPOT_FIELD } from "@/lib/quick-inquiry/shared";
import { PrivacyConsentLabel } from "@/components/legal/PrivacyConsentLabel";

const COMPANY_TYPES = [
  "중소기업",
  "스타트업·초기기업",
  "제조·산업단지",
  "유통·서비스",
  "공공기관 거래기업",
  "기타",
] as const;

const WORK_OPTIONS = [
  "법인설립",
  "임원변경",
  "본점이전",
  "목적·상호 변경",
  "증자·감자",
  "해산·청산",
  "기업 부동산등기",
  "근저당 설정·말소",
  "미수금 내용증명",
  "지급명령",
  "가압류·가처분 신청서류",
  "공탁",
  "공공기관 등기",
  "복대리·대량등기",
  "법인등기 정기점검",
  "기업 법률교육",
  "기타",
] as const;

type FormState = {
  companyName: string;
  contactName: string;
  department: string;
  phone: string;
  email: string;
  companyType: string;
  workType: string;
  deadline: string;
  documents: string;
  summary: string;
  agreed: boolean;
};

const initialState: FormState = {
  companyName: "",
  contactName: "",
  department: "",
  phone: "",
  email: "",
  companyType: "",
  workType: "",
  deadline: "",
  documents: "",
  summary: "",
  agreed: false,
};

type FieldErrors = {
  companyName?: string;
  contactName?: string;
  phone?: string;
  workType?: string;
  summary?: string;
  agreed?: string;
  turnstile?: string;
  form?: string;
};

function buildBody(form: FormState): string {
  return [
    "[다옴법무사사무소 기업 업무 문의]",
    `회사명: ${form.companyName}`,
    `담당자: ${form.contactName}`,
    `부서: ${form.department || "미기재"}`,
    `연락처: ${form.phone}`,
    `이메일: ${form.email || "미기재"}`,
    `기업 유형: ${form.companyType || "미선택"}`,
    `문의 업무: ${form.workType || "미선택"}`,
    `관련 기한: ${form.deadline || "미기재"}`,
    `보유 서류: ${form.documents || "미기재"}`,
    "",
    "문의 요약:",
    form.summary,
    "",
    "※ 주민등록번호·인감 비밀번호·인증서·통장 전체 사본은 보내지 마세요.",
  ].join("\n");
}

const INPUT_CLASS =
  "w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2 disabled:bg-beige/40 disabled:opacity-70";

export function BusinessInquiryForm() {
  const channels = getDirectConsultationChannels();
  const { phone } = getContactInfo();
  const kakao = channels.find((channel) => channel.id === "kakao");
  const formId = useId();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  const pageMeta = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        pageTitle: "기업업무문의",
        pageUrl: "https://다옴법무사사무소.kr/기업업무문의",
      };
    }
    return {
      pageTitle: document.title || "기업업무문의",
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
    if (!form.companyName.trim()) next.companyName = "회사명을 입력해 주세요.";
    if (!form.contactName.trim()) next.contactName = "담당자명을 입력해 주세요.";
    if (!clientParseContact(form.phone)) {
      next.phone = "전화번호 또는 이메일 형식을 확인해 주세요.";
    }
    if (!form.workType) next.workType = "문의 업무를 선택해 주세요.";
    if (form.summary.trim().length < 5) {
      next.summary = "문의 요약을 조금 더 구체적으로 적어 주세요.";
    }
    if (!form.agreed) {
      next.agreed = "개인정보 수집·이용에 동의해 주세요.";
    }
    if (isTurnstileConfigured() && !token) {
      next.turnstile = "보안 확인을 완료해 주세요.";
    }
    return next;
  }

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
      const result = await submitQuickInquiry({
        message: buildBody(form),
        contact: form.phone.trim(),
        consent: form.agreed,
        turnstileToken: token,
        website: honeypot,
        pageTitle: pageMeta.pageTitle,
        pageUrl: pageMeta.pageUrl,
        analyticsMeta: {
          kind: "business",
          field: String(form.workType || "").slice(0, 40),
        },
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
      else if (result.field === "message") fieldErrors.summary = result.message;
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

  if (submitted) {
    return (
      <InquiryDeliverySuccess
        title="기업 업무 문의가 정상적으로 전달되었습니다"
        description="남겨주신 내용을 확인한 뒤 담당자가 연락드립니다. 메일 앱을 열 필요 없이 사무소로 바로 전달됩니다."
        detail={form.workType || undefined}
        secondaryHref="/부산기업법률자문"
        secondaryLabel="기업 법률실무 허브로 돌아가기"
        resetLabel="새 기업 문의 작성"
        onReset={() => {
          setSubmitted(false);
          setForm(initialState);
          setErrors({});
          setHoneypot("");
          setToken("");
          setResetSignal((n) => n + 1);
        }}
      />
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-4 rounded-2xl border border-beige-dark bg-white p-5 md:p-6"
      noValidate
      aria-busy={submitting}
    >
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/50">
          이메일 문의 접수
        </p>
        <h2 className="text-lg font-semibold text-navy">기업 업무 문의</h2>
        <p className="text-sm text-navy/70">
          제출하시면 사무소 이메일로 안전하게 전달됩니다. 주민등록번호, 법인인감
          비밀번호, 금융·인증서 정보, 통장 전체 사본은 기재하지 마세요.
        </p>
      </header>

      {errors.form ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {errors.form}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="회사명" required error={errors.companyName}>
          <input
            required
            disabled={submitting}
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.companyName)}
          />
        </Field>
        <Field label="담당자명" required error={errors.contactName}>
          <input
            required
            disabled={submitting}
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.contactName)}
          />
        </Field>
        <Field label="부서">
          <input
            disabled={submitting}
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className={INPUT_CLASS}
            placeholder="경영지원·총무·재무 등"
          />
        </Field>
        <Field label="연락처" required error={errors.phone}>
          <input
            required
            disabled={submitting}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>
        <Field label="이메일">
          <input
            disabled={submitting}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="기업 유형">
          <select
            disabled={submitting}
            value={form.companyType}
            onChange={(e) => setForm({ ...form, companyType: e.target.value })}
            className={INPUT_CLASS}
          >
            <option value="">선택</option>
            {COMPANY_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="문의 업무" required error={errors.workType}>
          <select
            required
            disabled={submitting}
            value={form.workType}
            onChange={(e) => setForm({ ...form, workType: e.target.value })}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.workType)}
          >
            <option value="">선택</option>
            {WORK_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="관련 기한">
          <input
            disabled={submitting}
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className={INPUT_CLASS}
            placeholder="잔금일·임기만료·제출기한 등"
          />
        </Field>
      </div>
      <Field label="보유 서류">
        <input
          disabled={submitting}
          value={form.documents}
          onChange={(e) => setForm({ ...form, documents: e.target.value })}
          className={INPUT_CLASS}
          placeholder="등기부등본, 계약서, 세금계산서 등 (목록만)"
        />
      </Field>
      <Field label="문의 요약" required error={errors.summary}>
        <textarea
          required
          disabled={submitting}
          rows={5}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className={INPUT_CLASS}
          placeholder="상황과 확인하고 싶은 점을 간단히 적어 주세요."
          aria-invalid={Boolean(errors.summary)}
        />
      </Field>
      <label className="flex items-start gap-2 text-sm text-navy/80">
        <input
          type="checkbox"
          required
          disabled={submitting}
          checked={form.agreed}
          onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
          className="mt-1"
          aria-invalid={Boolean(errors.agreed)}
        />
        <span>
          <PrivacyConsentLabel
            lead="상담 연락을 위한"
            suffix="민감정보는 제출하지 않습니다."
          />
          {errors.agreed ? (
            <span className="mt-1 block text-red-700">{errors.agreed}</span>
          ) : null}
        </span>
      </label>

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

      {submitting ? (
        <p className="flex items-center gap-2 text-sm text-navy/70" aria-live="polite">
          <span className="inquiry-form__spinner" aria-hidden />
          문의 내용을 안전하게 전달하는 중입니다…
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary inline-flex min-h-11 items-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="inquiry-form__spinner inquiry-form__spinner--button" aria-hidden />
              전송 중…
            </>
          ) : (
            "기업 업무 문의 보내기"
          )}
        </button>
        {phone ? (
          <a href={`tel:${phone.replace(/-/g, "")}`} className="btn-secondary">
            전화 상담
          </a>
        ) : null}
        {kakao?.configured ? (
          <a
            href={kakao.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            카카오 상담
          </a>
        ) : null}
      </div>
    </form>
  );
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
      <span className="mb-1.5 block font-medium text-navy">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
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
