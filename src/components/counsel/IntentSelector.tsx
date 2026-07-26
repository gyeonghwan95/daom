"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  CounselIntentCategory,
  CounselIntentStage,
  CounselSelectorResult,
} from "@/lib/counsel-intent/types";
import {
  resolveBusinessSelector,
  resolveCounselSelector,
} from "@/lib/counsel-intent/content";

const CATEGORIES: { id: CounselIntentCategory; label: string }[] = [
  { id: "inheritance", label: "상속·가족" },
  { id: "real-estate", label: "부동산·전세" },
  { id: "corporate", label: "법인·기업" },
  { id: "debt", label: "채무·회생파산" },
  { id: "collection", label: "미수금·내용증명" },
  { id: "court-docs", label: "법원서류" },
  { id: "unknown", label: "잘 모르겠음" },
];

const STAGES: { id: CounselIntentStage; label: string }[] = [
  { id: "before", label: "아직 발생 전" },
  { id: "planned", label: "계약 또는 변경 예정" },
  { id: "deadline", label: "기한이 임박함" },
  { id: "dispute", label: "상대방과 문제가 생김" },
  { id: "court-notice", label: "법원 서류를 받음" },
  { id: "preparing", label: "서류 준비 중" },
  { id: "unsure", label: "정확히 모름" },
];

type IntentSelectorProps = {
  variant?: "counsel" | "business";
  className?: string;
};

export function IntentSelector({
  variant = "counsel",
  className,
}: IntentSelectorProps) {
  const [category, setCategory] = useState<CounselIntentCategory | null>(null);
  const [stage, setStage] = useState<CounselIntentStage | null>(null);

  const results: CounselSelectorResult[] = useMemo(() => {
    if (!category || !stage) return [];
    return variant === "business"
      ? resolveBusinessSelector(category, stage)
      : resolveCounselSelector(category, stage);
  }, [category, stage, variant]);

  return (
    <div
      className={
        className ??
        "rounded-2xl border border-beige-dark bg-cream/30 p-4 sm:p-5"
      }
    >
      <p className="text-sm font-semibold text-navy">
        어떤 문제에 가까운가요?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setCategory(item.id);
              setStage(null);
            }}
            className={`min-h-10 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
              category === item.id
                ? "border-navy bg-navy text-white"
                : "border-beige-dark bg-white text-navy hover:bg-cream"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {category ? (
        <>
          <p className="mt-5 text-sm font-semibold text-navy">
            현재 어떤 단계인가요?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {STAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStage(item.id)}
                className={`min-h-10 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                  stage === item.id
                    ? "border-navy bg-navy text-white"
                    : "border-beige-dark bg-white text-navy hover:bg-cream"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-5 space-y-3">
          <p className="text-sm text-navy/70">
            자동으로 법률 결론이나 승소 가능성을 판단하지 않습니다. 관련
            안내와 준비자료만 연결합니다.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <li
                key={item.href}
                className="rounded-xl border border-beige-dark bg-white p-4"
              >
                <h3 className="font-semibold text-navy">
                  <Link
                    href={item.href}
                    className="underline-offset-2 hover:underline"
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-navy/70">{item.note}</p>
                {item.documents?.length ? (
                  <p className="mt-2 text-xs text-navy/55">
                    준비자료: {item.documents.join(", ")}
                  </p>
                ) : null}
                {item.deadlineHint ? (
                  <p className="mt-2 text-xs font-medium text-navy/75">
                    확인할 기한: {item.deadlineHint}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={variant === "business" ? "/기업업무문의" : "/contact"}
              className="btn-primary"
            >
              {variant === "business"
                ? "기업 업무 문의하기"
                : "상담 가능 업무 문의하기"}
            </Link>
            <Link
              href={variant === "business" ? "/부산법인등기" : "/상담"}
              className="btn-secondary"
            >
              {variant === "business"
                ? "법인등기 변경사항 확인"
                : "상황 선택형 상담 시작"}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
