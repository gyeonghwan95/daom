"use client";

import { InquiryStartButton } from "@/components/consultation/InquiryStartButton";
import { CONSULT_SITUATIONS } from "@/lib/consult-wizard/catalog";
import { CONTACT_INQUIRY_PATH } from "@/lib/consultation-inquiry";

type ConsultSituationPickerProps = {
  pageTitle: string;
  className?: string;
};

/**
 * 간편 상담 랜딩 첫 화면 — 문의 양식의 첫 질문(상황 선택)을 본문에 바로 펼쳐 둔다.
 * 하나를 누르면 그 상황이 선택된 채로 양식이 열려, "문의하러 왔는데 글부터 나오는" 단계를 없앤다.
 */
export function ConsultSituationPicker({ pageTitle, className = "" }: ConsultSituationPickerProps) {
  return (
    <div
      className={`rounded-2xl border border-beige-dark bg-white p-4 shadow-sm sm:p-5 ${className}`.trim()}
      role="group"
      aria-labelledby="consult-picker-heading"
    >
      <p className="text-xs font-semibold text-navy/60">상담하기 · 1단계</p>
      <h2 id="consult-picker-heading" className="mt-1 text-lg font-bold text-navy">
        어떤 상황인가요?
      </h2>
      <p className="mt-1 text-sm text-navy/70">
        가장 가까운 항목을 누르면 바로 이어서 연락처만 남기시면 됩니다.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {CONSULT_SITUATIONS.map((situation) => (
          <li key={situation.id}>
            <InquiryStartButton
              source="landing"
              note={pageTitle}
              presetSituationIds={[situation.id]}
              fallbackHref={CONTACT_INQUIRY_PATH}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-beige-dark bg-cream/40 px-4 py-3 text-left text-[0.95rem] font-semibold text-navy transition hover:border-navy/40 hover:bg-white"
            >
              <span>{situation.label}</span>
              <span aria-hidden className="text-navy/40">
                →
              </span>
            </InquiryStartButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
