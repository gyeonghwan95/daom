"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InquiryDeliverySuccess } from "@/components/quick-inquiry/InquiryDeliverySuccess";
import {
  isTurnstileConfigured,
  TurnstileWidget,
} from "@/components/quick-inquiry/TurnstileWidget";
import { trackB2BEvent } from "@/lib/analytics/track-b2b";
import {
  PARTNER_OPTIONS,
  PREP_STAGE_OPTIONS,
  SERVICE_OPTIONS,
  SIZE_BAND_OPTIONS,
  partnerLabel,
  serviceLabel,
} from "@/lib/b2b/options";
import type {
  PartnerType,
  PrepStage,
  ProjectSizeBand,
  ServiceType,
} from "@/lib/b2b/types";
import {
  clientParseContact,
  submitQuickInquiry,
} from "@/lib/quick-inquiry/client";
import { HONEYPOT_FIELD } from "@/lib/quick-inquiry/shared";
import { PrivacyConsentLabel } from "@/components/legal/PrivacyConsentLabel";

type FormState = {
  partner: PartnerType | "";
  service: ServiceType | "";
  name: string;
  phone: string;
  email: string;
  summary: string;
  agreed: boolean;
  orgName: string;
  role: string;
  location: string;
  registryOffice: string;
  sizeBand: ProjectSizeBand | "";
  buildingType: string;
  dongCount: string;
  unitCount: string;
  desiredDate: string;
  deadline: string;
  prepStage: PrepStage | "";
  trustRelated: string;
  loanRelated: string;
  recurring: string;
  preferredContact: string;
  contactTime: string;
  extra: string;
  receiptDate: string;
  correctionStatus: string;
  deliveryMethod: string;
  listingFile: string;
  followOnRegs: string;
  agencyType: string;
  bidRelated: string;
  quoteDeadline: string;
};

const initial: FormState = {
  partner: "",
  service: "",
  name: "",
  phone: "",
  email: "",
  summary: "",
  agreed: false,
  orgName: "",
  role: "",
  location: "",
  registryOffice: "",
  sizeBand: "",
  buildingType: "",
  dongCount: "",
  unitCount: "",
  desiredDate: "",
  deadline: "",
  prepStage: "",
  trustRelated: "",
  loanRelated: "",
  recurring: "",
  preferredContact: "",
  contactTime: "",
  extra: "",
  receiptDate: "",
  correctionStatus: "",
  deliveryMethod: "",
  listingFile: "",
  followOnRegs: "",
  agencyType: "",
  bidRelated: "",
  quoteDeadline: "",
};

const INPUT =
  "mt-1.5 w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2 disabled:bg-beige/40 disabled:opacity-70";

function buildBody(form: FormState): string {
  return [
    "[다옴법무사사무소 협업·프로젝트 문의]",
    `문의자 유형: ${partnerLabel(form.partner) || "미선택"}`,
    `업무 유형: ${serviceLabel(form.service) || "미선택"}`,
    `담당자: ${form.name}`,
    `전화: ${form.phone || "미기재"}`,
    `이메일: ${form.email || "미기재"}`,
    `회사·기관·사무소: ${form.orgName || "미기재"}`,
    `직책: ${form.role || "미기재"}`,
    `소재지: ${form.location || "미기재"}`,
    `관할 등기소: ${form.registryOffice || "미기재"}`,
    `예상 건수: ${form.sizeBand || "미선택"}`,
    `건물 유형: ${form.buildingType || "미기재"}`,
    `동 수: ${form.dongCount || "미기재"}`,
    `호실 수: ${form.unitCount || "미기재"}`,
    `희망 일정: ${form.desiredDate || "미기재"}`,
    `잔금·사용승인·마감: ${form.deadline || "미기재"}`,
    `준비 단계: ${form.prepStage || "미선택"}`,
    `신탁 여부: ${form.trustRelated || "미기재"}`,
    `담보대출 여부: ${form.loanRelated || "미기재"}`,
    `반복 의뢰: ${form.recurring || "미기재"}`,
    `선호 연락: ${form.preferredContact || "미기재"}`,
    `연락 가능 시간: ${form.contactTime || "미기재"}`,
    `접수 희망일: ${form.receiptDate || "미기재"}`,
    `보정 여부: ${form.correctionStatus || "미기재"}`,
    `원본 전달 방식: ${form.deliveryMethod || "미기재"}`,
    `목록 파일: ${form.listingFile || "미기재"}`,
    `후속 등기: ${form.followOnRegs || "미기재"}`,
    `기관 유형: ${form.agencyType || "미기재"}`,
    `입찰·용역: ${form.bidRelated || "미기재"}`,
    `견적 기한: ${form.quoteDeadline || "미기재"}`,
    "",
    "문의 내용:",
    form.summary,
    "",
    "추가 설명:",
    form.extra || "없음",
    "",
    "※ 주민등록번호·인감·등기필정보·금융정보 등 민감서류는 보내지 마세요.",
  ].join("\n");
}

function resolveContact(phone: string, email: string): string | null {
  const phoneParsed = clientParseContact(phone);
  if (phoneParsed) return phone.trim();
  const emailParsed = clientParseContact(email);
  if (emailParsed) return email.trim();
  return null;
}

function mapTypeParam(raw: string | null): Partial<FormState> {
  if (!raw) return {};
  const map: Record<string, Partial<FormState>> = {
    delegation: { service: "delegation" },
    recurring: { service: "other", recurring: "예" },
    urgent: { prepStage: "urgent" },
    project: { service: "bulk" },
    quote: { service: "quote" },
    "local-support": { service: "delegation" },
  };
  return map[raw] ?? {};
}

function mapFromSearchParams(
  searchParams: URLSearchParams | { get: (key: string) => string | null },
): Partial<FormState> {
  const partner = searchParams.get("partner") as PartnerType | null;
  const service = searchParams.get("service") as ServiceType | null;
  const type = searchParams.get("type");
  const fromType = mapTypeParam(type);
  return {
    ...fromType,
    partner:
      partner && PARTNER_OPTIONS.some((o) => o.value === partner)
        ? partner
        : undefined,
    service:
      service && SERVICE_OPTIONS.some((o) => o.value === service)
        ? service
        : fromType.service,
  };
}

export function ProjectBriefForm({ sourcePage = "협업문의" }: { sourcePage?: string }) {
  const searchParams = useSearchParams();
  const formId = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(() => ({
    ...initial,
    ...mapFromSearchParams(searchParams),
  }));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackB2BEvent("project_brief_start", {
      source_page: sourcePage,
      category: form.partner === "public" ? "PUBLIC_SECTOR" : undefined,
      partner_type: form.partner || undefined,
    });
  }, [sourcePage, form.partner]);

  const pageMeta = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        pageTitle: `협업문의 · ${sourcePage}`,
        pageUrl: "https://다옴법무사사무소.kr/협업문의",
      };
    }
    return {
      pageTitle: document.title || `협업문의 · ${sourcePage}`,
      pageUrl: window.location.href,
    };
  }, [sourcePage]);

  const step1Valid =
    form.partner !== "" &&
    form.service !== "" &&
    form.name.trim().length > 0 &&
    Boolean(resolveContact(form.phone, form.email)) &&
    form.summary.trim().length >= 5 &&
    form.agreed;

  const handleTurnstileToken = useCallback((nextToken: string) => {
    setToken(nextToken);
    if (nextToken) setErrorSummary(null);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setErrorSummary("보안 확인을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.");
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goStep2() {
    if (!step1Valid) {
      setErrorSummary(
        "문의자 유형, 업무 유형, 담당자명, 전화 또는 이메일, 문의 내용(5자 이상), 개인정보 동의를 확인해 주세요.",
      );
      return;
    }
    setErrorSummary(null);
    setStep(2);
    trackB2BEvent("project_brief_step_complete", {
      source_page: sourcePage,
      category: form.partner === "public" ? "PUBLIC_SECTOR" : undefined,
      partner_type: form.partner || undefined,
      service_type: form.service || undefined,
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;

    if (!step1Valid) {
      setStep(1);
      setErrorSummary("필수 항목을 확인해 주세요.");
      return;
    }
    if (isTurnstileConfigured() && !token) {
      setErrorSummary("보안 확인을 완료해 주세요.");
      return;
    }

    const contact = resolveContact(form.phone, form.email);
    if (!contact) {
      setStep(1);
      setErrorSummary("전화번호 또는 이메일 형식을 확인해 주세요.");
      return;
    }

    setSubmitting(true);
    setErrorSummary(null);

    trackB2BEvent("project_brief_submit", {
      source_page: sourcePage,
      category: form.partner === "public" ? "PUBLIC_SECTOR" : undefined,
      partner_type: form.partner || undefined,
      service_type: form.service || undefined,
      lead_size_band: form.sizeBand || undefined,
      urgency_band: form.prepStage === "urgent" ? "urgent" : undefined,
    });

    try {
      const result = await submitQuickInquiry({
        message: buildBody(form),
        contact,
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

      setErrorSummary(result.message);
      setToken("");
      setResetSignal((n) => n + 1);
    } catch {
      setErrorSummary(
        "네트워크 연결을 확인해 주세요. 작성하신 내용은 그대로 유지됩니다.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    const detailParts = [
      serviceLabel(form.service),
      partnerLabel(form.partner),
    ].filter(Boolean);
    return (
      <div id="project-brief">
        <InquiryDeliverySuccess
          title="협업 문의가 정상적으로 전달되었습니다"
          description="남겨주신 프로젝트 요약을 확인한 뒤 담당자가 연락드립니다. 메일 앱을 열 필요 없이 사무소로 바로 전달됩니다."
          detail={detailParts.join(" · ") || undefined}
          secondaryHref="/법무사협업"
          secondaryLabel="협업 안내로 돌아가기"
          resetLabel="새 협업 문의 작성"
          onReset={() => {
            setSubmitted(false);
            setStep(1);
            setForm({ ...initial, ...mapFromSearchParams(searchParams) });
            setErrorSummary(null);
            setHoneypot("");
            setToken("");
            setResetSignal((n) => n + 1);
          }}
        />
      </div>
    );
  }

  const showDelegation =
    form.service === "delegation" || form.service === "receipt-correction";
  const showPreservation = form.service === "preservation";
  const showBulk = form.service === "bulk";
  const showPublic = form.service === "public" || form.partner === "public";

  return (
    <form
      id="project-brief"
      onSubmit={(e) => void handleSubmit(e)}
      className="card-surface space-y-5 p-5 md:p-8"
      noValidate
      aria-labelledby="project-brief-title"
      aria-busy={submitting}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/50">
          이메일 문의 접수
        </p>
        <h2 id="project-brief-title" className="section-heading mt-1">
          협업·프로젝트 문의
        </h2>
        <p className="body-text mt-2 text-sm text-navy/75">
          2단계로 나뉘어 있습니다. 1단계만 입력해도 사무소 이메일로 바로
          전달됩니다. 메일 앱을 열 필요가 없습니다.
        </p>
        <p className="mt-2 text-xs text-navy/55" aria-live="polite">
          현재 {step}단계 / 2단계
        </p>
      </div>

      {errorSummary ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {errorSummary}
        </div>
      ) : null}

      {step === 1 ? (
        <fieldset className="space-y-4" disabled={submitting}>
          <legend className="sr-only">1단계 빠른 문의</legend>
          <label className="block text-sm font-medium text-navy">
            문의자 유형
            <select
              className={INPUT}
              value={form.partner}
              onChange={(e) => update("partner", e.target.value as PartnerType)}
              required
            >
              <option value="">선택</option>
              {PARTNER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-navy">
            업무 유형
            <select
              className={INPUT}
              value={form.service}
              onChange={(e) => update("service", e.target.value as ServiceType)}
              required
            >
              <option value="">선택</option>
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-navy">
            성명 또는 담당자명
            <input
              className={INPUT}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-navy">
              전화번호
              <input
                className={INPUT}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              이메일
              <input
                className={INPUT}
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
              />
            </label>
          </div>
          <p className="text-xs text-navy/55">전화 또는 이메일 중 하나는 필수입니다.</p>
          <label className="block text-sm font-medium text-navy">
            간단한 문의 내용
            <textarea
              className={`${INPUT} min-h-28`}
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
              required
            />
          </label>
          <label className="flex items-start gap-2 text-sm text-navy/85">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.agreed}
              onChange={(e) => update("agreed", e.target.checked)}
              required
            />
            <span>
              <PrivacyConsentLabel
                lead="문의 처리를 위한"
                suffix="민감 원본서류는 초기 문의에 첨부하지 않습니다."
              />
            </span>
          </label>
        </fieldset>
      ) : (
        <fieldset className="space-y-4" disabled={submitting}>
          <legend className="sr-only">2단계 선택 상세정보</legend>
          <p className="text-sm text-navy/70" aria-live="polite">
            아래는 선택 입력입니다. 해당되는 항목만 적어 주세요.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-navy">
              회사·기관·사무소명
              <input
                className={INPUT}
                value={form.orgName}
                onChange={(e) => update("orgName", e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              직책
              <input
                className={INPUT}
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              부동산 소재지
              <input
                className={INPUT}
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              예상 건수
              <select
                className={INPUT}
                value={form.sizeBand}
                onChange={(e) =>
                  update("sizeBand", e.target.value as ProjectSizeBand)
                }
              >
                <option value="">선택</option>
                {SIZE_BAND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-navy">
              희망 일정
              <input
                className={INPUT}
                value={form.desiredDate}
                onChange={(e) => update("desiredDate", e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              잔금일·사용승인일·마감일
              <input
                className={INPUT}
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-navy">
              현재 준비 단계
              <select
                className={INPUT}
                value={form.prepStage}
                onChange={(e) => update("prepStage", e.target.value as PrepStage)}
              >
                <option value="">선택</option>
                {PREP_STAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-navy">
              선호 연락 방법
              <input
                className={INPUT}
                value={form.preferredContact}
                onChange={(e) => update("preferredContact", e.target.value)}
                placeholder="전화 / 카카오 / 이메일"
              />
            </label>
          </div>

          {showDelegation ? (
            <div className="grid gap-4 rounded-lg border border-beige-dark bg-beige/20 p-4 sm:grid-cols-2">
              <p className="sm:col-span-2 text-sm font-semibold text-navy">
                복대리·접수 관련
              </p>
              <label className="block text-sm font-medium text-navy">
                관할 등기소
                <input
                  className={INPUT}
                  value={form.registryOffice}
                  onChange={(e) => update("registryOffice", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                접수 희망일
                <input
                  className={INPUT}
                  value={form.receiptDate}
                  onChange={(e) => update("receiptDate", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                보정 여부
                <input
                  className={INPUT}
                  value={form.correctionStatus}
                  onChange={(e) => update("correctionStatus", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                원본서류 전달 방식
                <input
                  className={INPUT}
                  value={form.deliveryMethod}
                  onChange={(e) => update("deliveryMethod", e.target.value)}
                />
              </label>
            </div>
          ) : null}

          {showPreservation ? (
            <div className="grid gap-4 rounded-lg border border-beige-dark bg-beige/20 p-4 sm:grid-cols-2">
              <p className="sm:col-span-2 text-sm font-semibold text-navy">
                보존등기 관련
              </p>
              <label className="block text-sm font-medium text-navy">
                건물 유형
                <input
                  className={INPUT}
                  value={form.buildingType}
                  onChange={(e) => update("buildingType", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                동 수
                <input
                  className={INPUT}
                  value={form.dongCount}
                  onChange={(e) => update("dongCount", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                호실 수
                <input
                  className={INPUT}
                  value={form.unitCount}
                  onChange={(e) => update("unitCount", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                신탁 여부
                <input
                  className={INPUT}
                  value={form.trustRelated}
                  onChange={(e) => update("trustRelated", e.target.value)}
                />
              </label>
            </div>
          ) : null}

          {showBulk ? (
            <div className="grid gap-4 rounded-lg border border-beige-dark bg-beige/20 p-4 sm:grid-cols-2">
              <p className="sm:col-span-2 text-sm font-semibold text-navy">
                집단·대량등기 관련
              </p>
              <label className="block text-sm font-medium text-navy">
                목록 파일 보유 여부
                <input
                  className={INPUT}
                  value={form.listingFile}
                  onChange={(e) => update("listingFile", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                후속 이전·설정·말소 여부
                <input
                  className={INPUT}
                  value={form.followOnRegs}
                  onChange={(e) => update("followOnRegs", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                담보대출 여부
                <input
                  className={INPUT}
                  value={form.loanRelated}
                  onChange={(e) => update("loanRelated", e.target.value)}
                />
              </label>
            </div>
          ) : null}

          {showPublic ? (
            <div className="grid gap-4 rounded-lg border border-beige-dark bg-beige/20 p-4 sm:grid-cols-2">
              <p className="sm:col-span-2 text-sm font-semibold text-navy">
                공공기관 관련
              </p>
              <label className="block text-sm font-medium text-navy">
                기관 유형
                <input
                  className={INPUT}
                  value={form.agencyType}
                  onChange={(e) => update("agencyType", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                계약·입찰 여부
                <input
                  className={INPUT}
                  value={form.bidRelated}
                  onChange={(e) => update("bidRelated", e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                견적 제출 기한
                <input
                  className={INPUT}
                  value={form.quoteDeadline}
                  onChange={(e) => update("quoteDeadline", e.target.value)}
                />
              </label>
            </div>
          ) : null}

          <label className="block text-sm font-medium text-navy">
            추가 설명
            <textarea
              className={`${INPUT} min-h-24`}
              value={form.extra}
              onChange={(e) => update("extra", e.target.value)}
            />
          </label>
        </fieldset>
      )}

      <div className="space-y-3 border-t border-beige-dark pt-4">
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
          </div>
        ) : null}

        {submitting ? (
          <p className="flex items-center gap-2 text-sm text-navy/70" aria-live="polite">
            <span className="inquiry-form__spinner" aria-hidden />
            문의 내용을 안전하게 전달하는 중입니다…
          </p>
        ) : null}

        {step === 1 ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={goStep2}
              disabled={submitting}
              className="btn-secondary inline-flex min-h-12 items-center px-6 disabled:opacity-60"
            >
              상세정보 추가(선택)
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex min-h-12 items-center gap-2 px-6 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="inquiry-form__spinner inquiry-form__spinner--button" aria-hidden />
                  전송 중…
                </>
              ) : (
                "1단계만으로 보내기"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={submitting}
              className="btn-secondary inline-flex min-h-12 items-center px-6 disabled:opacity-60"
            >
              이전
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex min-h-12 items-center gap-2 px-6 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="inquiry-form__spinner inquiry-form__spinner--button" aria-hidden />
                  전송 중…
                </>
              ) : (
                "문의 보내기"
              )}
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-1 text-xs leading-relaxed text-navy/55">
        <li>제출하시면 사무소 이메일로 안전하게 전달됩니다.</li>
        <li>사이트에는 개인정보를 저장하지 않습니다.</li>
        <li>초기 문의에는 민감한 원본서류를 첨부하지 마세요.</li>
      </ul>
    </form>
  );
}
