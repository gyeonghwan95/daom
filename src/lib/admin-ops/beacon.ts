import type { AnalyticsEventInput } from "@/lib/admin-ops/types";
import { classifyReferrer } from "@/lib/admin-ops/utils";

/**
 * Fire-and-forget analytics. Never throws into UI flows.
 * No PII. Admin paths skipped server-side too.
 */
export async function trackEvent(input: AnalyticsEventInput): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    const path = input.path || window.location.pathname;
    if (path.startsWith("/admin")) return;

    let referrerHost: string | undefined;
    try {
      if (document.referrer) referrerHost = new URL(document.referrer).host;
    } catch {
      referrerHost = undefined;
    }

    const deviceType =
      window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";

    const payload = {
      type: input.type,
      path,
      referrerHost: input.referrerHost ?? referrerHost,
      referrerType:
        input.referrerType ?? classifyReferrer(input.referrerHost ?? referrerHost),
      campaign: input.campaign,
      deviceType: input.deviceType ?? deviceType,
      meta: input.meta,
    };

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/collect", blob);
      return;
    }
    await fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}
