import { trackEvent } from "@/lib/admin-ops/beacon";
import { hireQualMeta } from "@/lib/consultation/hire-qual";
import { parseContact } from "@/lib/quick-inquiry/shared";
import type { InquiryResult } from "@/lib/quick-inquiry/shared";
import type { AnalyticsEventType } from "@/lib/admin-ops/types";

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
  /**
   * 고객이 직접 쓴 문장만. 양식 틀 문장은 넣지 않는다.
   * 기한·주소·맡기려는 뜻이 있으면 분석에는 그 표시만 남긴다.
   */
  qualifyText?: string;
  /** 등기부·계약서처럼 맡길 서류가 준비된 경우 */
  hasDocuments?: boolean;
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

function submitEventType(
  meta?: Record<string, string>,
): AnalyticsEventType {
  const kind = meta?.kind || "";
  if (kind === "lecture") return "lecture_inquiry_submit";
  if (kind === "collaboration" || kind === "corporate-legal") {
    return "collaboration_submit";
  }
  return "consultation_submit";
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
    if (input.qualifyText != null || input.hasDocuments) {
      const qual = hireQualMeta(input.qualifyText ?? "", {
        hasDocuments: input.hasDocuments,
      });
      if (qual) meta.qual = qual;
    }
    void trackEvent({
      type: submitEventType(input.analyticsMeta),
      path: resolveInquiryPath(input.pageUrl),
      meta: Object.keys(meta).length ? meta : undefined,
    });
  }

  return data;
}
