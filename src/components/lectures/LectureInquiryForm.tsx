"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FormIcon,
  KakaoIcon,
  NaverIcon,
} from "@/components/consultation/ConsultationIcons";
import { trackCTA } from "@/lib/analytics/track-cta";
import { getBusinessEmail } from "@/lib/business-info";
import { getContactInfo } from "@/lib/contact";

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

export function LectureInquiryForm() {
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
  const summary = useMemo(
    () => summaryLines.filter((line) => line !== "[법률 강의 문의]").join(" / "),
    [summaryLines],
  );

  const { kakao, naverTalk } = getContactInfo();
  const officeEmail = getBusinessEmail();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!agree) return;
    const url = `/contact/inquiry?topic=${encodeURIComponent("법률강의")}&memo=${encodeURIComponent(summary)}`;
    window.location.href = url;
  }

  function ensureReady(form: HTMLFormElement | null): boolean {
    if (form && !form.checkValidity()) {
      form.reportValidity();
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

  async function deliverByMail(form: HTMLFormElement | null) {
    if (!ensureReady(form)) return;
    trackCTA("contact", "강의문의");
    const subject = encodeURIComponent(
      `[법률강의 문의] ${institution || "기관명 미정"} · ${topic}`,
    );
    const body = encodeURIComponent(summaryMultiline);
    setDeliveryNote("메일 앱이 열립니다. 내용을 확인한 뒤 보내 주세요.");
    window.location.href = `mailto:${officeEmail}?subject=${subject}&body=${body}`;
  }

  async function deliverByChat(
    channel: "kakao" | "naver",
    href: string,
    form: HTMLFormElement | null,
  ) {
    if (!ensureReady(form)) return;
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-beige-dark bg-cream/50 p-5 md:p-6"
      aria-label="법률 강의 문의"
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-navy">강의·출강 문의 양식</h2>
        <p className="text-sm text-navy/70">
          초기 단계에서는 기관·대상·주제·일정만 받습니다. 주민등록번호·사건
          상세·건강정보 등 민감정보는 적지 마세요.
        </p>
        <p className="flex flex-wrap items-center gap-2 text-sm text-navy/80">
          <RequiredBadge />
          <span>
            표시가 있는 항목은 반드시 입력해 주세요. 나머지는 선택 사항입니다.
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="기관명" required>
          <input
            required
            aria-required="true"
            className={fieldControlClass(true)}
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </Field>
        <Field label="담당자명" required>
          <input
            required
            aria-required="true"
            className={fieldControlClass(true)}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </Field>
        <Field label="연락처" required>
          <input
            required
            aria-required="true"
            className={fieldControlClass(true)}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="회신 가능한 번호"
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
        <Field label="교육 대상" required>
          <input
            required
            aria-required="true"
            className={fieldControlClass(true)}
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="예: 청년 30명, 신입사원"
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
        />
        <span className="min-w-0 leading-relaxed">
          <span className="mb-1 flex flex-wrap items-center gap-2 font-semibold">
            개인정보 수집 동의
            <RequiredBadge />
          </span>
          문의 처리를 위한 연락처·기관 정보 수집에 동의합니다. (민감정보 제외)
        </span>
      </label>

      <div className="rounded-xl border border-navy/10 bg-white/80 p-3 text-xs leading-relaxed text-navy/70">
        <p className="font-semibold text-navy">문의 요약 (자동 복사·전달용)</p>
        <pre className="mt-2 whitespace-pre-wrap break-keep font-sans text-xs text-navy/75">
          {summaryMultiline}
        </pre>
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy/15 bg-navy text-cream shadow-sm">
        <div className="space-y-2 px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cream/70">
            바로 문의하기
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-cream sm:text-xl">
            작성하신 내용을 원하는 채널로 바로 전달하세요
          </h3>
          <p className="text-sm leading-relaxed text-cream/80">
            메일·카카오톡·네이버톡톡 중 편한 방법을 고르면 됩니다. 채팅 채널은
            요약을 복사한 뒤 대화창이 열려, 붙여넣기만 하면 문의가 완료됩니다.
          </p>
        </div>

        <div className="grid gap-2 p-4 sm:grid-cols-3 sm:gap-3 sm:p-5">
          <button
            type="button"
            disabled={!agree}
            onClick={(e) =>
              void deliverByMail(e.currentTarget.closest("form"))
            }
            className="interactive-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cream px-3 text-sm font-semibold text-navy hover:bg-beige disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MailIcon className="h-5 w-5 shrink-0" />
            메일로 전달
          </button>

          {kakao ? (
            <button
              type="button"
              disabled={!agree}
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
              disabled={!agree}
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

        {deliveryNote ? (
          <p
            className="border-t border-cream/15 px-4 py-3 text-sm text-cream/90 sm:px-5"
            role="status"
          >
            {deliveryNote}
          </p>
        ) : (
          <p className="border-t border-cream/15 px-4 py-3 text-sm text-cream/65 sm:px-5">
            동의 체크 후 버튼을 누르면 됩니다. 보통 영업일 기준 빠르게
            회신드립니다.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-secondary inline-flex items-center gap-2" disabled={!agree}>
          <FormIcon className="h-4 w-4" />
          홈페이지 상담 양식으로 이어가기
        </button>
        <Link href="/강사소개" className="btn-secondary">
          강사 프로필 보기
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
    return "mt-2 w-full rounded-lg border border-navy/35 bg-white px-3 py-3 text-sm text-navy shadow-[inset_3px_0_0_0_var(--navy)] outline-none ring-navy/15 focus:ring-2";
  }
  return "mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm text-navy outline-none ring-navy/15 focus:ring-2";
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
      <span className="flex flex-wrap items-center gap-2 font-semibold text-navy">
        {label}
        {required ? <RequiredBadge /> : (
          <span className="text-xs font-medium text-navy/40">선택</span>
        )}
      </span>
      {children}
    </label>
  );
}

function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
