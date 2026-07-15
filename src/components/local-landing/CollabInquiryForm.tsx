"use client";

import { useState } from "react";
import Link from "next/link";

const WORK_TYPES = [
  "등기 복대리",
  "집단등기",
  "법인등기 제휴",
  "잔금일 등기 협업",
  "보존등기 협업",
  "공공기관 등기",
  "기타",
] as const;

export function CollabInquiryForm() {
  const [workType, setWorkType] = useState<string>(WORK_TYPES[0]);
  const [volume, setVolume] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [schedule, setSchedule] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // 실제 API 연동 전: 상담 페이지로 요약 전달을 위해 query 구성
    const summary = [
      `협업유형: ${workType}`,
      volume ? `예상건수: ${volume}` : "",
      jurisdiction ? `관할: ${jurisdiction}` : "",
      schedule ? `희망일정: ${schedule}` : "",
      contact ? `회신연락처: ${contact}` : "",
    ]
      .filter(Boolean)
      .join(" / ");

    const url = `/contact/inquiry?topic=${encodeURIComponent("법무사협업")}&memo=${encodeURIComponent(summary)}`;
    window.location.href = url;
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-2xl border border-beige-dark bg-cream/40 p-5 md:p-6"
      aria-label="협업 문의"
    >
      <h2 className="text-lg font-semibold text-navy">협업 문의 (간단 양식)</h2>
      <p className="text-sm text-navy/70">
        사건 상세·민감정보는 초기 단계에서 받지 않습니다. 업무 범위·건수·관할·일정만
        알려 주세요.
      </p>

      <label className="block text-sm font-medium text-navy">
        협업 유형
        <select
          className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        >
          {WORK_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-navy">
        예상 건수
        <input
          className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          placeholder="예: 월 5건, 단지 300세대"
        />
      </label>

      <label className="block text-sm font-medium text-navy">
        대상 관할
        <input
          className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          placeholder="예: 남부산등기소, 해운대구"
        />
      </label>

      <label className="block text-sm font-medium text-navy">
        희망 일정
        <input
          className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="예: 다음 주, 입주월"
        />
      </label>

      <label className="block text-sm font-medium text-navy">
        회신 연락처
        <input
          className="mt-2 w-full rounded-lg border border-navy/15 bg-white px-3 py-3 text-sm"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="전화 또는 이메일"
          required
        />
      </label>

      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy/90"
      >
        {sent ? "문의 페이지로 이동 중…" : "업무범위와 예상 건수 협의하기"}
      </button>

      <p className="text-xs text-navy/55">
        바로 상담이 필요하시면{" "}
        <Link href="/contact" className="underline">
          상담 페이지
        </Link>
        를 이용하세요.
      </p>
    </form>
  );
}
