/**
 * 상담 위저드 분석 — 개인정보(이름·연락처·메모) 절대 전송 금지
 */
export type ConsultAnalyticsEvent =
  | "consult_start"
  | "consult_step"
  | "consult_complete"
  | "consult_abandon";

export type ConsultAnalyticsPayload = {
  event: ConsultAnalyticsEvent;
  step?: number;
  source?: string;
  pagePath?: string;
  /** 상황 id 목록만 (라벨·메모 제외) */
  situationIds?: string[];
};

export function trackConsultEvent(payload: ConsultAnalyticsPayload): void {
  if (typeof window === "undefined") return;

  const safe: Record<string, string | number | undefined> = {
    event: payload.event,
    step: payload.step,
    source: payload.source,
    page_path: payload.pagePath
      ? payload.pagePath.replace(/\?.*$/, "").slice(0, 200)
      : undefined,
    situation_ids: payload.situationIds?.slice(0, 12).join(",") || undefined,
  };

  // strip undefined
  for (const key of Object.keys(safe)) {
    if (safe[key] === undefined) delete safe[key];
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[trackConsult]", safe);
  }

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", payload.event, safe);
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ ...safe });
    }
  } catch {
    /* analytics optional */
  }
}
