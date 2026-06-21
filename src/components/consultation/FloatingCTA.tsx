"use client";

import { useState } from "react";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { ChatIcon } from "@/components/consultation/ConsultationIcons";
import { getDirectConsultationChannels } from "@/lib/contact";

export function FloatingCTA() {
  const [open, setOpen] = useState(false);
  const channels = getDirectConsultationChannels();

  return (
    <div
      className="fixed bottom-6 right-4 z-40 hidden lg:block"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="relative">
        {open && (
          <div className="absolute bottom-full right-0 mb-3 w-72 rounded-2xl border border-beige-dark bg-white p-4 shadow-xl">
            <p className="text-sm font-semibold text-navy">상담 방법 선택</p>
            <p className="mt-1 text-xs leading-relaxed text-navy/65">
              전화걸기, 카카오톡, 네이버 톡톡 중 편한 방법을 선택해 주세요.
            </p>
            <div className="mt-3">
              <ConsultationButtons
                channels={channels}
                theme="light"
                layout="stack"
                showLabels="full"
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "상담 메뉴 닫기" : "상담 메뉴 열기"}
          className="inline-flex min-h-14 min-w-[8.5rem] cursor-pointer items-center justify-center gap-2 rounded-full bg-navy px-5 text-base font-semibold text-white shadow-lg transition-transform hover:bg-navy-dark active:scale-95"
        >
          <ChatIcon className="h-5 w-5 shrink-0" />
          {open ? "닫기" : "상담하기"}
        </button>
      </div>
    </div>
  );
}
