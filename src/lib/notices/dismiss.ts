/**
 * Public notice dismiss helpers — localStorage only (never share with admin auth).
 * Timezone: Asia/Seoul.
 */

export function getKstDateYmd(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

const UNTIL_PREFIX = "noticeDismissedUntil:";
const SESSION_PREFIX = "noticeDismissedSession:";

/** Legacy key from old floating-notice dismiss (updatedAt sticky). Cleared on migrate. */
const LEGACY_PREFIX = "noticeDismissed:";

export function isDismissedForToday(noticeId: string): boolean {
  try {
    const until = localStorage.getItem(`${UNTIL_PREFIX}${noticeId}`);
    if (!until) return false;
    return until === getKstDateYmd();
  } catch {
    return false;
  }
}

export function dismissForToday(noticeId: string): void {
  try {
    localStorage.setItem(`${UNTIL_PREFIX}${noticeId}`, getKstDateYmd());
    sessionStorage.removeItem(`${SESSION_PREFIX}${noticeId}`);
  } catch {
    /* ignore */
  }
}

export function isDismissedThisSession(noticeId: string): boolean {
  try {
    return sessionStorage.getItem(`${SESSION_PREFIX}${noticeId}`) === "1";
  } catch {
    return false;
  }
}

/** Close for this browser tab/session only — may reappear on next visit. */
export function dismissForSession(noticeId: string): void {
  try {
    sessionStorage.setItem(`${SESSION_PREFIX}${noticeId}`, "1");
  } catch {
    /* ignore */
  }
}

export function clearLegacyDismiss(noticeId: string): void {
  try {
    localStorage.removeItem(`${LEGACY_PREFIX}${noticeId}`);
  } catch {
    /* ignore */
  }
}

export function formatNoticePublishedAt(iso?: string | null): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(t));
}
