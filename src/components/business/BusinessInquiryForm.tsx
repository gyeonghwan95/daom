"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { getBusinessEmail } from "@/lib/business-info";
import { getContactInfo, getDirectConsultationChannels } from "@/lib/contact";
import { getPrimaryInquiryForm } from "@/lib/consultation";

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
  "w-full rounded-lg border border-beige-dark bg-white px-3 py-2.5 text-sm text-navy outline-none ring-navy/20 focus:ring-2";

export function BusinessInquiryForm() {
  const channels = getDirectConsultationChannels();
  const { phone } = getContactInfo();
  const email = getBusinessEmail();
  const primaryForm = getPrimaryInquiryForm();
  const kakao = channels.find((channel) => channel.id === "kakao");
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const mailtoHref = useMemo(() => {
    if (!email) return null;
    const subject = encodeURIComponent(
      `[기업문의] ${form.workType || form.companyName || "업무 문의"}`,
    );
    return `mailto:${email}?subject=${subject}&body=${encodeURIComponent(buildBody(form))}`;
  }, [email, form]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (primaryForm) {
      window.open(primaryForm.url, "_blank", "noopener,noreferrer");
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4 rounded-2xl border border-beige-dark bg-cream/40 p-5">
        <p className="font-semibold text-navy">문의 내용을 확인했습니다.</p>
        <p className="text-sm text-navy/75">
          아래 채널로도 바로 연락하실 수 있습니다. 민감정보는 보내지 마세요.
        </p>
        {mailtoHref ? (
          <a href={mailtoHref} className="btn-primary inline-flex">
            이메일로 내용 보내기
          </a>
        ) : null}
        <ConsultationButtons channels={channels} theme="light" layout="grid" />
        <Link href="/부산기업법률자문" className="text-sm font-medium text-navy underline-offset-2 hover:underline">
          기업 법률실무 허브로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-beige-dark bg-white p-5 md:p-6"
    >
      <p className="text-sm text-navy/70">
        주민등록번호, 법인인감 비밀번호, 금융·인증서 정보, 통장 전체 사본은
        기재하지 마세요.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="회사명" required>
          <input
            required
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="담당자명" required>
          <input
            required
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="부서">
          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className={INPUT_CLASS}
            placeholder="경영지원·총무·재무 등"
          />
        </Field>
        <Field label="연락처" required>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="이메일">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="기업 유형">
          <select
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
        <Field label="문의 업무" required>
          <select
            required
            value={form.workType}
            onChange={(e) => setForm({ ...form, workType: e.target.value })}
            className={INPUT_CLASS}
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
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className={INPUT_CLASS}
            placeholder="잔금일·임기만료·제출기한 등"
          />
        </Field>
      </div>
      <Field label="보유 서류">
        <input
          value={form.documents}
          onChange={(e) => setForm({ ...form, documents: e.target.value })}
          className={INPUT_CLASS}
          placeholder="등기부등본, 계약서, 세금계산서 등 (목록만)"
        />
      </Field>
      <Field label="문의 요약" required>
        <textarea
          required
          rows={5}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className={INPUT_CLASS}
          placeholder="상황과 확인하고 싶은 점을 간단히 적어 주세요."
        />
      </Field>
      <label className="flex items-start gap-2 text-sm text-navy/80">
        <input
          type="checkbox"
          required
          checked={form.agreed}
          onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
          className="mt-1"
        />
        <span>
          상담 연락을 위한 개인정보 수집·이용에 동의합니다. 민감정보는 제출하지
          않습니다.
        </span>
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary">
          기업 업무 문의하기
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-navy">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
