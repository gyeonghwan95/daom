"use client";

import { useEffect, useState } from "react";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { ChatIcon } from "@/components/consultation/ConsultationIcons";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import { useOptionalQuickInquiry } from "@/components/quick-inquiry/QuickInquiryProvider";
import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getDirectConsultationChannels } from "@/lib/contact";
import { consultWizardCopy as copy } from "@/lib/consult-wizard/copy";
import { OPEN_FLOATING_CONSULT_EVENT, consumeFloatingConsultPending } from "@/lib/floating-consult";
import { isNaverSmartPlaceConfigured } from "@/lib/naver-smartplace/cta";

/**
 * 데스크톱 플로팅: 바로 연락 채널 + 상황 선택형 상담하기 + 네이버 예약
 */
export function FloatingCTA() {
  const [open, setOpen] = useState(false);
  const channels = getDirectConsultationChannels();
  const availability = useConsultationAvailability();
  const reducedMotion = useReducedMotion();
  const inquiry = useOptionalQuickInquiry();
  const { isOpen, statusLabel, statusHint } = availability;

  useEffect(() => {
    if (consumeFloatingConsultPending()) setOpen(true);

    const openPanel = () => setOpen(true);
    window.addEventListener(OPEN_FLOATING_CONSULT_EVENT, openPanel);
    return () => window.removeEventListener(OPEN_FLOATING_CONSULT_EVENT, openPanel);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("home-floating-consult-open", open);
    return () => document.body.classList.remove("home-floating-consult-open");
  }, [open]);

  const startConsult = () => {
    setOpen(false);
    inquiry?.openInquiry({ source: "floating" });
  };

  return (
    <div
      className="floating-cta fixed bottom-6 right-4 z-40 hidden lg:block"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="relative">
        {open ? (
          <div
            className="floating-cta__panel absolute bottom-full right-0 mb-3.5 w-[20.5rem] overflow-hidden rounded-2xl border border-beige-dark bg-white shadow-xl"
            role="dialog"
            aria-label="상담 방법"
          >
            <div
              className={
                isOpen
                  ? "floating-cta__panel-status floating-cta__panel-status--live"
                  : "floating-cta__panel-status floating-cta__panel-status--away"
              }
            >
              <span
                className={`floating-cta__dot floating-cta__dot--${isOpen ? "live" : "away"}${reducedMotion ? "" : " floating-cta__dot--pulse"}`}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="floating-cta__panel-label">{statusLabel}</span>
                <span className="floating-cta__panel-hint">{statusHint}</span>
              </span>
            </div>

            <div className="floating-cta__panel-body">
              <div className="floating-cta__section">
                <p className="floating-cta__section-label">바로 연락</p>
                <ConsultationButtons
                  channels={channels}
                  theme="light"
                  layout="stack"
                  showLabels="full"
                  showQrCodes={false}
                />
              </div>

              <div className="floating-cta__divider" role="separator" />

              <div className="floating-cta__section">
                <p className="floating-cta__section-label">상황 선택 상담</p>
                <button
                  type="button"
                  className="btn-primary flex min-h-11 w-full items-center justify-center gap-2 rounded-lg"
                  onClick={startConsult}
                  disabled={!inquiry}
                >
                  <ChatIcon className="h-5 w-5 shrink-0" />
                  {copy.floatingLabel}
                </button>
                {isNaverSmartPlaceConfigured() ? (
                  <div className="mt-2">
                    <NaverSmartPlaceCta
                      variant="reservation"
                      placement="floating_panel"
                      tone="brand"
                      size="md"
                      fullWidth
                      label="네이버 예약"
                      className="!min-h-11 !rounded-lg"
                    />
                  </div>
                ) : null}
                <p
                  className={`floating-cta__section-note${reducedMotion ? "" : " floating-cta__section-note--emphasis"}`}
                >
                  채팅·신청서 상담과 별도로, 방문은 네이버에서 일정을 확인할 수
                  있습니다
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "상담 메뉴 닫기" : "상담 메뉴 열기"}
          className="floating-cta__trigger inline-flex min-h-14 min-w-[11.25rem] cursor-pointer items-center justify-center gap-2 rounded-full bg-navy px-4 text-[0.9375rem] font-semibold text-white shadow-lg transition-transform hover:bg-navy-dark active:scale-95 sm:px-5 sm:text-base"
        >
          <ChatIcon className="h-5 w-5 shrink-0" />
          <span className="floating-cta__trigger-label">
            {open ? "닫기" : copy.floatingLabel}
            {!open ? (
              <span
                className={`floating-cta__badge floating-cta__badge--${isOpen ? "live" : "away"}${reducedMotion ? " floating-cta__badge--static" : ""}`}
                aria-hidden
              />
            ) : null}
          </span>
        </button>
      </div>
    </div>
  );
}
