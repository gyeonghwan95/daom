"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
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
import { getBusinessEmail } from "@/lib/business-info";
import { getContactInfo, getDirectConsultationChannels } from "@/lib/contact";
import { getPrimaryInquiryForm } from "@/lib/consultation";

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
  "mt-1.5 w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2";

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
  const channels = getDirectConsultationChannels();
  const { phone } = getContactInfo();
  const email = getBusinessEmail();
  const primaryForm = getPrimaryInquiryForm();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(() => ({
    ...initial,
    ...mapFromSearchParams(searchParams),
  }));
  const [submitted, setSubmitted] = useState(false);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackB2BEvent("project_brief_start", { source_page: sourcePage });
  }, [sourcePage]);

  const mailtoHref = useMemo(() => {
    if (!email) return null;
    const subject = encodeURIComponent(
      `[협업문의] ${serviceLabel(form.service) || partnerLabel(form.partner) || "문의"}`,
    );
    return `mailto:${email}?subject=${subject}&body=${encodeURIComponent(buildBody(form))}`;
  }, [email, form]);

  const step1Valid =
    form.partner !== "" &&
    form.service !== "" &&
    form.name.trim().length > 0 &&
    (form.phone.trim().length > 0 || form.email.trim().length > 0) &&
    form.summary.trim().length > 0 &&
    form.agreed;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goStep2() {
    if (!step1Valid) {
      setErrorSummary(
        "문의자 유형, 업무 유형, 담당자명, 전화 또는 이메일, 문의 내용, 개인정보 동의를 확인해 주세요.",
      );
      return;
    }
    setErrorSummary(null);
    setStep(2);
    trackB2BEvent("project_brief_step_complete", {
      source_page: sourcePage,
      partner_type: form.partner || undefined,
      service_type: form.service || undefined,
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!step1Valid) {
      setStep(1);
      setErrorSummary("필수 항목을 확인해 주세요.");
      return;
    }

    trackB2BEvent("project_brief_submit", {
      source_page: sourcePage,
      partner_type: form.partner || undefined,
      service_type: form.service || undefined,
      lead_size_band: form.sizeBand || undefined,
      urgency_band: form.prepStage === "urgent" ? "urgent" : undefined,
    });

    if (primaryForm) {
      window.open(primaryForm.url, "_blank", "noopener,noreferrer");
      setSubmitted(true);
      return;
    }
    if (mailtoHref) {
      window.location.href = mailtoHref;
      setSubmitted(true);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card-surface space-y-4 p-5 md:p-8" id="project-brief">
        <h2 className="section-heading">문의 내용을 확인할 수 있는 연락 방법으로 연결합니다</h2>
        <p className="body-text text-navy/80">
          {primaryForm
            ? "외부 문의 양식이 열렸습니다. 아래 내용을 양식에 붙여 넣어 주시면 검토가 수월합니다."
            : mailtoHref
              ? "메일 앱으로 내용이 전달됩니다. 전화·카카오톡으로도 같은 요약을 보내 주셔도 됩니다."
              : "아래 연락 방법 중 편한 방법으로 내용을 보내 주세요."}
        </p>
        <pre className="whitespace-pre-wrap rounded-xl border border-beige-dark bg-beige/30 p-4 text-sm leading-relaxed text-navy/85">
          {buildBody(form)}
        </pre>
        <ConsultationButtons channels={channels} theme="light" layout="grid" />
        <p className="text-sm text-navy/65">
          전화 {phone} · 개인 상담은{" "}
          <Link href="/contact" className="underline">
            상담 안내
          </Link>
          를 이용해 주세요.
        </p>
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
      onSubmit={handleSubmit}
      className="card-surface space-y-5 p-5 md:p-8"
      noValidate
      aria-labelledby="project-brief-title"
    >
      <div>
        <h2 id="project-brief-title" className="section-heading">
          협업·프로젝트 문의
        </h2>
        <p className="body-text mt-2 text-sm text-navy/75">
          2단계로 나뉘어 있습니다. 1단계에서 필수 항목만 입력해도 됩니다.
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
        <fieldset className="space-y-4">
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
              문의 처리를 위한 개인정보 수집·이용에 동의합니다. 민감 원본서류는
              초기 문의에 첨부하지 않습니다.
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={goStep2}
              className="btn-primary inline-flex min-h-12 items-center px-6"
            >
              상세정보 추가(선택)
            </button>
            <button
              type="submit"
              className="btn-secondary inline-flex min-h-12 items-center px-6"
            >
              1단계만으로 보내기
            </button>
          </div>
        </fieldset>
      ) : (
        <fieldset className="space-y-4">
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary inline-flex min-h-12 items-center px-6"
            >
              이전
            </button>
            <button
              type="submit"
              className="btn-primary inline-flex min-h-12 items-center px-6"
            >
              문의 내용 보내기
            </button>
          </div>
        </fieldset>
      )}

      <p className="text-xs leading-relaxed text-navy/55">
        초기 문의에는 민감한 원본서류를 첨부하지 마세요. 자료 확인이 필요한 경우
        안전한 전달 방법을 별도로 안내합니다.
      </p>
    </form>
  );
}
