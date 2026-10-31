import type { AcquisitionEntry, AnalyticsEventInput } from "@/lib/admin-ops/types";
import { isAdminAnalyticsExcluded } from "@/lib/admin-ops/analytics-exclude";
import {
  bareAnalyticsHost,
  classifyReferrer,
  isExcludedAnalyticsPath,
  normalizePath,
} from "@/lib/admin-ops/utils";

/** 같은 URL 재마운트·Strict Mode·HMR·이중 전송 방지 (GA 페이지뷰 ≠ 새로고침 폭주) */
const PV_DEDUPE_MS = 30_000;
const SESSION_IDLE_MS = 30 * 60 * 1000;
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

function getSessionId(): string {
  try {
    const now = Date.now();
    const last = Number(sessionStorage.getItem("daom_sid_at") || 0);
    let sid = sessionStorage.getItem("daom_sid") || "";
    if (!sid || (last && now - last > SESSION_IDLE_MS)) {
      sid =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `s${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      sessionStorage.setItem("daom_sid", sid);
    }
    sessionStorage.setItem("daom_sid_at", String(now));
    return sid.slice(0, 36);
  } catch {
    return "";
  }
}

const ATTRIBUTION_KEY = "daom_attr";

type StoredAttribution = AcquisitionEntry & { sid: string };

function readUtm(): Pick<AcquisitionEntry, "us" | "um" | "uc"> {
  try {
    const params = new URLSearchParams(window.location.search);
    const pick = (name: string) => params.get(name)?.trim().slice(0, 60) || undefined;
    return {
      us: pick("utm_source"),
      um: pick("utm_medium"),
      uc: pick("utm_campaign"),
    };
  } catch {
    return {};
  }
}

/** 세션(sid)의 진입 정보. 같은 sid 안에서는 첫 page_view의 값을 유지한다. */
function loadAttribution(sid: string): StoredAttribution | null {
  if (!sid) return null;
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAttribution;
    return parsed?.sid === sid ? parsed : null;
  } catch {
    return null;
  }
}

function saveAttribution(attr: StoredAttribution): void {
  try {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attr));
  } catch {
    /* private mode */
  }
}

function buildEntry(path: string, referrerHost: string | undefined): AcquisitionEntry {
  const utm = readUtm();
  const channel = classifyReferrer(referrerHost, window.location.hostname);
  const ch = channel === "direct" && utm.us ? "campaign" : channel;
  const host =
    referrerHost && ch !== "internal" ? bareAnalyticsHost(referrerHost) : undefined;
  return { ch, host, ...utm, lp: path };
}

/** sendBeacon XOR fetch — 실패 시 재전송하면 서버가 이미 기록한 이벤트가 중복된다. */
function postCollect(body: string): void {
  const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    if (navigator.sendBeacon("/api/analytics/collect", blob)) return;
  }
  void fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body,
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => {
    /* fail open */
  });
}

/**
 * Fire-and-forget analytics. Never throws into UI flows.
 * No PII. Admin session and /admin paths are skipped client- and server-side.
 */
export async function trackEvent(input: AnalyticsEventInput): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    const path = normalizePath(input.path || window.location.pathname);
    if (isExcludedAnalyticsPath(path) || isAdminAnalyticsExcluded()) return;
    if (input.type === "page_view" && shouldSkipDuplicatePageView(path)) return;

    let referrerHost: string | undefined;
    try {
      if (document.referrer) referrerHost = new URL(document.referrer).host;
    } catch {
      referrerHost = undefined;
    }

    const deviceType =
      window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";

    const sid = getSessionId();
    let attribution = loadAttribution(sid);
    // 세션 첫 page_view = 진입. 30분 무활동 후 새 sid가 되면 다시 진입으로 센다.
    const entryView = input.type === "page_view" && !attribution;
    if (!attribution) {
      attribution = { sid, ...buildEntry(path, input.referrerHost ?? referrerHost) };
      if (entryView && sid) saveAttribution(attribution);
    }
    const entry: AcquisitionEntry = {
      ch: attribution.ch,
      host: attribution.host,
      us: attribution.us,
      um: attribution.um,
      uc: attribution.uc,
      lp: attribution.lp,
    };

    const campaign = input.campaign ?? entry.us;
    let referrerType = input.referrerType;
    if (!referrerType) {
      referrerType =
        input.type === "page_view" && !entryView ? "internal" : entry.ch;
    }
    if (campaign && referrerType === "direct") referrerType = "campaign";

    const meta: Record<string, string> = { ...(input.meta || {}) };
    if (sid) meta.sid = sid;

    const payload = {
      type: input.type,
      path,
      referrerHost: input.referrerHost ?? referrerHost,
      referrerType,
      campaign,
      deviceType: input.deviceType ?? deviceType,
      meta,
      entry,
      entryView,
    };

    postCollect(JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}
