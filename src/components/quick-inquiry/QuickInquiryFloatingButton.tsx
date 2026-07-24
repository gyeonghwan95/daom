"use client";

import { quickInquiryCopy as copy } from "@/lib/quick-inquiry/copy";
import { useQuickInquiry } from "./QuickInquiryProvider";

export function QuickInquiryFloatingButton() {
  const { open, openInquiry, closeInquiry } = useQuickInquiry();

  return (
    <div className="quick-inquiry-float print:hidden">
      <button
        type="button"
        className="quick-inquiry-float__btn"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          if (open) closeInquiry();
          else openInquiry({ source: "floating" });
        }}
      >
        <span className="quick-inquiry-float__icon" aria-hidden>
          ✎
        </span>
        <span>{open ? copy.close : copy.floatingLabel}</span>
      </button>
    </div>
  );
}
