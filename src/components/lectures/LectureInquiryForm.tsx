"use client";

import { useCallback, useId, useMemo, useState } from "react";
import Link from "next/link";
import { KakaoIcon, NaverIcon } from "@/components/consultation/ConsultationIcons";
import { InquiryDeliverySuccess } from "@/components/quick-inquiry/InquiryDeliverySuccess";
import {
  isTurnstileConfigured,
  TurnstileWidget,
} from "@/components/quick-inquiry/TurnstileWidget";
import { trackCTA } from "@/lib/analytics/track-cta";
import { getContactInfo } from "@/lib/contact";
import {
  clientParseContact,
  submitQuickInquiry,
} from "@/lib/quick-inquiry/client";
import { HONEYPOT_FIELD } from "@/lib/quick-inquiry/shared";

const INSTITUTION_TYPES = [
  "지자체",
  "공공기관",
  "공기업",
  "학교",
  "대학",
  "도서관",
  "평생학습기관",
  "청년기관",
  "창업지원기관",
  "복지기관",
  "기업",
  "협회·단체",
  "기타",
] as const;

const TOPICS = [
  "전세사기 예방",
  "전월세 계약",
  "청년 생활법률",
  "디지털 법률",
  "개인정보와 온라인 분쟁",
  "생활 속 범죄 예방",
  "창업 법률",
  "기업 법률 리스크",
  "계약·금전분쟁",
  "상속 생활법률",
  "진로 특강",
  "기관 맞춤형 기획",
  "기타",
] as const;

const BUDGETS = [
  "미정",
  "기관 기준에 따름",
  "협의 후 안내 희망",
] as const;

type FieldErrors = {
  institution?: string;
  contactName?: string;
  phone?: string;
  audience?: string;
  agreed?: string;
  turnstile?: string;
  form?: string;
};

export function LectureInquiryForm() {
  const formId = useId();
  const [institution, setInstitution] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [institutionType, setInstitutionType] =
    useState<(typeof INSTITUTION_TYPES)[number]>("공공기관");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("전세사기 예방");
  const [audience, setAudience] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [format, setFormat] = useState("오프라인");
  const [venue, setVenue] = useState("");
  const [purpose, setPurpose] = useState("");
  const [budget, setBudget] =
    useState<(typeof BUDGETS)[number]>("기관 기준에 따름");
  const [needProposal, setNeedProposal] = useState(false);
  const [memo, setMemo] = useState("");
  const [agree, setAgree] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  const summaryLines = useMemo(
    () =>
      [
        "[법률 강의 문의]",
        `기관: ${institution || "-"}`,
        `담당: ${contactName || "-"}`,
        `유형: ${institutionType}`,
        `주제: ${topic}`,
        audience ? `대상: ${audience}` : "",
        headcount ? `예상인원: ${headcount}` : "",
        date ? `희망일: ${date}` : "",
        duration ? `시간: ${duration}` : "",
        `형식: ${format}`,
        venue ? `장소: ${venue}` : "",
        purpose ? `목적: ${purpose}` : "",
        `예산: ${budget}`,
        `제안서: ${needProposal ? "필요" : "선택"}`,
        phone ? `연락처: ${phone}` : "",
        email ? `이메일: ${email}` : "",
        memo ? `요청: ${memo}` : "",
      ].filter(Boolean),
    [
      institution,
      contactName,
      institutionType,
      topic,
      audience,
      headcount,
      date,
      duration,
      format,
      venue,
      purpose,
      budget,
      needProposal,
      phone,
      email,
      memo,
    ],
  );

  const summaryMultiline = useMemo(
    () => summaryLines.join("\n"),
    [summaryLines],
  );

  const { kakao, naverTalk } = getContactInfo();

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
    if (!institution.trim()) next.institution = "기관명을 입력해 주세요.";
    if (!contactName.trim()) next.contactName = "담당자명을 입력해 주세요.";
    if (!clientParseContact(phone)) {
      next.phone = "전화번호 또는 이메일 형식을 확인해 주세요.";
    }
    if (!audience.trim()) next.audience = "교육 대상을 입력해 주세요.";
    if (!agree) next.agreed = "개인정보 수집 동의에 체크해 주세요.";
    if (isTurnstileConfigured() && !token) {
      next.turnstile = "보안 확인을 완료해 주세요.";
    }
    return next;
  }

  function ensureChatReady(formEl: HTMLFormElement | null): boolean {
    if (formEl && !formEl.checkValidity()) {
      formEl.reportValidity();
      return false;
    }
    if (!agree) {
      setDeliveryNote("개인정보 수집 동의에 체크해 주세요.");
      return false;
    }
    return true;
  }

  async function copySummaryText(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(summaryMultiline);
      return true;
    } catch {
      return false;
    }
  }

  async function deliverByChat(
    channel: "kakao" | "naver",
    href: string,
    formEl: HTMLFormElement | null,
  ) {
    if (!ensureChatReady(formEl)) return;
    trackCTA(channel === "kakao" ? "kakao" : "naver-talk", "강의문의");
    const copied = await copySummaryText();
    setDeliveryNote(
      copied
        ? channel === "kakao"
          ? "문의 요약을 복사했습니다. 카카오톡 채팅창에 붙여넣어 보내 주세요."
          : "문의 요약을 복사했습니다. 네이버톡톡 채팅창에 붙여넣어 보내 주세요."
        : "요약 복사에 실패했습니다. 아래 요약을 직접 선택한 뒤 붙여넣어 주세요.",
    );
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const localErrors = validateLocal();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setDeliveryNote(null);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setDeliveryNote(null);
    trackCTA("contact", "강의문의");

    try {
      const result = await submitQuickInquiry({
        message: summaryMultiline,
        contact: phone.trim(),
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
      if (result.field === "contact") fieldErrors.phone = result.message;
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
    setContactName("");
    setPhone("");
    setEmail("");
    setInstitutionType("공공기관");
    setTopic("전세사기 예방");
    setAudience("");
    setHeadcount("");
    setDate("");
    setDuration("");
    setFormat("오프라인");
    setVenue("");
    setPurpose("");
    setBudget("기관 기준에 따름");
    setNeedProposal(false);
    setMemo("");
    setAgree(false);
    setDeliveryNote(null);
    setErrors({});
    setSubmitted(false);
    setHoneypot("");
    setToken("");
    setResetSignal((n) => n + 1);
  }

  if (submitted) {
    return (
      <InquiryDeliverySuccess
        title="강의 문의가 정상적으로 전달되었습니다"
        description="기관·주제·일정 요약을 확인한 뒤 담당자가 연락드립니다. 메일 앱을 열 필요 없이 사무소로 바로 전달됩니다."
        detail={`${institution || "기관"} · ${topic}`}
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
      className="space-y-4 rounded-2xl border border-beige-dark bg-cream/50 p-5 md:p-6"
      aria-label="법률 강의 문의"
      noValidate
      aria-busy={submitting}
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/50">
          이메일 문의 접수
        </p>
        <h2 className="text-lg font-semibold text-navy">강의·출강 문의 양식</h2>
        <p className="text-sm text-navy/70">
          초기 단계에서는 기관·대상·주제·일정만 받습니다. 제출하시면 사무소
          이메일로 바로 전달됩니다. 주민등록번호·사건 상세·건강정보 등
          민감정보는 적지 마세요.
        </p>
        <p className="flex flex-wrap items-center gap-2 text-sm text-navy/80">
          <RequiredBadge />
          <span>
            표시가 있는 항목은 반드시 입력해 주세요. 나머지는 선택 사항입니다.
          </span>
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

      <fieldset className="contents" disabled={submitting}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="기관명" required error={errors.institution}>
            <input
              required
              aria-required="true"
              className={fieldControlClass(true)}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              aria-invalid={Boolean(errors.institution)}
            />
          </Field>
          <Field label="담당자명" required error={errors.contactName}>
            <input
              required
              aria-required="true"
              className={fieldControlClass(true)}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              aria-invalid={Boolean(errors.contactName)}
            />
          </Field>
          <Field label="연락처" required error={errors.phone}>
            <input
              required
              aria-required="true"
              className={fieldControlClass(true)}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="회신 가능한 번호"
              aria-invalid={Boolean(errors.phone)}
            />
          </Field>
          <Field label="이메일">
            <input
              type="email"
              className={fieldControlClass(false)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="기관 유형">
            <select
              className={fieldControlClass(false)}
              value={institutionType}
              onChange={(e) =>
                setInstitutionType(e.target.value as (typeof INSTITUTION_TYPES)[number])
              }
            >
              {INSTITUTION_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="희망 강의 주제">
            <select
              className={fieldControlClass(false)}
              value={topic}
              onChange={(e) => setTopic(e.target.value as (typeof TOPICS)[number])}
            >
              {TOPICS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="교육 대상" required error={errors.audience}>
            <input
              required
              aria-required="true"
              className={fieldControlClass(true)}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="예: 청년 30명, 신입사원"
              aria-invalid={Boolean(errors.audience)}
            />
          </Field>
          <Field label="예상 인원">
            <input
              className={fieldControlClass(false)}
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
            />
          </Field>
          <Field label="희망 날짜">
            <input
              className={fieldControlClass(false)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="예: 2026-09 셋째 주"
            />
          </Field>
          <Field label="희망 시간">
            <input
              className={fieldControlClass(false)}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="예: 90분"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="진행 방식">
            <select
              className={fieldControlClass(false)}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="오프라인">오프라인</option>
              <option value="온라인">온라인</option>
              <option value="혼합">혼합</option>
            </select>
          </Field>
          <Field label="예산 범위">
            <select
              className={fieldControlClass(false)}
              value={budget}
              onChange={(e) => setBudget(e.target.value as (typeof BUDGETS)[number])}
            >
              {BUDGETS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="강의 장소">
          <input
            className={fieldControlClass(false)}
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </Field>

        <Field label="교육 목적">
          <textarea
            className={fieldControlClass(false)}
            rows={3}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </Field>

        <Field label="기타 요청사항">
          <textarea
            className={fieldControlClass(false)}
            rows={3}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </Field>

        <label className="flex items-start gap-2 text-sm text-navy">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-navy"
            checked={needProposal}
            onChange={(e) => setNeedProposal(e.target.checked)}
          />
          강의 제안서·강사 프로필이 필요합니다
        </label>

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
            문의 처리를 위한 연락처·기관 정보 수집에 동의합니다. (민감정보 제외)
            {errors.agreed ? (
              <span className="mt-1 block text-red-700">{errors.agreed}</span>
            ) : null}
          </span>
        </label>
      </fieldset>

      <div className="rounded-xl border border-navy/10 bg-white/80 p-3 text-xs leading-relaxed text-navy/70">
        <p className="font-semibold text-navy">문의 요약 (미리보기)</p>
        <pre className="mt-2 whitespace-pre-wrap break-keep font-sans text-xs text-navy/75">
          {summaryMultiline}
        </pre>
      </div>

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

      <div className="overflow-hidden rounded-2xl border border-navy/15 bg-navy text-cream shadow-sm">
        <div className="space-y-2 px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cream/70">
            바로 문의하기
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-cream sm:text-xl">
            작성하신 내용을 사무소로 바로 보내세요
          </h3>
          <p className="text-sm leading-relaxed text-cream/80">
            아래 버튼으로 제출하면 메일 앱 없이 사무소 이메일로 전달됩니다.
            카카오톡·네이버톡톡으로도 요약을 붙여 보낼 수 있습니다.
          </p>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          <button
            type="submit"
            disabled={!agree || submitting}
            className="interactive-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cream px-3 text-sm font-semibold text-navy hover:bg-beige disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="inquiry-form__spinner inquiry-form__spinner--button" aria-hidden />
                전송 중…
              </>
            ) : (
              <>
                <SendIcon className="h-5 w-5 shrink-0" />
                문의 보내기
              </>
            )}
          </button>

          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            {kakao ? (
              <button
                type="button"
                disabled={!agree || submitting}
                onClick={(e) =>
                  void deliverByChat(
                    "kakao",
                    kakao,
                    e.currentTarget.closest("form"),
                  )
                }
                className="interactive-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-3 text-sm font-semibold text-[#191919] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <KakaoIcon className="h-5 w-5 shrink-0" />
                카카오톡으로 전달
              </button>
            ) : null}

            {naverTalk ? (
              <button
                type="button"
                disabled={!agree || submitting}
                onClick={(e) =>
                  void deliverByChat(
                    "naver",
                    naverTalk,
                    e.currentTarget.closest("form"),
                  )
                }
                className="interactive-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#03C75A] px-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <NaverIcon className="h-5 w-5 shrink-0" />
                네이버톡톡으로 전달
              </button>
            ) : null}
          </div>
        </div>

        {deliveryNote ? (
          <p
            className="border-t border-cream/15 px-4 py-3 text-sm text-cream/90 sm:px-5"
            role="status"
          >
            {deliveryNote}
          </p>
        ) : (
          <p className="border-t border-cream/15 px-4 py-3 text-sm text-cream/65 sm:px-5">
            동의·보안 확인 후 보내면 됩니다. 보통 영업일 기준 빠르게 회신드립니다.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/강사소개" className="btn-secondary">
          강사 프로필 보기
        </Link>
        <Link href="/법률강의" className="btn-secondary">
          강의 안내 보기
        </Link>
      </div>
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
        {required ? <RequiredBadge /> : (
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

function SendIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12l16-7-6.5 16-2.5-6.5L4 12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
