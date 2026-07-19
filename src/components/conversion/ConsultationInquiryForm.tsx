"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import {
  INQUIRY_FIELD_OPTIONS,
  getInquiryFieldLabel,
  type InquiryFieldValue,
} from "@/lib/service-conversion/inquiry-fields";
import { INQUIRY_RELAXED_NOTE } from "@/lib/service-conversion/copy";
import { getBusinessEmail } from "@/lib/business-info";
import { getContactInfo, getDirectConsultationChannels, getPhoneHref } from "@/lib/contact";
import { getPrimaryInquiryForm } from "@/lib/consultation";
import { consultationCopy } from "@/lib/consultation";

export type ConsultationInquiryFormProps = {
  defaultField?: string;
  /** 전국 의뢰 전용 안내·추가 입력 */
  nationwideMode?: boolean;
  /** 지역 랜딩에서 넘어온 부동산 소재 지역 */
  defaultPropertyRegion?: string;
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

function buildInquiryBody(form: FormState, nationwideMode: boolean): string {
  const fieldLabel = form.field ? getInquiryFieldLabel(form.field) : "미선택";
  const lines = [
    nationwideMode
      ? "[다옴법무사사무소 전국 의뢰 상담 신청]"
      : "[다옴법무사사무소 상담 신청]",
    `이름: ${form.name}`,
    `연락처: ${form.phone}`,
    `상담 분야: ${fieldLabel}`,
    `서류 보유: ${form.hasDocuments ? "있음" : "없음/일부만 있음"}`,
  ];

  if (nationwideMode) {
    lines.push(
      `의뢰인 거주 지역: ${form.clientRegion || "미기재"}`,
      `부동산·법인 소재 지역: ${form.propertyRegion || "미기재"}`,
      `부동산·법인 수: ${form.propertyCount || "미기재"}`,
      `상속인 수: ${form.heirCount || "미기재"}`,
      `방문 가능 여부: ${form.visitPossible || "미기재"}`,
      `연락 가능 시간: ${form.contactTime || "미기재"}`,
    );
  }

  lines.push("", "현재 상황:", form.situation);
  return lines.join("\n");
}

export function ConsultationInquiryForm({
  defaultField,
  nationwideMode = false,
  defaultPropertyRegion,
}: ConsultationInquiryFormProps) {
  const channels = getDirectConsultationChannels();
  const { phone } = getContactInfo();
  const email = getBusinessEmail();
  const primaryForm = getPrimaryInquiryForm();
  const [form, setForm] = useState<FormState>({
    ...initialState,
    field: (defaultField as InquiryFieldValue) || "",
    propertyRegion: defaultPropertyRegion ?? "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mailtoHref = useMemo(() => {
    if (!email) return null;
    const subject = encodeURIComponent(
      `[${nationwideMode ? "전국의뢰" : "상담신청"}] ${form.field ? getInquiryFieldLabel(form.field) : "문의"}`,
    );
    const body = encodeURIComponent(buildInquiryBody(form, nationwideMode));
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }, [email, form, nationwideMode]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

  const isValid =
    form.name.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.field !== "" &&
    form.situation.trim().length > 0 &&
    form.agreed;

  if (submitted) {
    return (
      <div className="card-surface space-y-4 p-5 md:p-8">
        <h2 className="section-heading">상담 신청 내용이 정리되었습니다</h2>
        <p className="body-text text-navy/80">
          {primaryForm
            ? "외부 문의 양식이 열렸습니다. 같은 내용을 양식에 붙여 넣어 주시면 검토가 수월합니다."
            : mailtoHref
              ? "메일 앱으로 내용이 전달됩니다. 카카오톡·전화로도 편하게 연락 주셔도 됩니다."
              : "아래 연락 방법 중 편한 방법으로 내용을 보내 주세요."}
        </p>
        <pre className="whitespace-pre-wrap rounded-xl border border-beige-dark bg-beige/30 p-4 text-sm leading-relaxed text-navy/85">
          {buildInquiryBody(form, nationwideMode)}
        </pre>
        <ConsultationButtons channels={channels} theme="light" layout="grid" />
        <ConsultationFeeNotice />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface space-y-5 p-5 md:p-8"
      noValidate
    >
      <div>
        <h2 className="section-heading">
          {nationwideMode ? "전국 의뢰 상담 신청" : "상담 신청"}
        </h2>
        <p className="body-text mt-2 text-navy/75">
          {nationwideMode
            ? "서류를 모두 준비하지 않아도 됩니다. 현재 알고 있는 지역과 상황만 남겨주시면 전국 진행 가능 여부와 먼저 준비할 자료부터 확인합니다."
            : `${consultationCopy.contact} ${INQUIRY_RELAXED_NOTE}`}
        </p>
      </div>

      {nationwideMode ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              의뢰인 거주 지역
            </span>
            <input
              type="text"
              name="clientRegion"
              value={form.clientRegion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, clientRegion: e.target.value }))
              }
              className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
              placeholder="예: 서울 강남구"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              부동산·법인 소재 지역
            </span>
            <input
              type="text"
              name="propertyRegion"
              value={form.propertyRegion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, propertyRegion: e.target.value }))
              }
              className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
              placeholder="예: 제주·경기 성남"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              부동산 개수 또는 법인 수
            </span>
            <input
              type="text"
              name="propertyCount"
              value={form.propertyCount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, propertyCount: e.target.value }))
              }
              className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
              placeholder="예: 부동산 2건"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              상속인 수(해당 시)
            </span>
            <input
              type="text"
              name="heirCount"
              value={form.heirCount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, heirCount: e.target.value }))
              }
              className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
              placeholder="예: 3명"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              방문 가능 여부
            </span>
            <input
              type="text"
              name="visitPossible"
              value={form.visitPossible}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, visitPossible: e.target.value }))
              }
              className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
              placeholder="예: 방문 어려움 / 일정 조율 가능"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy">
              연락 가능한 시간
            </span>
            <input
              type="text"
              name="contactTime"
              value={form.contactTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, contactTime: e.target.value }))
              }
              className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
              placeholder="예: 평일 오후"
            />
          </label>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy">
            이름 <span className="text-navy-light">*</span>
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy">
            연락처 <span className="text-navy-light">*</span>
          </span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
            placeholder="010-0000-0000"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-navy">
          상담 분야 <span className="text-navy-light">*</span>
        </span>
        <select
          name="field"
          required
          value={form.field}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              field: e.target.value as InquiryFieldValue,
            }))
          }
          className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
        >
          <option value="">선택해 주세요</option>
          {INQUIRY_FIELD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-navy">
          현재 상황 간단히 작성 <span className="text-navy-light">*</span>
        </span>
        <textarea
          name="situation"
          required
          rows={5}
          value={form.situation}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, situation: e.target.value }))
          }
          className="w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2"
          placeholder={
            nationwideMode
              ? "예: 사망일, 상속인 간 협의 여부, 해외 거주자 포함 여부, 준비된 서류"
              : "예: 잔금일이 다음 주이고 근저당 말소가 필요합니다."
          }
        />
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-beige-dark bg-beige/20 px-4 py-3">
        <input
          type="checkbox"
          name="hasDocuments"
          checked={form.hasDocuments}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, hasDocuments: e.target.checked }))
          }
          className="mt-1 h-4 w-4 shrink-0 accent-navy"
        />
        <span className="text-sm leading-relaxed text-navy/85">
          등기부등본·계약서 등 기본 서류를 일부 보유하고 있습니다.
        </span>
      </label>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="agreed"
          required
          checked={form.agreed}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, agreed: e.target.checked }))
          }
          className="mt-1 h-4 w-4 shrink-0 accent-navy"
        />
        <span className="text-sm leading-relaxed text-navy/80">
          개인정보 수집·이용에 동의합니다. 상담 목적 외 사용하지 않으며, 사이트
          서버에 저장하지 않습니다.{" "}
          <Link href="/contact" className="font-medium text-navy-light underline">
            상담 안내
          </Link>
        </span>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={!isValid}
          className="btn-primary inline-flex min-h-12 flex-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        >
          상담 신청서 제출하기
        </button>
        {phone ? (
          <a
            href={getPhoneHref(phone)}
            className="btn-secondary inline-flex min-h-12 flex-1 items-center justify-center"
          >
            전화로 일정 확인하기
          </a>
        ) : null}
      </div>

      <ConsultationFeeNotice />
    </form>
  );
}
