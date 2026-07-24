"use client";

import { useEffect, useRef, useState } from "react";
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
  const [completed, setCompleted] = useState(false);

  useFocusTrap(open, panelRef);
  useBodyScrollLock(open);

  useEffect(() => {
    if (open) setCompleted(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("quick-inquiry-open");
    return () => {
      document.body.classList.remove("quick-inquiry-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;

    const panel = panelRef.current;
    const syncKeyboardInset = () => {
      const viewport = window.visualViewport;
      if (!viewport) {
        panel.style.setProperty("--qi-keyboard-inset", "0px");
        return;
      }
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      panel.style.setProperty("--qi-keyboard-inset", `${Math.round(inset)}px`);
    };

    syncKeyboardInset();
    window.visualViewport?.addEventListener("resize", syncKeyboardInset);
    window.visualViewport?.addEventListener("scroll", syncKeyboardInset);
    window.addEventListener("resize", syncKeyboardInset);

    return () => {
      window.visualViewport?.removeEventListener("resize", syncKeyboardInset);
      window.visualViewport?.removeEventListener("scroll", syncKeyboardInset);
      window.removeEventListener("resize", syncKeyboardInset);
      panel.style.removeProperty("--qi-keyboard-inset");
    };
  }, [open]);

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
        className={`quick-inquiry-panel${reducedMotion ? " quick-inquiry-panel--reduced" : ""}${completed ? " quick-inquiry-panel--success" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ids.titleId}
        aria-describedby={completed ? undefined : ids.descId}
      >
        <div className="quick-inquiry-panel__handle" aria-hidden>
          <span className="quick-inquiry-panel__handle-bar" />
        </div>
        <div className="quick-inquiry-panel__chrome">
          <button
            type="button"
            className="quick-inquiry-panel__close"
            onClick={closeInquiry}
            aria-label="닫기"
          >
            <span aria-hidden>×</span>
          </button>
          {completed ? (
            <h2 id={ids.titleId} className="quick-inquiry-panel__title">
              접수 완료
            </h2>
          ) : (
            <>
              <h2 id={ids.titleId} className="quick-inquiry-panel__title">
                {copy.title}
              </h2>
              <p id={ids.descId} className="quick-inquiry-panel__desc">
                {copy.description}
              </p>
            </>
          )}
        </div>
        <div className="quick-inquiry-panel__body">
          <QuickInquiryForm
            pageTitle={pageTitle}
            pageUrl={pageUrl}
            onClose={closeInquiry}
            onSuccess={() => setCompleted(true)}
          />
        </div>
      </div>
    </div>
  );
}
