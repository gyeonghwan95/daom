"use client";

import { useCallback, useState } from "react";
import { trackB2BEvent } from "@/lib/analytics/track-b2b";

type SharePrintBarProps = {
  title: string;
  sourcePage: string;
  printLabel?: string;
};

export function SharePrintBar({
  title,
  sourcePage,
  printLabel = "인쇄",
}: SharePrintBarProps) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    trackB2BEvent("b2b_share_click", { source_page: sourcePage });

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url, text: title });
        return;
      } catch {
        /* fall through */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [sourcePage, title]);

  const copyLink = useCallback(async () => {
    const url = window.location.href;
    trackB2BEvent("b2b_share_click", {
      source_page: sourcePage,
      contact_method: "copy",
    });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [sourcePage]);

  const emailShare = useCallback(() => {
    trackB2BEvent("b2b_email_click", { source_page: sourcePage });
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${title}\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [sourcePage, title]);

  const printPage = useCallback(() => {
    trackB2BEvent("b2b_print_click", { source_page: sourcePage });
    window.print();
  }, [sourcePage]);

  return (
    <div className="b2b-share-bar flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={copyLink}
        className="btn-secondary inline-flex min-h-10 items-center px-3 text-sm"
      >
        {copied ? "링크 복사됨" : "링크 복사"}
      </button>
      <button
        type="button"
        onClick={share}
        className="btn-secondary inline-flex min-h-10 items-center px-3 text-sm"
      >
        공유
      </button>
      <button
        type="button"
        onClick={emailShare}
        className="btn-secondary inline-flex min-h-10 items-center px-3 text-sm"
      >
        이메일로 전달
      </button>
      <button
        type="button"
        onClick={printPage}
        className="btn-secondary inline-flex min-h-10 items-center px-3 text-sm"
      >
        {printLabel}
      </button>
    </div>
  );
}
