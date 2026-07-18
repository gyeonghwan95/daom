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

function toService(workType: string): string {
  if (workType.includes("복대리")) return "delegation";
  if (workType.includes("집단")) return "bulk";
  if (workType.includes("잔금")) return "transfer-collab";
  if (workType.includes("보존")) return "preservation";
  if (workType.includes("공공")) return "public";
  return "other";
}

export function CollabInquiryForm() {
  const [workType, setWorkType] = useState<string>(WORK_TYPES[0]);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const url = `/협업문의?service=${encodeURIComponent(toService(workType))}&type=quote`;
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
        업무 유형을 고르면 협업 문의 페이지로 이동합니다. 사건 상세·민감정보는
        초기 단계에서 받지 않습니다.
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

      <button type="submit" className="btn-primary min-h-12 w-full sm:w-auto">
        협업 문의로 이동
      </button>

      {sent ? (
        <p className="text-sm text-navy/70" aria-live="polite">
          협업 문의 페이지로 이동합니다…
        </p>
      ) : null}

      <p className="text-sm text-navy/60">
        바로 보기:{" "}
        <Link href="/partners" className="underline">
          협업 허브
        </Link>
        {" · "}
        <Link href="/협업문의" className="underline">
          협업 문의
        </Link>
      </p>
    </form>
  );
}
