"use client";

import { useId, useState } from "react";
import type { ResourceCheck } from "@/data/resources/types";

/**
 * 확인사항 카드 — 체크 표시는 이 화면에서만 유지한다(서버·localStorage에 저장하지 않음).
 */
export function ResourceChecklist({ checks }: { checks: ResourceCheck[] }) {
  const baseId = useId();
  const [done, setDone] = useState<boolean[]>(() => checks.map(() => false));
  const count = done.filter(Boolean).length;

  return (
    <div>
      <p className="text-sm text-navy/60 print:hidden" aria-live="polite">
        확인한 항목 {count} / {checks.length} · 체크 표시는 이 화면을 닫으면 지워집니다
      </p>
      <ol className="mt-3 space-y-3">
        {checks.map((check, i) => {
          const id = `${baseId}-${i}`;
          return (
            <li
              key={check.title}
              className={`rounded-xl border bg-white p-4 transition-colors md:p-5 ${done[i] ? "border-navy/40 bg-cream/60" : "border-beige-dark"}`}
            >
              <div className="flex items-start gap-3">
                <input
                  id={id}
                  type="checkbox"
                  checked={done[i]}
                  onChange={(e) =>
                    setDone((prev) => prev.map((v, k) => (k === i ? e.target.checked : v)))
                  }
                  className="mt-1 h-5 w-5 shrink-0 accent-[var(--navy,#152a45)] print:hidden"
                />
                <label htmlFor={id} className="text-base font-bold leading-snug text-navy md:text-lg">
                  <span className="mr-1 text-navy/50">{i + 1}.</span>
                  {check.title}
                </label>
              </div>
              <dl className="mt-3 space-y-2 pl-8 text-[0.95rem] leading-relaxed text-navy/85">
                <div>
                  <dt className="inline font-semibold text-navy-light">왜 확인하나요 · </dt>
                  <dd className="inline">{check.why}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-navy-light">지금 할 수 있는 준비 · </dt>
                  <dd className="inline">{check.prepare}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-navy-light">추가 검토가 필요한 경우 · </dt>
                  <dd className="inline">{check.review}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
