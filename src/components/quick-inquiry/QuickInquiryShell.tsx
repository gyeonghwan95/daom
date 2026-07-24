"use client";

import { useEffect, useRef } from "react";
import { quickInquiryCopy as copy } from "@/lib/quick-inquiry/copy";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { QuickInquiryForm } from "./QuickInquiryForm";
import { useQuickInquiry } from "./QuickInquiryProvider";
import { useBodyScrollLock, useDialogIds, useFocusTrap } from "./useDialogA11y";

export function QuickInquiryShell() {
  const { open, closeInquiry, pageTitle, pageUrl } = useQuickInquiry();
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const ids = useDialogIds("qi-shell");

  useFocusTrap(open, panelRef);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInquiry();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeInquiry]);

  if (!open) return null;

  return (
    <div className="quick-inquiry-overlay" role="presentation">
      <button
        type="button"
        className="quick-inquiry-overlay__backdrop"
        aria-label="문의 창 닫기"
        onClick={closeInquiry}
      />
      <div
        ref={panelRef}
        className={`quick-inquiry-panel${reducedMotion ? " quick-inquiry-panel--reduced" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ids.titleId}
        aria-describedby={ids.descId}
      >
        <div className="quick-inquiry-panel__chrome">
          <button
            type="button"
            className="quick-inquiry-panel__close"
            onClick={closeInquiry}
            aria-label="닫기"
          >
            <span aria-hidden>×</span>
          </button>
          <h2 id={ids.titleId} className="quick-inquiry-panel__title">
            {copy.title}
          </h2>
          <p id={ids.descId} className="quick-inquiry-panel__desc">
            {copy.description}
          </p>
        </div>
        <div className="quick-inquiry-panel__body">
          <QuickInquiryForm
            pageTitle={pageTitle}
            pageUrl={pageUrl}
            onClose={closeInquiry}
          />
        </div>
      </div>
    </div>
  );
}
