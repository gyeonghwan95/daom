"use client";

import { quickInquiryCopy as copy } from "@/lib/quick-inquiry/copy";
import { useOptionalQuickInquiry } from "./QuickInquiryProvider";

type QuickInquiryInlineCardProps = {
  pageTitle: string;
  pageUrl?: string;
  className?: string;
};

export function QuickInquiryInlineCard({
  pageTitle,
  pageUrl,
  className = "",
}: QuickInquiryInlineCardProps) {
  const inquiry = useOptionalQuickInquiry();

  return (
    <aside
      className={`quick-inquiry-inline ${className}`.trim()}
      aria-label="간편 문의"
    >
      <h2 className="quick-inquiry-inline__title">{copy.inlineTitle}</h2>
      <p className="quick-inquiry-inline__desc">{copy.inlineDescription}</p>
      <button
        type="button"
        className="btn-primary quick-inquiry-inline__btn"
        onClick={() =>
          inquiry?.openInquiry({
            pageTitle,
            pageUrl,
            source: "inline",
          })
        }
        disabled={!inquiry}
      >
        {copy.inlineButton}
      </button>
    </aside>
  );
}
