"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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

  const summary = useMemo(
    () =>
      [
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
      ]
        .filter(Boolean)
        .join(" / "),
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!agree) return;
    const url = `/contact/inquiry?topic=${encodeURIComponent("법률강의")}&memo=${encodeURIComponent(summary)}`;
    window.location.href = url;
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      alert("문의 요약을 복사했습니다.");
    } catch {
      alert("복사에 실패했습니다. 아래 요약 문구를 직접 선택해 주세요.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-beige-dark bg-cream/50 p-5 md:p-6"
      aria-label="법률 강의 문의"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-navy">강의·출강 문의 양식</h2>
        <p className="text-sm text-navy/70">
          초기 단계에서는 기관·대상·주제·일정만 받습니다. 주민등록번호·사건
          상세·건강정보 등 민감정보는 적지 마세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-navy">
          기관명 *
          <input
            required
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          담당자명 *
          <input
            required
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          연락처 *
          <input
            required
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="회신 가능한 번호"
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          이메일
          <input
            type="email"
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-navy">
          기관 유형
          <select
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
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
        </label>
        <label className="block text-sm font-medium text-navy">
          희망 강의 주제
          <select
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value as (typeof TOPICS)[number])}
          >
            {TOPICS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-navy">
          교육 대상 *
          <input
            required
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="예: 청년 30명, 신입사원"
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          예상 인원
          <input
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={headcount}
            onChange={(e) => setHeadcount(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          희망 날짜
          <input
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="예: 2026-09 셋째 주"
          />
        </label>
        <label className="block text-sm font-medium text-navy">
          희망 시간
          <input
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="예: 90분"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-navy">
          진행 방식
          <select
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="오프라인">오프라인</option>
            <option value="온라인">온라인</option>
            <option value="혼합">혼합</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-navy">
          예산 범위
          <select
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
            value={budget}
            onChange={(e) => setBudget(e.target.value as (typeof BUDGETS)[number])}
          >
            {BUDGETS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-navy">
        강의 장소
        <input
          className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-navy">
        교육 목적
        <textarea
          className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
          rows={3}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-navy">
        기타 요청사항
        <textarea
          className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
          rows={3}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-navy">
        <input
          type="checkbox"
          className="mt-1"
          checked={needProposal}
          onChange={(e) => setNeedProposal(e.target.checked)}
        />
        강의 제안서·강사 프로필이 필요합니다
      </label>

      <label className="flex items-start gap-2 text-sm text-navy">
        <input
          type="checkbox"
          className="mt-1"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          required
        />
        문의 처리를 위한 연락처·기관 정보 수집에 동의합니다. (민감정보 제외)
      </label>

      <div className="rounded-xl border border-navy/10 bg-white/80 p-3 text-xs leading-relaxed text-navy/70">
        <p className="font-semibold text-navy">문의 요약 (복사 가능)</p>
        <p className="mt-2 break-keep">{summary}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={!agree}>
          상담 양식으로 전달
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={copySummary}
        >
          요약 복사
        </button>
        <Link href="/강사소개" className="btn-secondary">
          강사 프로필
        </Link>
      </div>
    </form>
  );
}
