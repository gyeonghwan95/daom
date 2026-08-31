/** Client marker so an OWNER_ADMIN session is not counted as a visitor. */

export const ANALYTICS_EXCLUDE_COOKIE = "daom_analytics_exclude";
const STORAGE_KEY = "daom_analytics_exclude";
const MAX_AGE_SEC = 8 * 60 * 60;

function cookieSecureSuffix(): string {
  if (typeof window === "undefined") return "";
  return window.location.protocol === "https:" ? "; Secure" : "";
}

export function markAdminAnalyticsExcluded(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
  try {
    document.cookie = `${ANALYTICS_EXCLUDE_COOKIE}=1; Path=/; SameSite=Strict; Max-Age=${MAX_AGE_SEC}${cookieSecureSuffix()}`;
  } catch {
    /* ignore */
  }
}

export function clearAdminAnalyticsExcluded(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${ANALYTICS_EXCLUDE_COOKIE}=; Path=/; SameSite=Strict; Max-Age=0${cookieSecureSuffix()}`;
  } catch {
    /* ignore */
  }
}

export function isAdminAnalyticsExcluded(): boolean {
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
  } catch {
    /* ignore */
  }
  try {
    const parts = String(document.cookie || "").split(";");
    for (const part of parts) {
      if (part.trim() === `${ANALYTICS_EXCLUDE_COOKIE}=1`) return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
