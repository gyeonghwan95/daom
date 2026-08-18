import { trackEvent } from "@/lib/admin-ops/beacon";
import { parseContact } from "@/lib/quick-inquiry/shared";
import type { InquiryResult } from "@/lib/quick-inquiry/shared";

export type SubmitQuickInquiryInput = {
  message: string;
  contact: string;
  consent: boolean;
  turnstileToken: string;
  website?: string;
  pageTitle?: string;
  pageUrl?: string;
  /** 문의 유형 등 비식별 메타. 이름·전화·본문 금지. */
  analyticsMeta?: Record<string, string>;
};

export type SubmitQuickInquiryResult = InquiryResult;

export function clientParseContact(value: string) {
  return parseContact(value);
}

function resolveInquiryPath(pageUrl?: string): string {
  if (typeof window === "undefined") return "/";
  try {
    if (pageUrl) return new URL(pageUrl, window.location.origin).pathname;
  } catch {
    /* ignore */
  }
  return window.location.pathname;
}

export async function submitQuickInquiry(
  input: SubmitQuickInquiryInput,
): Promise<SubmitQuickInquiryResult> {
  const res = await fetch("/api/quick-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: input.message,
      contact: input.contact,
      consent: input.consent,
      turnstileToken: input.turnstileToken,
      website: input.website ?? "",
      pageTitle: input.pageTitle,
      pageUrl: input.pageUrl,
    }),
  });

  let data: SubmitQuickInquiryResult | null = null;
  try {
    data = (await res.json()) as SubmitQuickInquiryResult;
  } catch {
    data = null;
  }

  if (!data || typeof data !== "object") {
    return {
      ok: false,
      code: "delivery_failed",
      message: "문의 전달에 실패했습니다. 전화로 바로 문의해 주세요.",
    };
  }

  // Analytics must never block or alter inquiry UX (no PII).
  if (data.ok) {
    const meta: Record<string, string> = { ...(input.analyticsMeta || {}) };
    void trackEvent({
      type: "consultation_submit",
      path: resolveInquiryPath(input.pageUrl),
      meta: Object.keys(meta).length ? meta : undefined,
    });
  }

  return data;
}
