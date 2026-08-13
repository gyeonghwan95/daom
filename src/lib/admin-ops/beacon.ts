import type { AnalyticsEventInput } from "@/lib/admin-ops/types";
import { classifyReferrer, normalizePath } from "@/lib/admin-ops/utils";

const PV_DEDUPE_MS = 1500;
const pvStamp = new Map<string, number>();

function shouldSkipDuplicatePageView(path: string): boolean {
  const now = Date.now();
  const prev = pvStamp.get(path) || 0;
  if (now - prev < PV_DEDUPE_MS) return true;
  pvStamp.set(path, now);
  try {
    const key = `daom_pv:${path}`;
    const last = Number(sessionStorage.getItem(key) || 0);
    if (last && now - last < PV_DEDUPE_MS) return true;
    sessionStorage.setItem(key, String(now));
  } catch {
    /* private mode */
  }
  return false;
}

async function postCollect(body: string): Promise<void> {
  const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
  try {
    const res = await fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body,
      keepalive: true,
    });
    if (res.ok) return;
  } catch {
    /* fall through to sendBeacon */
  }
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const queued = navigator.sendBeacon("/api/analytics/collect", blob);
    if (queued) return;
  }
  await fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body,
    keepalive: true,
  });
}

/**
 * Fire-and-forget analytics. Never throws into UI flows.
 * No PII. Admin paths skipped server-side too.
 */
export async function trackEvent(input: AnalyticsEventInput): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    const path = normalizePath(input.path || window.location.pathname);
    if (path.startsWith("/admin")) return;
    if (input.type === "page_view" && shouldSkipDuplicatePageView(path)) return;

    let referrerHost: string | undefined;
    try {
      if (document.referrer) referrerHost = new URL(document.referrer).host;
    } catch {
      referrerHost = undefined;
    }

    const deviceType =
      window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";

    let campaign = input.campaign;
    if (!campaign) {
      try {
        const utm = new URLSearchParams(window.location.search).get("utm_source");
        if (utm) campaign = utm.slice(0, 80);
      } catch {
        /* ignore */
      }
    }

    let referrerType =
      input.referrerType ??
      classifyReferrer(input.referrerHost ?? referrerHost, window.location.hostname);
    if (input.type === "page_view") {
      try {
        const entryKey = "daom_analytics_entry";
        if (sessionStorage.getItem(entryKey)) {
          referrerType = "internal";
        } else {
          sessionStorage.setItem(entryKey, "1");
        }
      } catch {
        /* private mode */
      }
    }
    if (campaign && referrerType === "direct") referrerType = "campaign";

    const payload = {
      type: input.type,
      path,
      referrerHost: input.referrerHost ?? referrerHost,
      referrerType,
      campaign,
      deviceType: input.deviceType ?? deviceType,
      meta: input.meta,
    };

    await postCollect(JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}
